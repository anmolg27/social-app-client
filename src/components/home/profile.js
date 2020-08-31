import React, { useEffect } from "react";
import { connect } from "react-redux";
import "font-awesome/css/font-awesome.min.css";
import { uploadAvatar } from "../../redux/actions/userActions";
// import { Button } from "reactstrap";

const Profile = (props) => {
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
      alert(props.UI.errors);
    }
  }, [props.UI.errors]);
  const { name, age, email, _id } = props.user.credentials;
  const beautifyName = (name) => {
    let splitName = name.split(" ");
    let newName = "";
    splitName.forEach((cur) => {
      newName = newName.concat(cur[0].toUpperCase() + cur.slice(1) + " ");
    });
    return newName;
  };
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
        className="profile-image"
        height={150}
        src="/images/no-profile.jpg"
      />

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
        <p>age: {age}</p>
        <i className="fa fa-envelope-o" aria-hidden="true">
          {" "}
          {email}
        </i>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  images: state.images,
});

export default connect(mapStateToProps, { uploadAvatar })(Profile);
