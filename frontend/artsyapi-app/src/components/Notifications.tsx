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
        // Start at 65px from the top and stack notifications with a reduced gap (40px gap here)
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

// import React, { useState, useEffect } from "react";
// import { Alert, CloseButton } from "react-bootstrap";

// const Notification = ({ message, variant, index = 0 }) => {
//   const [show, setShow] = useState(true);

//   useEffect(() => {
//     if (message) {
//       setShow(true);
//       const timer = setTimeout(() => {
//         setShow(false);
//       }, 5000);

//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   if (!show) return null;

//   return (
//     <div
//       className="position-absolute end-0 p-3"
//       style={{
//         top: `${65 + index * 70}px`,
//         zIndex: 1050,
//       }}
//     >
//       <Alert
//         variant={variant}
//         className="d-flex justify-content-between align-items-center shadow-sm"
//         style={{ width: "170px", fontSize: "14px", padding: "8px 12px" }}
//       >
//         <span>{message}</span>
//         <CloseButton onClick={() => setShow(false)} />
//       </Alert>
//     </div>
//   );
// };

// export default Notification;
