import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Comments from "./comments";

import { getAvatar } from "../../redux/actions/userActions";
import { getComments } from "../../redux/actions/commentsActions";
import { Collapse, CardBody, Card } from "reactstrap";
import { deletePost } from "../../redux/actions/postActions";

import { connect } from "react-redux";

function Post(props) {
  // console.log(props.UI.loading);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const timestamp = new Date(props.post.createdAt).getTime();
  const toggle = (event) => {
    if (isOpen === false) {
      setLoading(true);
      axios
        .get(`/posts/${props.post._id}/comments?sortBy=createdAt:desc&limit=10`)
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
  useEffect(() => {
    setIsOpen(false);
  }, [props.post]);

  return (
    <li className="post col-12 my-2">
      <div className="media col-12">
        <img
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
            <h5 className="mt-0 mb-1 user-name">{props.post.ownerName}</h5>
            <p className="time-teller">{`${moment(timestamp).fromNow()}`}</p>
            {props.userId === props.post.ownerId && (
              <button onClick={handleDelete} className="delete-button">
                <i className="fa fa-trash-o" aria-hidden="true"></i>
              </button>
            )}
          </div>

          {props.post.content}
          <br />
          <button onClick={toggle} className="comment-button">
            <i className="fa fa-commenting-o" aria-hidden="true"></i>
            {props.commentsCount}
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
  commentsCount: state.posts.postsList.find(
    (post) => post._id === ownProps.post._id
  ).commentsCount,
  userId: state.user.credentials._id,
});

export default connect(mapStateToProps, { getComments, getAvatar, deletePost })(
  Post
);
