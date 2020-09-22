import React from "react";

function UnfriendModal({ show, toggleModal, children }) {
  const showHideClass =
    show === true ? "showUnfriendModal" : "hideUnfriendModal";
  return (
    <div className={showHideClass}>
      <div className="unfriend-modal-main">
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
          ></i>
        </div>
        {children}
      </div>
    </div>
  );
}

export default UnfriendModal;
