import React, { useState, useEffect } from "react";
import beautifyName from "../../util/beautifyName";
import { Row, Collapse, Card, CardBody } from "reactstrap";
import SideNav from "../home/sideNav";
import Comments from "./comments";
import axios from "axios";
import moment from "moment";
import { connect } from "react-redux";
import { getAvatar } from "../../redux/actions/userActions";
function Post(props) {
  const [post, setPost] = useState({});
  const [postLoading, setPostLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  console.log(comments);
  const updateCommentsCount = (postId, commentsCount) => {
    setPost((prevState) => ({ ...prevState, commentsCount }));
  };
  useEffect(() => {
    setCommentsLoading(true);
    axios
      .get(
        `https://anmolg27-social-app-server.herokuapp.com/posts/${props.paramPostId}/comments?sortBy=createdAt:desc&limit=10`
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
        setCommentsLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 500) {
          alert("Server is down. Please try again later :(");
        }
      });
  }, [props.paramPostId]);
  useEffect(() => {
    setPostLoading(true);
    axios
      .get(
        `https://anmolg27-social-app-server.herokuapp.com/singlePost/${props.paramPostId}`
      )
      .then((res) => {
        console.log(res.data._doc);
        setPostLoading(false);
        setPost(res.data._doc);
        const tempAva = props.images.find(
          (image) => image.userId === res._doc.ownerId
        );
        if (!tempAva) props.getAvatar(res._doc.ownerId);
      })
      .catch((e) => {
        // setError("Something went wrong! Please try again later");
      });
    return () => {
      setPost({});
      // setError(null);
      setPostLoading(false);
      setCommentsLoading(false);
    };
  }, [props.paramPostId]);
  useEffect(() => {
    axios
      .get(
        `https://anmolg27-social-app-server.herokuapp.com/posts/${props.paramPostId}/isLiked`
      )
      .then((res) => {
        if (res.data.liked === true) setLiked(true);
        else setLiked(false);
      })
      .catch((err) => alert("something went wrong"));
  }, [props.paramPostId]);

  useEffect(() => {
    props.socket.on("newLike", ({ likes, postId }) => {
      setPost((prevPost) => ({ ...prevPost, likes: likes }));
    });
    props.socket.on("unLike", ({ likes, postId }) => {
      setPost((prevPost) => ({ ...prevPost, likes: likes }));
    });
  }, [post.likes, props.paramPostId]);

  const handleLike = (postId) => {
    if (!liked) {
      axios
        .post(
          `https://anmolg27-social-app-server.herokuapp.com/posts/${postId}/like`
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
          `https://anmolg27-social-app-server.herokuapp.com/posts/${postId}/unlike`
        )
        .then(() => {
          setLiked(false);
        })
        .catch((err) => {
          alert("something went wrong!");
        });
    }
  };
  let ava = null;
  if (post) {
    ava = props.images.find((image) => image.userId === post.ownerId);
  }

  return (
    <div className="home-container">
      <Row>
        <div className="px-0 mx-0 container col-md-2 d-md-block d-none">
          <div className="side-nav-container">
            <SideNav />
          </div>
        </div>
        {postLoading && (
          <div className="col-md-10" style={{ textAlign: "center" }}>
            <div
              className="loading"
              style={{
                display: "inline-flex",
                paddingTop: "50px",
                paddingBottom: "20px",
                justifyContent: "center",
              }}
            >
              <div
                className="loading-spinner spinner-border text-success"
                role="status"
                style={{ height: "12vw", width: "12vw", fontSize: "30px" }}
              ></div>
            </div>
          </div>
        )}

        {post && (
          <div className="col-md-10">
            <div className="post col-md-7 col-12 my-2">
              <div className="media col-12">
                <img
                  height={70}
                  src={
                    ava
                      ? `data:image/jpeg;base64,${ava.image}`
                      : "/images/no-profile.jpg"
                  }
                  className="mr-3 post-user-image"
                  alt="..."
                />
                <div className="media-body">
                  <div className="name-time">
                    <h5 className="mt-0 mb-1 user-name">
                      {beautifyName(props.userName)}
                    </h5>
                    <p className="time-teller">{`${moment(
                      new Date(post.createdAt).getTime()
                    ).fromNow()}`}</p>
                  </div>
                  <p className="post-content">{post.content}</p>

                  <br />
                  <div
                    //   onClick={toggle}
                    className="comment-button opened"
                    style={{ float: "left" }}
                  >
                    <i className="fa fa-commenting-o" aria-hidden="true"></i>
                    {post.commentsCount}
                  </div>
                  <button
                    style={{ float: "left" }}
                    onClick={() => handleLike(post._id)}
                    className={
                      liked === true ? "like-button liked" : "like-button"
                    }
                  >
                    <i className="fa fa-heart-o" aria-hidden="true"></i>
                    {post.likes}
                  </button>
                </div>
              </div>
              <Collapse isOpen={true}>
                <Card className="container comments-container">
                  <CardBody>
                    <Comments
                      updateCommentsCount={updateCommentsCount}
                      postId={props.paramPostId}
                      socket={props.socket}
                      loading={commentsLoading}
                      comments={comments}
                    />
                  </CardBody>
                </Card>
              </Collapse>
            </div>
          </div>
        )}
      </Row>
    </div>
  );
}
const mapStateToProps = (state) => ({
  images: state.images,
  userName: state.user.credentials.name,
});

export default connect(mapStateToProps, { getAvatar })(Post);
