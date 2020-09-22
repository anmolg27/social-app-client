import React, { useEffect, useState } from "react";
import ImageModal from "./imageModal";
import { connect } from "react-redux";
import beautifyName from "../../util/beautifyName";
// import PropTypes from "prop-types";
import "font-awesome/css/font-awesome.min.css";
import { uploadAvatar } from "../../redux/actions/userActions";
// import { Button } from "reactstrap";
import { Tooltip } from "reactstrap";

const Profile = (props) => {
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);
  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };
  const handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("avatar", image, image.name);
    event.target.value = null;
    props.uploadAvatar(formData);
  };

  useEffect(() => {
    if (props.UI.errors) {
      if (props.UI.errors === "File too large") {
        return alert(
          `${props.UI.errors}.Please upload an image of size less than 100KB`
        );
      }
      console.log(props.UI.errors);
    }
  }, [props.UI.errors]);
  const { name, age, email, _id, sex } = props.user.credentials;
  if (props.images.length > 0) {
    const ava = props.images.find((cur) => cur.userId === _id);
    if (ava && document.querySelector(".profile-image")) {
      document
        .querySelector(".profile-image")
        .setAttribute("src", `data:image/jpeg;base64,${ava.image}`);
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
        src="/images/no-profile.jpg"
        alt="profile image"
      />
      <ImageModal show={modal} toggleModal={toggleModal}>
        <img
          className="modal-profile-image"
          src={
            props.images.find((cur) => cur.userId === _id)
              ? `data:image/jpeg;base64,${
                  props.images.find((cur) => cur.userId === _id).image
                }`
              : "/images/no-profile.jpg"
          }
          alt="profile image"
        />
      </ImageModal>

      <div className="image-input">
        <input
          onChange={handleImageChange}
          type="file"
          id="imageInput"
          hidden="hidden"
        />
        <i onClick={handleEditPicture} className="fa fa-pencil edit-icon"></i>
      </div>
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
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  images: state.images,
});

export default connect(mapStateToProps, { uploadAvatar })(Profile);
