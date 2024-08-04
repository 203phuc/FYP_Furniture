import { React, useState } from "react";
import { NavLink } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
  };

  return (
    <FormContainer>
      <h1> Login</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="" controlId="Email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="" controlId="Email">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
      </Form>
    </FormContainer>
  );
};

export default LoginPage;
