import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopNavBar from "./components/Navbar";
import FooterBar from "./components/Footerbar";
import Searchbar from "./components/Searchbar";
import Login from "./components/Login";
import Notifications from "./components/Notifications";
import Register from "./components/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import Favourites from "./components/Favourites";

function App() {
  const [isloggedin, setisloggedin] = useState(false);
  const [loggedinuser, setloggedinuser] = useState();
  const [loggedname, setloggedemail] = useState("");
  const [loggedgravatar, setloggedgravatar] = useState("");
  // Change single notification to an array of notifications
  const [notifications, setNotifications] = useState([]);

  const setFavourites = (obj) => {
    setloggedinuser(obj);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/me", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch user info");

        const data = await response.json();
        console.log(data);

        if (data.message === "Authenticated") {
          const updatedUser = {
            ...data.user,
            favourites: data.user.favourites || [],
          };
          setloggedinuser(data.user);
          console.log("Logged in user=", data.user);
          setisloggedin(true);
          setloggedgravatar(data.user.gravatar);
          setloggedemail(data.user.fullname);
          console.log("Logged in user data", data);
        } else {
          setloggedinuser(null);
          setisloggedin(false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setloggedinuser(null);
        setisloggedin(false);
      }
    };

    fetchUser();
  }, []);

  // Append new notifications to the array
  const handlenotification = (obj) => {
    setNotifications((prev) => [...prev, obj]);
  };

  // Remove a notification at a given index
  const removeNotification = (indexToRemove) => {
    setNotifications((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleloggeddata = (name, gravatar) => {
    setloggedemail(name);
    setloggedgravatar(gravatar);
  };

  const handleLogin = (status) => {
    setisloggedin(status);
  };

  return (
    <Router>
      <TopNavBar
        isLoggedIn={isloggedin}
        onlogin={handleLogin}
        name={loggedname}
        gravatar={loggedgravatar}
        handlenotification={handlenotification}
      />
      <Routes>
        <Route
          path="/search"
          element={
            <Searchbar
              isLoggedIn={isloggedin}
              loggedinuser={loggedinuser}
              setFavourites={setFavourites}
              handlenotification={handlenotification}
            />
          }
        />
        <Route
          path="/search/:id"
          element={
            <Searchbar
              isLoggedIn={isloggedin}
              loggedinuser={loggedinuser}
              setFavourites={setFavourites}
              handlenotification={handlenotification}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              onLogin={handleLogin}
              onData={handleloggeddata}
              setloggedinuser={setloggedinuser}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              onLogin={handleLogin}
              onData={handleloggeddata}
              setloggedinuser={setloggedinuser}
            />
          }
        />
        <Route
          path="/favourites"
          element={
            <Favourites
              handlenotification={handlenotification}
              setFavourites={setFavourites}
              Favourites={loggedinuser?.favourites ?? []}
            />
          }
        />
      </Routes>
      <FooterBar />
      {/* Render notifications, passing each its index and an onClose callback */}
      {notifications.map((notification, index) => (
        <Notifications
          key={index}
          message={notification.message}
          variant={notification.variant}
          index={index}
          onClose={() => removeNotification(index)}
        />
      ))}
    </Router>
  );
}

export default App;

// import React, { useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import TopNavBar from "./components/Navbar";
// import FooterBar from "./components/Footerbar";
// import Searchbar from "./components/Searchbar";
// import Login from "./components/Login";
// import Notifications from "./components/Notifications";
// import Register from "./components/Register";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Favourites from "./components/Favourites";
// import { useState } from "react";

// function App() {
//   const [isloggedin, setisloggedin] = useState(false);
//   const [loggedinuser, setloggedinuser] = useState();
//   const [loggedname, setloggedemail] = useState("");
//   const [loggedgravatar, setloggedgravatar] = useState("");
//   const [notifications, setNotifications] = useState([]);

//   const setFavourites = (obj) => {
//     setloggedinuser(obj);
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch("/api/me", {
//           credentials: "include",
//         });
//         if (!response.ok) throw new Error("Failed to fetch user info");

//         const data = await response.json();
//         console.log(data);

//         if (data.message == "Authenticated") {
//           setloggedinuser(data.user);
//           console.log("Logged in user=", data.user);
//           setisloggedin(true);
//           setloggedgravatar(data.user.gravatar);
//           setloggedemail(data.user.fullname);
//           console.log("Logged in user data", data);
//         } else {
//           setloggedinuser(null);
//           setisloggedin(false);
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         setloggedinuser(null);
//         setisloggedin(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   const handlenotification = (obj) => {
//     setNotifications((prev) => [...prev, obj]);
//   };

//   const handleloggeddata = (name, gravatar) => {
//     setloggedemail(name);
//     setloggedgravatar(gravatar);
//   };

//   const handleLogin = (status) => {
//     setisloggedin(status);
//   };

//   return (
//     <Router>
//       <TopNavBar
//         isLoggedIn={isloggedin}
//         onlogin={handleLogin}
//         name={loggedname}
//         gravatar={loggedgravatar}
//         handlenotification={handlenotification}
//       />
//       <Routes>
//         <Route
//           path="/search"
//           element={
//             <Searchbar
//               isLoggedIn={isloggedin}
//               loggedinuser={loggedinuser}
//               setFavourites={setFavourites}
//               handlenotification={handlenotification}
//             />
//           }
//         />
//         <Route
//           path="/search/:id"
//           element={
//             <Searchbar
//               isLoggedIn={isloggedin}
//               loggedinuser={loggedinuser}
//               setFavourites={setFavourites}
//               handlenotification={handlenotification}
//             />
//           }
//         />
//         <Route
//           path="/login"
//           element={<Login onLogin={handleLogin} onData={handleloggeddata} />}
//         />
//         <Route
//           path="/register"
//           element={<Register onLogin={handleLogin} onData={handleloggeddata} />}
//         />
//         <Route
//           path="/favourites"
//           element={
//             <Favourites
//               setFavourites={setFavourites}
//               Favourites={loggedinuser?.favourites ?? []}
//             />
//           }
//         />
//       </Routes>
//       <FooterBar />
//       {notification.message != "" && (
//         <Notifications
//           message={notification.message}
//           variant={notification.variant}
//         />
//       )}
//     </Router>
//   );
// }

// export default App;
