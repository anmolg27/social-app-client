import React, { useEffect, useState } from "react";
import beautifyName from "../../util/beautifyName";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import ImageModal from "../home/imageModal";
import UnfriendModal from "../searchResults/unfriendModal";
import { connect } from "react-redux";
// import PropTypes from "prop-types";
import "font-awesome/css/font-awesome.min.css";
import {
  sendFriendRequest,
  respondToRequest,
  unfriend,
} from "../../redux/actions/friendsActions";
import { getAvatar } from "../../redux/actions/userActions";
// import { Button } from "reactstrap";
import {
  Button,
  Tooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

const Profile = (props) => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const [dropdownOpen, setOpen] = useState(false);

  const toggleDropDown = () => setOpen(!dropdownOpen);

  const [unfriendModal, setUnfriendModal] = useState(false);
  const toggleUnfriendModal = () => setUnfriendModal(!unfriendModal);

  const handleSendRequest = (user) => {
    props.sendFriendRequest(user.credentials._id);
  };
  const handleButtonDropdown = (event) => {
    if (
      event.target.closest("#d-toggle").nextElementSibling.style.display ===
      "block"
    ) {
      event.target.closest("#d-toggle").nextElementSibling.style.display =
        "none";
    } else {
      event.target.closest("#d-toggle").nextElementSibling.style.display =
        "block";
    }
  };
  const handleToggleModal = (event) => {
    toggleUnfriendModal();
    event.target.closest("#u-toggle").style.display = "none";
  };
  const handleUnfriend = (user) => {
    console.log("you tried to unfriend " + user.name);
    props.unfriend(user._id);
    toggleUnfriendModal();
  };
  const renderButton = () => {
    if (!props.friends.friends) {
      if (props.paramUserId !== props.userId) {
        return (
          <button
            onClick={() => handleSendRequest(props.user)}
            className="send-request-icon"
            style={{ position: "sticky" }}
          >
            <span>Send Request</span>

            <i
              className="fa fa-plus"
              style={{ color: "rgb(3, 151, 16)", fontSize: "25px" }}
              aria-hidden="true"
            ></i>
          </button>
        );
      }
      return null;
    } else {
      if (props.paramUserId === props.userId) return null;
      if (
        !props.friends.requests.find(
          (friend) => friend.senderId === props.paramUserId
        )
      ) {
        if (
          props.friends.friends.find(
            (friend) => friend.friendId === props.paramUserId
          )
        ) {
          return (
            <ButtonDropdown
              style={{ position: "sticky", display: "grid" }}
              className="send-request-icon"
              isOpen={dropdownOpen}
            >
              <DropdownToggle
                onClick={handleButtonDropdown}
                id="d-toggle"
                caret
                color="info"
              >
                <span className="friend-span">Friend</span>
              </DropdownToggle>
              <DropdownMenu id="u-toggle">
                <DropdownItem onClick={handleToggleModal}>
                  Unfriend
                </DropdownItem>
              </DropdownMenu>
              <UnfriendModal
                show={unfriendModal}
                toggleModal={toggleUnfriendModal}
              >
                <ModalBody style={{ paddingTop: "10px", paddingBottom: "0px" }}>
                  Are you sure that you wanna unfriend{" "}
                  {props.user.credentials.name}?
                </ModalBody>
                <ModalFooter style={{ paddingTop: "5px" }}>
                  <Button
                    color="success"
                    onClick={() => handleUnfriend(props.user.credentials)}
                  >
                    Yes
                  </Button>
                  <Button color="danger" onClick={toggleUnfriendModal}>
                    No
                  </Button>
                </ModalFooter>
              </UnfriendModal>
            </ButtonDropdown>
          );
        } else if (
          props.friends.pendingRequests.find(
            (friend) => props.paramUserId === friend.sentTo
          )
        ) {
          return (
            <div
              style={{ position: "sticky", display: "block" }}
              className="unsend-request-icon p-1"
            >
              <span>Request Sent</span>
            </div>
          );
        } else {
          return (
            <button
              onClick={() => handleSendRequest(props.user)}
              className="send-request-icon"
              style={{ position: "sticky" }}
            >
              <span>Send Request</span>

              <i
                className="fa fa-plus"
                style={{ color: "rgb(3, 151, 16)", fontSize: "25px" }}
                aria-hidden="true"
              ></i>
            </button>
          );
        }
      } else {
        return (
          <div
            style={{ position: "sticky", display: "inline-flex" }}
            className="send-request-icon mt-2"
            role="group"
            aria-label="Basic example"
          >
            <button
              onClick={() => props.respondToRequest(props.paramUserId, true)}
              type="button"
              className="btn btn-success"
            >
              Accept
            </button>
            <button
              onClick={() => props.respondToRequest(props.paramUserId, false)}
              type="button"
              className="btn btn-danger"
            >
              Reject
            </button>
          </div>
        );
      }
    }
  };
  if (props.user.credentials) {
    const { name, age, email, _id, sex } = props.user.credentials;
    let ava;
    if (props.images.length > 0) {
      ava = props.images.find((cur) => cur.userId === _id);
      if (!ava) {
        props.getAvatar(_id);
      }
    }
    return (
      <div className="profile-block">
        <img
          onClick={toggleModal}
          className="profile-image"
          height={150}
          width={150}
          style={{ cursor: "pointer" }}
          src={
            ava
              ? `data:image/jpeg;base64,${ava.image}`
              : "/images/no-profile.jpg"
          }
        />
        <ImageModal show={modal} toggleModal={toggleModal}>
          <img
            className="modal-profile-image"
            src={
              _id &&
              (props.images.find((cur) => cur.userId === _id)
                ? `data:image/jpeg;base64,${
                    props.images.find((cur) => cur.userId === _id).image
                  }`
                : "/images/no-profile.jpg")
            }
          />
        </ImageModal>
        <div className=" profile-details mt-2">
          <h3>{beautifyName(name)}</h3>

          <div className="row px-3" style={{ justifyContent: "space-between" }}>
            <i
              id="DisabledAutoHideExample"
              className="fa fa-address-card-o email-icon"
              aria-hidden="true"
            />
            <Tooltip
              className="email-tooltip"
              // hideArrow={true}
              style={{
                backgroundColor: "rgb(224, 253, 229)",
                color: "black",
                fontSize: "20px",
              }}
              placement="top"
              isOpen={tooltipOpen}
              autohide={false}
              target="DisabledAutoHideExample"
              toggle={toggle}
            >
              {email}
            </Tooltip>
            <div style={{ display: "inline-flex", alignItems: "baseline" }}>
              <h5> age: </h5>
              <span>{age}</span>
            </div>

            {sex === "male" && (
              <i
                className="fa fa-mars"
                style={{ color: "blue", fontSize: "30px" }}
                aria-hidden="true"
              ></i>
            )}
            {sex === "female" && (
              <i
                className="fa fa-venus"
                style={{
                  color: "rgb(214, 57, 57)",
                  fontSize: "30px",
                }}
                aria-hidden="true"
              ></i>
            )}
            {sex === "other" && (
              <i
                className="fa fa-mercury"
                style={{ color: "white", fontSize: "30px" }}
                aria-hidden="true"
              ></i>
            )}
          </div>
          {renderButton()}
        </div>
      </div>
    );
  } else return null;
};

const mapStateToProps = (state) => ({
  images: state.images,
  friends: state.friendsData.friends,
  userId: state.user.credentials._id,
});

export default connect(mapStateToProps, {
  getAvatar,
  sendFriendRequest,
  respondToRequest,
  unfriend,
})(Profile);
