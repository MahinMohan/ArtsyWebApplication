import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Register({ onLogin, onData, setloggedinuser }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";

    if (name === "fullname" && !value) error = "Please enter your full name.";
    if (name === "email" && (!value.includes("@") || !value.includes(".")))
      error = "Enter a valid email address.";
    if (name === "password" && !value) error = "Password is required.";

    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateField("fullname", fullname);
    validateField("email", email);
    validateField("password", password);

    if (
      !fullname &&
      !email.includes("@") &&
      !email.includes(".") &&
      !password
    ) {
      return;
    }

    try {
      console.log(JSON.stringify({ fullname, email, password }));
      const response = await fetch("/api/createaccount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, email, password }),
      });
      console.log("data sent");
      const validation = await response.json();
      const gravatar = validation.gravatar;
      const name = validation.fullname;
      console.log(validation);
      if (validation.message == "User with this email already exists") {
        onLogin(false);
        setErrors({ ...errors, email: validation.message });
        return;
      }

      if (response.ok) {
        setFullname("");
        setEmail("");
        setPassword("");
        setErrors({});
        setLoggedIn(true);
        setloggedinuser(validation);
        onLogin(true);
        onData(name, gravatar);
        navigate("/search");
      } else {
        console.log("Registration failed try again");
      }
    } catch (error) {
      console.log("Something went wrong try again later");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center mt-3">
      <div
        className="border rounded p-4 shadow-sm w-100"
        style={{ maxWidth: "380px" }}
      >
        <h2 className="mb-4  fs-4">Register</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fs-6">Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="John Doe"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              onBlur={() => validateField("fullname", fullname)}
              onKeyDown={handleKeyPress}
              isInvalid={!!errors.fullname}
              size="sm"
            />
            <Form.Control.Feedback type="invalid">
              {errors.fullname}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fs-6">Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateField("email", email)}
              isInvalid={!!errors.email}
              size="sm"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fs-6">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => validateField("password", password)}
              isInvalid={!!errors.password}
              size="sm"
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 btn-sm"
            disabled={!email || !password || errors.email || errors.password}
          >
            Register
          </Button>
        </Form>
      </div>

      <div className="text-center mt-3">
        Already have an account? <a href="/login">Login</a>
      </div>
    </Container>
  );
}

export default Register;
