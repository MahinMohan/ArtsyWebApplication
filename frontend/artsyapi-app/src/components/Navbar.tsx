import React from "react";
import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function TopNavBar(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `ms-3 px-3 py-2 rounded ${
      isActive(path) ? "bg-primary text-white" : "text-dark"
    }`;

  const handledeleteaccount = async () => {
    try {
      const response = await fetch("/api/deleteaccount", {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        props.handlenotification({
          message: "Account deleted",
          variant: "danger",
        });
        console.log("Deleted account");
        console.log(data);
        props.onlogin(false);
      } else {
        console.log("Problem with deleting out");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlelogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        props.handlenotification({
          message: "Logged out",
          variant: "success",
        });
        console.log("Logged out");
        console.log(data);
        props.onlogin(false);
        window.location.href = "/search";
        sessionStorage.removeItem("artist_id");
      } else {
        console.log("Problem with log out");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar
      bg="light"
      variant="light"
      expand="lg"
      className="border-bottom w-100"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="ms-2">
          Artist Search
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="topnav-collapse" />
        <Navbar.Collapse id="topnav-collapse">
          <Nav className="ms-auto">
            {props.isLoggedIn ? (
              <>
                {/* <Nav.Link as={Link} to="/search" className={linkClass("/search")}> */}
                <Nav.Link
                  as={Link}
                  to="/search"
                  className={`ms-3 px-3 py-2 rounded ${
                    isActive("/search") ? "text-white" : "text-dark"
                  }`}
                  style={
                    isActive("/search") ? { backgroundColor: "#17479E" } : {}
                  }
                >
                  Search
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/favourites"
                  className={`ms-3 px-3 py-2 rounded ${
                    isActive("/favourites") ? "text-white" : "text-dark"
                  }`}
                  style={
                    isActive("/favourites")
                      ? { backgroundColor: "#17479E" }
                      : {}
                  }
                >
                  Favourites
                </Nav.Link>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="link"
                    id="dropdown-basic"
                    className="d-flex align-items-center text-dark text-decoration-none"
                  >
                    <img
                      src={props.gravatar}
                      alt="User Avatar"
                      className="rounded-circle me-2"
                      width="32"
                      height="32"
                    />
                    {props.name}
                  </Dropdown.Toggle>

                  <Dropdown.Menu align="end">
                    <Dropdown.Item
                      className="text-danger"
                      onClick={handledeleteaccount}
                    >
                      Delete account
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handlelogout}>
                      Log out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/search"
                  className={`ms-3 px-3 py-2 rounded ${
                    isActive("/search") ? "text-white" : "text-dark"
                  }`}
                  style={
                    isActive("/search") ? { backgroundColor: "#17479E" } : {}
                  }
                >
                  Search
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={`ms-3 px-3 py-2 rounded ${
                    isActive("/login") ? "text-white" : "text-dark"
                  }`}
                  style={
                    isActive("/login") ? { backgroundColor: "#17479E" } : {}
                  }
                >
                  Log in
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/register"
                  className={`ms-3 px-3 py-2 rounded ${
                    isActive("/register") ? "text-white" : "text-dark"
                  }`}
                  style={
                    isActive("/register") ? { backgroundColor: "#17479E" } : {}
                  }
                >
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavBar;
