import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate, Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { logout } from "../Redux/slices/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { useLogoutMutation } from "../Redux/slices/userApiSlice.js";
import { AiOutlineSearch } from "react-icons/ai";

const Header = () => {
  // User section
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  // Search section
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>
        <Row className="w-100 align-items-center">
          <Col xs={6} lg={3} className="d-flex align-items-center">
            <Nav.Link as={Link} to="/">
              <Navbar.Brand>COZNITURE</Navbar.Brand>
            </Nav.Link>
          </Col>
          <Col xs={12} lg={6} className="d-none d-lg-flex">
            <div className="w-100 position-relative">
              <input
                type="text"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-100 h-[40px] px-2 border-[#3957db] border-2 rounded-md"
              />
              <AiOutlineSearch
                size={30}
                className="position-absolute end-2 top-50 translate-middle-y cursor-pointer"
              />
              {searchData && searchData.length !== 0 && (
                <div className="position-absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-9 p-4 w-100 mt-2">
                  {searchData.map((i) => (
                    <Link key={i._id} to={`/product/${i._id}`}>
                      <div className="w-full d-flex align-items-center py-3">
                        <img
                          src={`${i.images[0]?.url}`}
                          alt=""
                          className="w-[40px] h-[40px] me-2"
                        />
                        <h5>{i.name}</h5>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Col>
          <Col
            xs={6}
            lg={3}
            className="d-flex align-items-center justify-content-end"
          >
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
                    <Nav.Link
                      as={Link}
                      to="/login"
                      className="d-flex align-items-center"
                    >
                      <FaUser className="me-2" /> Login
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/register"
                      className="d-flex align-items-center"
                    >
                      <FaUser className="me-2" /> Register
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Header;
