import React, { useEffect } from "react";
import beautifyName from "../../util/beautifyName";
import moment from "moment";
import axios from "axios";
import history from "../../history";
// import ScrollToBottom from "react-scroll-to-bottom";

import { connect } from "react-redux";
import { getAvatar } from "../../redux/actions/userActions";
import { setFriends } from "../../redux/actions/friendsActions";
function Notifications(props) {
  useEffect(() => {
    axios
      .patch(
        `https://anmolg27-social-app-server.herokuapp.com/notifications/seen`
      )
      .then((res) => {
        // console.log("success");
        props.setUnseenNotificationsCount(0);
      })
      .catch((err) => {
        console.log("something went wrong");
      });
  }, []);
  const handleProfileClick = (notification) => {
    window.location.href = `/user/${notification.recipientId}`;
  };
  const handlePostClick = (notification) => {
    history.push(`/post/${notification.postId}`);
    props.setIsNotificationOpen(false);
  };
  const handleFriendRequest = (event, notification, response) => {
    if (response === true) {
      axios
        .post(
          `https://anmolg27-social-app-server.herokuapp.com/friends/${notification.recipientId}/respond?accept=${response}`
        )
        .then((res) => {
          props.setFriends(res.data);
        })
        .catch((err) => console.log(err));
      event.target.parentElement.parentElement.innerHTML = `<h5>You and ${notification.recipientName} are now Friends!</h5>`;
    } else if (response === false) {
      axios
        .post(
          `https://anmolg27-social-app-server.herokuapp.com/friends/${notification.recipientId}/respond?accept=${response}`
        )
        .then((res) => {
          props.setFriends(res.data);
        })
        .catch((err) => console.log(err));
      const dom =
        event.target.parentElement.parentElement.parentElement.parentElement;
      dom.parentElement.removeChild(dom);
    }
  };
  if (props.loading === true) {
    return (
      <div
        className="inside-notification loading"
        style={{
          paddingTop: "20px",
          paddingBottom: "20px",
          // minWidth: "30vw",
          justifyContent: "center",
        }}
      >
        <p
          style={{ color: "whitesmoke" }}
          className="inside-notification loading-text"
        >
          loading{" "}
        </p>
        <div
          className="inside-notification loading-spinner spinner-border text-success"
          role="status"
        ></div>
      </div>
    );
  } else {
    let timestamp;
    let html = [];

    if (props.notifications.length > 0) {
      html = props.notifications.map((notification) => {
        let content;
        const ava = props.images.find(
          (image) => image.userId === notification.recipientId
        );
        if (!ava) props.getAvatar(notification.recipientId);
        timestamp = new Date(notification.createdAt).getTime();
        if (notification.type === "friend request") {
          content = (
            <>
              <span className="inside-notification">
                has sent you a friend request
              </span>

              <div
                className="inside-notification notification-send-request-icon"
                role="group"
                aria-label="Basic example"
              >
                <button
                  onClick={(event) =>
                    handleFriendRequest(event, notification, true)
                  }
                  type="button"
                  className="inside-notification btn btn-success"
                >
                  Accept
                </button>
                <button
                  onClick={(event) =>
                    handleFriendRequest(event, notification, false)
                  }
                  type="button"
                  className="inside-notification btn btn-danger"
                >
                  Reject
                </button>
              </div>
            </>
          );
        } else if (notification.type === "friend request accepted") {
          content = (
            <>
              <span className="inside-notification">
                has accepted your friend request!
              </span>
            </>
          );
        } else if (notification.type === "comment") {
          content = (
            <>
              <span className="inside-notification">
                has commented on your{" "}
              </span>
              <span
                onClick={() => handlePostClick(notification)}
                className="inside-notification"
                style={{
                  color: "blue",
                  cursor: "pointer",
                  backgroundColor: "rgb(77, 224, 168)",
                  borderRadius: "10px",
                  padding: "1px 7px",
                }}
              >
                post!
              </span>
            </>
          );
        } else if (notification.type === "like") {
          content = (
            <>
              <span className="inside-notification">has liked your </span>
              <span
                onClick={() => handlePostClick(notification)}
                className="inside-notification"
                style={{
                  color: "blue",
                  cursor: "pointer",
                  backgroundColor: "rgb(77, 224, 168)",
                  borderRadius: "10px",
                  padding: "1px 7px",
                }}
              >
                post!
              </span>
            </>
          );
        }
        return (
          <div
            className={
              notification.seen === false
                ? "inside-notification media notification unseen"
                : "inside-notification media notification"
            }
          >
            <img
              onClick={() => handleProfileClick(notification)}
              style={{ cursor: "pointer" }}
              height={60}
              src={
                ava
                  ? `data:image/jpeg;base64,${ava.image}`
                  : "/images/no-profile.jpg"
              }
              className="inside-notification mr-3 post-user-image"
              alt="..."
            />
            <div className="inside-notification media-body">
              <div className="inside-notification notification-name-time">
                <div
                  className="inside-notification"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h5
                    onClick={() => handleProfileClick(notification)}
                    style={{ fontSize: "20px", cursor: "pointer" }}
                    className="inside-notification mt-0 mb-0 notification-user-name"
                  >
                    {beautifyName(notification.recipientName)}
                  </h5>
                  <p
                    style={{ fontSize: "12px" }}
                    className="inside-notification time-teller mb-0"
                  >{`${moment(timestamp).fromNow()}`}</p>
                </div>
                {content}
              </div>
            </div>
          </div>
        );
      });
      return (
        <div className="inside-notification list-unstyled notifications mt-2">
          {html}
        </div>
      );
    } else {
      return (
        <div
          className="inside-notification"
          style={{ padding: "15px", color: "whitesmoke", textAlign: "center" }}
        >
          all Notifications will be here!
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => ({
  images: state.images,
});

export default connect(mapStateToProps, { setFriends, getAvatar })(
  Notifications
);
