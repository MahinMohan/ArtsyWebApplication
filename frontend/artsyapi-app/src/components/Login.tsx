import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login({ onLogin, onData, setloggedinuser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => email.includes("@");

  const validateField = (name, value) => {
    let error = "";

    if (name === "email" && !isValidEmail(value)) {
      error = "Please enter a valid email address.";
    }
    if (name === "password" && !value) {
      error = "Password is required.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateField("email", email);
    validateField("password", password);

    if (isValidEmail(email) && password) {
      try {
        console.log("Login data sent", { email, password });

        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const validation = await response.json();
        const gravatar = validation.gravatar;
        const name = validation.fullname;
        if (validation.message == "Password or email is incorrect") {
          onLogin(false);
          setErrors({ ...errors, password: validation.message });
          return;
        }
        console.log(validation);
        if (response.ok) {
          setEmail("");
          setPassword("");
          setErrors({ email: "", password: "" });
          setLoggedIn(true);
          setloggedinuser(validation);
          onLogin(true);
          navigate("/search");
          onData(name, gravatar);
          sessionStorage.removeItem("artist_id");
        } else {
          console.log("Login unsuccessful");
        }
      } catch (error) {
        console.log("Error in the backend when logging in");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key == "Enter") handleSubmit(e);
  };

  return (
    <Container className="d-flex flex-column align-items-center mt-3">
      <div
        className="border rounded p-4 shadow-sm w-100"
        style={{ maxWidth: "380px" }}
      >
        <Form onSubmit={handleSubmit}>
          <h2 className="mb-4 fs-4">Login</h2>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label className="fs-6">Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateField("email", email)}
              onKeyDown={handleKeyPress}
              isInvalid={!!errors.email}
              size="sm"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label className="fs-6">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
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
            Log in
          </Button>
        </Form>
      </div>

      <div className="text-center mt-3">
        Don't have an account yet? <a href="/register">Register</a>
      </div>
    </Container>
  );
}

export default Login;
