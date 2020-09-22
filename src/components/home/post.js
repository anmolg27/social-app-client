import React, { useState, useEffect } from "react";
import beautifyName from "../../util/beautifyName";
import axios from "axios";
import moment from "moment";
import Comments from "./comments";

import { getAvatar } from "../../redux/actions/userActions";
import { getComments } from "../../redux/actions/commentsActions";
import { Collapse, CardBody, Card } from "reactstrap";
import { deletePost, updateLikes } from "../../redux/actions/postActions";

import { connect } from "react-redux";

function Post(props) {
  // console.log(props.UI.loading);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const handleProfileClick = (post) => {
    window.location.href = `/user/${post.ownerId}`;
  };
  const timestamp = new Date(props.post.createdAt).getTime();
  const toggle = (event) => {
    if (isOpen === false) {
      setLoading(true);
      axios
        .get(
          `https://anmolg27-social-app-server.herokuapp.com/posts/${props.post._id}/comments?sortBy=createdAt:desc&limit=10`
        )
        .then((res) => {
          res.data.forEach((comment) => {
            const hasImage = props.images.find(
              (ava) => ava.userId === comment.ownerId
            );
            if (!hasImage) {
              props.getAvatar(comment.ownerId);
            }
          });
          setComments(res.data.reverse());
          setLoading(false);
        })
        .catch((err) => {
          if (err.response.status === 500) {
            alert("Server is down. Please try again later :(");
            // setLoading(false);
          }
        });
    }
    setIsOpen(!isOpen);
  };
  const handleDelete = () => {
    props.deletePost(props.post._id);
  };
  const handleLike = () => {
    if (!liked) {
      axios
        .post(
          `https://anmolg27-social-app-server.herokuapp.com/posts/${props.post._id}/like`
        )
        .then(() => {
          setLiked(true);
        })
        .catch((err) => {
          alert("something went wrong");
        });
    } else {
      axios
        .post(
          `https://anmolg27-social-app-server.herokuapp.com/posts/${props.post._id}/unlike`
        )
        .then(() => {
          setLiked(false);
        })
        .catch((err) => {
          alert("something went wrong!");
        });
    }
  };
  useEffect(() => {
    setIsOpen(false);
  }, [props.post]);
  useEffect(() => {
    axios
      .get(
        `https://anmolg27-social-app-server.herokuapp.com/posts/${props.post._id}/isLiked`
      )
      .then((res) => {
        if (res.data.liked === true) setLiked(true);
        else setLiked(false);
      })
      .catch((err) => alert("something went wrong"));
  }, []);
  useEffect(() => {
    props.socket.on("newLike", ({ likes, postId }) => {
      console.log("inside and post id " + postId);
      props.updateLikes(postId, likes);
    });
    props.socket.on("unLike", ({ likes, postId }) => {
      console.log("inside and post id " + postId);
      props.updateLikes(postId, likes);
    });
  }, [props.likes]);
  return (
    <li className="post col-12 my-2">
      <div className="media col-12">
        <img
          style={{ cursor: "pointer" }}
          onClick={() => handleProfileClick(props.post)}
          height={70}
          src={
            props.ava
              ? `data:image/jpeg;base64,${props.ava.image}`
              : "/images/no-profile.jpg"
          }
          className="mr-3 post-user-image"
          alt="..."
        />
        <div className="media-body">
          <div className="name-time">
            <h5
              style={{ cursor: "pointer" }}
              onClick={() => handleProfileClick(props.post)}
              className="mt-0 mb-1 user-name"
            >
              {beautifyName(props.post.ownerName)}
            </h5>
            <p className="time-teller">{`${moment(timestamp).fromNow()}`}</p>
            {props.userId === props.post.ownerId && (
              <button onClick={handleDelete} className="delete-button">
                <i className="fa fa-trash-o" aria-hidden="true"></i>
              </button>
            )}
          </div>
          <p className="post-content">{props.post.content}</p>

          <br />
          <button
            onClick={toggle}
            className={
              isOpen === true ? "comment-button opened" : "comment-button"
            }
          >
            <i className="fa fa-commenting-o" aria-hidden="true"></i>
            {props.commentsCount}
          </button>
          <button
            onClick={handleLike}
            className={liked === true ? "like-button liked" : "like-button"}
          >
            <i className="fa fa-heart-o" aria-hidden="true"></i>
            {props.likes}
          </button>
        </div>
      </div>
      <Collapse isOpen={isOpen}>
        <Card className="container comments-container">
          <CardBody>
            {isOpen === true ? (
              <Comments
                // incrementCommentsCount={incrementCommentsCount}
                postId={props.post._id}
                socket={props.socket}
                loading={loading}
                comments={comments}
              />
            ) : null}
          </CardBody>
        </Card>
      </Collapse>
    </li>
  );
}

const mapStateToProps = (state, ownProps) => ({
  images: state.images,
  likes:
    state.posts.postsList.length > 0
      ? state.posts.postsList.find((post) => post._id === ownProps.post._id)
          .likes
      : null,
  commentsCount:
    state.posts.postsList.length > 0
      ? state.posts.postsList.find((post) => post._id === ownProps.post._id)
          .commentsCount
      : null,
  userId: state.user.credentials._id,
});

export default connect(mapStateToProps, {
  getComments,
  getAvatar,
  deletePost,
  updateLikes,
})(Post);
