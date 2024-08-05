import { React, useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer.jsx";
import { useLoginMutation } from "../Redux/slices/userApiSlice.js";
import { setCredentials } from "../Redux/slices/authSlice.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (userInfo) {
      console.log("nav things");
      navigate("/");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
      console.log("Credentials set:", res);
    } catch (err) {
      console.log("Login error:", err?.data?.message || err);
    }
  };

  return (
    <FormContainer>
      <h1> Login</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2">
          submit
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          New Customer? <Link to="/register">Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginPage;
