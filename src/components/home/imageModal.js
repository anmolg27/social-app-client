import React, { useEffect, useState } from "react";

function ImageModal({ show, toggleModal, children }) {
  const [deviceWidth, setDeviceWidth] = useState(
    document.querySelector("body").clientWidth
  );
  useEffect(() => {
    window.addEventListener("resize", () => {
      setDeviceWidth(document.querySelector("body").clientWidth);
    });
  });
  const showHideClass = show === true ? "showImageModal" : "hideImageModal";
  return (
    <div className={showHideClass}>
      <div
        className={deviceWidth < 768 ? "modal-main-small" : "modal-main-large"}
      >
        <div
          className="row mx-0 pr-1 pb-1"
          style={{
            paddingTop: "1%",
            justifyContent: "flex-end",
            fontSize: "26px",
            color: "rgba(255, 17, 17, 0.671)",
          }}
        >
          <i
            onClick={toggleModal}
            className="fa fa-times"
            aria-hidden="true"
            style={{ cursor: "pointer" }}
          ></i>
        </div>
        {children}
      </div>
    </div>
  );
}

export default ImageModal;
