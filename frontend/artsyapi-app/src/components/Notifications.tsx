import React, { useEffect } from "react";
import { Alert, CloseButton } from "react-bootstrap";

const Notifications = ({ message, variant, index = 0, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div
      className="position-absolute end-0 p-3"
      style={{
        top: `${65 + index * 70}px`,
        zIndex: 1050,
      }}
    >
      <Alert
        variant={variant}
        className="d-flex justify-content-between align-items-center shadow-sm"
        style={{ width: "190px", fontSize: "14px", padding: "8px 12px" }}
      >
        <span>{message}</span>
        <CloseButton onClick={onClose} />
      </Alert>
    </div>
  );
};

export default Notifications;
