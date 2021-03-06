import React, { useEffect, useState } from "react";
import beautifyName from "../../util/beautifyName";
import moment from "moment";
import { Input, Button } from "reactstrap";
import ScrollToBottom from "react-scroll-to-bottom";

import { connect } from "react-redux";
import { updateCommentsCount } from "../../redux/actions/postActions";
import { getAvatar } from "../../redux/actions/userActions";

function Comments(props) {
  const [comments, setComments] = useState(null);
  const { socket, loading, postId } = props;
  const handleProfileClick = (comment) => {
    window.location.href = `/user/${comment.ownerId}`;
  };
  useEffect(() => {
    if (props.loading === false) {
      socket.emit("joinCommentRoom", { postId });

      setComments(props.comments);

      return () => {
        socket.emit("leftCommentRoom", { postId });
      };
    }
  }, [props.comments, loading]);

  useEffect(() => {
    socket.on("newComment", async (newComment) => {
      if (comments && newComment.postId === postId) {
        const temp = [...comments, newComment];
        await setComments([...comments, newComment]);
        props.updateCommentsCount(postId, temp.length);
      }
    });
  }, [comments]);

  if (props.loading === true) {
    return (
      <div className="loading">
        <p className="loading-text">loading </p>
        <div
          className="loading-spinner spinner-border text-success"
          role="status"
        ></div>
      </div>
    );
  } else {
    let timestampForComment;
    let html = [];
    if (comments && comments.length > 0) {
      //   console.log(comments);
      html = comments.map((comment) => {
        timestampForComment = new Date(comment.createdAt).getTime();
        const ava = props.images.find(
          (image) => image.userId === comment.ownerId
        );
        if (!ava) props.getAvatar(comment.ownerId);
        return (
          <div className="comment media my-2 col-md-10 col-11">
            <img
              onClick={() => handleProfileClick(comment)}
              style={{ cursor: "pointer" }}
              height={60}
              src={
                ava
                  ? `data:image/jpeg;base64,${ava.image}`
                  : "/images/no-profile.jpg"
              }
              className="mr-3 post-user-image"
              alt="..."
            />
            <div className="media-body">
              <div className="comment-name-time">
                <h5
                  onClick={() => handleProfileClick(comment)}
                  style={{ cursor: "pointer" }}
                  className="mt-0 mb-1 comment-user-name"
                >
                  {beautifyName(comment.ownerName)}
                </h5>
                <p className="time-teller">{`${moment(
                  timestampForComment
                ).fromNow()}`}</p>
              </div>

              {comment.content}
              {/* <br /> */}
            </div>
          </div>
        );
      });
    }
    const handleCommentClick = (event) => {
      const text = event.target.parentNode.previousSibling.value;
      if (!text) {
        return console.log("it is empty");
      }
      socket.emit("sendComment", { text, postId }, (error) => {
        if (error) {
          console.log(error);
          alert(error);
        }
      });
      event.target.parentNode.previousSibling.value = "";
    };
    // document.querySelector(".asddas").parentNode.parentNode.previousSibling
    return (
      <>
        <ScrollToBottom className="list-unstyled comments mt-2 row">
          {html}
        </ScrollToBottom>
        <div className="input-post row">
          <Input
            style={{ height: 100 }}
            type="textarea"
            className="input-textarea col-md-8 col-8"
            placeholder="Type here to comment!"
          />
          <div className="col-3 p-0 ml-2 align-self-center">
            <Button
              onClick={handleCommentClick}
              className="comment-post-button"
            >
              Comment
            </Button>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  images: state.images,
  name: state.user.credentials.name,
  userId: state.user.credentials._id,
});

export default connect(mapStateToProps, { updateCommentsCount, getAvatar })(
  Comments
);
