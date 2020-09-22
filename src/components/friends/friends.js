import React, { useState, useEffect } from "react";
import beautifyName from "../../util/beautifyName";
// const sortArray = require('sort-array')
import sortArray from "sort-array";
import { Row } from "reactstrap";
import { connect } from "react-redux";
import "./style.css";
import SideNav from "../home/sideNav";
import { getAvatar } from "../../redux/actions/userActions";
function Friends(props) {
  const [requests, setRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    if (!props.friendsData.loading && props.friendsData.friends.friends) {
      setPendingRequests(props.friendsData.friends.pendingRequests.length);
      setRequests(props.friendsData.friends.requests.length);
    }
  }, [props.friendsData.loading]);

  const handleProfileClick = (friend) => {
    window.location.href = `/user/${friend.friendId}`;
  };
  let html;
  console.log(props.friendsData);
  if (props.friendsData.loading) {
    html = (
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
    );
  } else {
    let friendHtml;
    if (
      props.friendsData.friends.friends &&
      props.friendsData.friends.friends.length > 0
    ) {
      const sortedArr = sortArray(props.friendsData.friends.friends, {
        by: "friendName",
      });
      // let friendHtml;
      friendHtml = sortedArr.map((friend) => {
        const ava = props.images.find(
          (image) => image.userId === friend.friendId
        );
        if (!ava) props.getAvatar(friend.friendId);
        return (
          <div className="user-friend col-12 col-md-4">
            <div
              className="media"
              style={{
                alignItems: "center",
                backgroundColor: "aliceblue",
                borderRadius: "30px",
                padding: "10px",
              }}
            >
              <img
                onClick={() => handleProfileClick(friend)}
                style={{ cursor: "pointer", height: "15vh" }}
                // height={100}
                src={
                  ava
                    ? `data:image/jpeg;base64,${ava.image}`
                    : "/images/no-profile.jpg"
                }
                className=" mr-0 post-user-image"
                alt="..."
              />
              <div className="media-body">
                <h5
                  onClick={() => handleProfileClick(friend)}
                  style={{
                    marginLeft: "15px",
                    fontSize: "20px",
                    cursor: "pointer",
                    width: "fit-content",
                  }}
                  className="mt-0 mb-0 notification-user-name"
                >
                  {beautifyName(friend.friendName)}
                </h5>
              </div>
            </div>
          </div>
        );
      });
    } else {
      friendHtml = (
        <p style={{ width: "100%" }}>You don't have any friends yet</p>
      );
    }
    html = (
      <div className="friends-data">
        <div className="request-buttons-group">
          <button className="pending-requests-button">
            Pending Requests{" "}
            <span style={{ color: "rgb(141, 124, 27)" }}>
              {" "}
              {pendingRequests}{" "}
            </span>
          </button>
          <button className="friend-requests-button">
            Requests <span style={{ color: "blue" }}> {requests}</span>
          </button>
        </div>
        <div className="friend-list-container mt-3">
          <Row className="mx-0 friends-list" style={{ alignContent: "start" }}>
            {friendHtml}
          </Row>
        </div>
      </div>
    );
  }
  return (
    <div style={{ margin: "0px auto", padding: "0px 10px" }}>
      <Row>
        <div className="px-0 mx-0 container col-md-2 d-md-block d-none">
          <div className="side-nav-container">
            <SideNav />
          </div>
        </div>
        <div
          className="col-md-10"
          style={{ textAlign: "center", padding: "5% 5%" }}
        >
          {html}
        </div>

        {/* {props.friendsData.loading=== false && props.friendsData.friends.friends?():()} */}
      </Row>
    </div>
  );
}
const mapStateToProps = (state) => ({
  images: state.images,
  credentials: state.user.credentials,
  friendsData: state.friendsData,
});
export default connect(mapStateToProps, { getAvatar })(Friends);
