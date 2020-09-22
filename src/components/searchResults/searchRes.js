import React, { useEffect, useState } from "react";
import beautifyName from "../../util/beautifyName";
import "./styles.css";
import axios from "axios";
import SideNav from "../home/sideNav";
import UnfriendModal from "./unfriendModal";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Button,
  ModalBody,
  ModalFooter,
} from "reactstrap";
// import { Spinner } from "reactstrap";
import { connect } from "react-redux";
import {
  sendFriendRequest,
  respondToRequest,
  unfriend,
} from "../../redux/actions/friendsActions";
import { getAvatar } from "../../redux/actions/userActions";
import queryString from "query-string";
function SearchRes(props) {
  const [dropdownOpen, setOpen] = useState(false);

  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);
  const [userUnfriend, setUserUnfriend] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bottomLoading, setBottomLoading] = useState(false);
  const { location, images } = props;
  const { q } = queryString.parse(location.search);
  const win = document.querySelector("html");
  let temp;
  useEffect(() => {
    window.addEventListener("scroll", () => {
      const containerHeight = win.scrollHeight;

      const scrollOffset = Math.ceil(win.scrollTop) + win.clientHeight;
      if (containerHeight <= scrollOffset && temp) {
        setBottomLoading(true);
        axios
          .get(
            `https://anmolg27-social-app-server.herokuapp.com/users/search?q=${q}&userId=${temp}`
          )
          .then((res) => {
            setUsers((prev) => [...prev, ...res.data]);
            if (res.data.length === 10) {
              temp = res.data[9]._id;
            } else temp = null;
            res.data.forEach((user) => {
              let index = images.findIndex((ava) => ava.userId === user._id);
              if (index === -1) {
                props.getAvatar(user._id);
              }
            });
            setBottomLoading(false);
          })
          .catch((err) => alert("Something went wrong"));
      }
    });
  }, [Math.ceil(win.scrollTop)]);
  useEffect(() => {
    // console.log(q);
    setLoading(true);
    axios
      .get(
        `https://anmolg27-social-app-server.herokuapp.com/users/search?q=${q}`
      )
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
        document.querySelector(".nav-search-input").value = "";
        if (res.data.length === 10) {
          temp = res.data[9]._id;
        } else temp = null;
        res.data.forEach((user) => {
          let index = images.findIndex((ava) => ava.userId === user._id);
          if (index === -1) {
            props.getAvatar(user._id);
          }
        });
      })
      .catch((error) => alert("Something went wrong"));
  }, [q]);
  const handleClick = (user) => {
    window.location.href = `/user/${user._id}`;
  };
  const handleUnfriend = (user) => {
    props.unfriend(user._id);
    toggleModal();
  };
  const handleSendRequest = (user) => {
    props.sendFriendRequest(user._id);
  };
  const handleButtonDropdown = (event, user) => {
    let dom = document.querySelectorAll("#d-toggle");
    console.log(dom.length);
    for (let i = 0; i < dom.length; i++) {
      dom[i].nextElementSibling.style.display = "none";
    }
    setUserUnfriend(user);
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
    toggleModal();
    event.target.closest("#u-toggle").style.display = "none";
  };
  useEffect(() => {
    document.querySelector("body").addEventListener("click", (event) => {
      if (!event.target.className.includes("dropdown-toggle")) {
        let dom = document.querySelectorAll("#d-toggle");

        for (let i = 0; i < dom.length; i++) {
          dom[i].nextElementSibling.style.display = "none";
        }
      }
    });
  }, []);

  const renderResults = () => {
    if (loading === true) {
      return (
        <div className="loading-search col-12">
          <Spinner style={{ height: "30vh", width: "30vh" }} color="success" />
        </div>
      );
    }

    const html = users.map((user) => {
      let avatar = images.find((ava) => ava.userId === user._id);
      return (
        <>
          <div className="search-user nav-link col-12" data-userId={user._id}>
            <div className="media col-12" style={{ paddingLeft: "0px" }}>
              <img
                style={{ cursor: "pointer" }}
                onClick={() => handleClick(user)}
                height={100}
                src={
                  avatar
                    ? `data:image/jpeg;base64,${avatar.image}`
                    : "/images/no-profile.jpg"
                }
                className="mr-3 search-user-image"
                alt="..."
              />
              <div className="media-body">
                <div className="name-time">
                  <h5
                    style={{ cursor: "pointer" }}
                    onClick={() => handleClick(user)}
                    className="mt-0 mb-1 user-name"
                  >
                    {beautifyName(user.name)}
                  </h5>
                </div>
                {!props.friends.friends && user._id !== props.userId && (
                  <button
                    onClick={() => handleSendRequest(user)}
                    className="send-request-icon"
                  >
                    <span>Send Request</span>

                    <i
                      className="fa fa-plus"
                      style={{ color: "rgb(3, 151, 16)", fontSize: "25px" }}
                      aria-hidden="true"
                    ></i>
                  </button>
                )}
                {props.friends.friends &&
                  props.friends.friends.find(
                    (friend) => friend.friendId === user._id
                  ) &&
                  user._id !== props.userId && (
                    <ButtonDropdown
                      className="send-request-icon"
                      isOpen={dropdownOpen}
                    >
                      <DropdownToggle
                        onClick={(event) => handleButtonDropdown(event, user)}
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
                      <UnfriendModal show={modal} toggleModal={toggleModal}>
                        <ModalBody
                          style={{ paddingTop: "10px", paddingBottom: "0px" }}
                        >
                          Are you sure that you wanna unfriend{" "}
                          {userUnfriend.name}?
                        </ModalBody>
                        <ModalFooter style={{ paddingTop: "5px" }}>
                          <Button
                            color="success"
                            onClick={() => handleUnfriend(userUnfriend)}
                          >
                            Yes
                          </Button>
                          <Button color="danger" onClick={toggleModal}>
                            No
                          </Button>
                        </ModalFooter>
                      </UnfriendModal>
                    </ButtonDropdown>
                  )}
                {props.friends.friends &&
                  user._id !== props.userId &&
                  !props.friends.friends.find(
                    (friend) => friend.friendId === user._id
                  ) &&
                  (!props.friends.pendingRequests.find(
                    (friend) => user._id === friend.sentTo
                  ) ? (
                    props.friends.requests.find(
                      (friend) => friend.senderId === user._id
                    ) ? (
                      <div
                        className="send-request-icon"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button
                          onClick={() => props.respondToRequest(user._id, true)}
                          type="button"
                          className="btn btn-success"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            props.respondToRequest(user._id, false)
                          }
                          type="button"
                          className="btn btn-danger"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(user)}
                        className="send-request-icon"
                      >
                        <span>Send Request</span>

                        <i
                          className="fa fa-plus"
                          style={{ color: "rgb(3, 151, 16)", fontSize: "25px" }}
                          aria-hidden="true"
                        ></i>
                      </button>
                    )
                  ) : (
                    <div className="unsend-request-icon">
                      <span>Request Sent</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="w-100"></div>
        </>
      );
    });
    return html;
  };

  return (
    <div className="row">
      <div className="px-0 ml-2 mr-0 container col-md-2 d-md-block d-none">
        <div className="side-nav-container">
          <SideNav />
        </div>
      </div>
      <div className="search-container col-11 col-sm-6">
        <ul className="search-list list-unstyled row">{renderResults()}</ul>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  userId: state.user.credentials._id,
  images: state.images,
  friends: state.friendsData.friends,
});

export default connect(mapStateToProps, {
  getAvatar,
  sendFriendRequest,
  respondToRequest,
  unfriend,
})(SearchRes);
