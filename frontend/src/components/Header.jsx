import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate, Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { logout } from "../Redux/slices/authSlice.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../Redux/slices/userApiSlice.js";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [logoutApiCall, { isLoading }] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar expand="lg" bg="dark" variant="dark">
        <Container>
          <Nav.Link as={Link} to="/">
            <Navbar.Brand>COZNITURE</Navbar.Brand>
          </Nav.Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="">
                    {" "}
                    {/* */}
                    <FaUser /> Sign In
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register" className="">
                    {" "}
                    {/* */}
                    <FaUser /> Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
