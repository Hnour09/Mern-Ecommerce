import React, { useState } from "react";
import {
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { LinkContainer } from "react-router-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsPersonFill } from "react-icons/bs";
import { TfiMenu } from "react-icons/tfi";
import { MdOutlineClose } from "react-icons/md";

import logo from "../../assets/imgs/logo.jpg";
import BadgedCartIcon from "../../common/components/Icons/BadgedCartIcon";
import { logout } from "../../features/user/userSlice";
import useUserCart from "../../common/hooks/cart/useUserCart";
import styled, { keyframes } from "styled-components";

// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Styled Components
const HeaderWrapper = styled.header`
  background-color: #f8f9fa;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  animation: ${fadeIn} 1s ease-in-out;
`;

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.img`
  width: 50px;
  height: 50px;
  cursor: pointer;
  animation: ${slideDown} 0.5s ease-in-out;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    flex-direction: column;
    background-color: #f8f9fa;
    position: absolute;
    top: 60px;
    right: ${(props) => (props.isOpen ? "0" : "-100%")};
    width: 200px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
`;

const NavItem = styled.li`
  margin: 0 1rem;
  cursor: pointer;
  animation: ${slideDown} 0.5s ease-in-out;

  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: #343a40;
  transition: color 0.3s;

  &:hover {
    color: #007bff;
  }
`;

const IconLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MenuToggle = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
    background-color: #343a40;
    padding: 0.5rem;
    border-radius: 50%;
    color: #f8f9fa;
  }
`;

// Header Component
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const { userProfile } = useSelector((state) => state.user);
  const { userCart } = useUserCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <HeaderWrapper>
      <Container>
        <Navbar>
          {/* Logo */}
          <LinkContainer to="/">
            <Logo src={logo} alt="Logo" />
          </LinkContainer>

          {/* Navbar */}
          <Nav>
            <NavLinks isOpen={isOpen}>
              {["home", "shop", "categories"].map((item, idx) => (
                <NavItem key={idx} onClick={toggle}>
                  <StyledNavLink to={item === "home" ? "/" : `/${item}`}>
                    {item}
                  </StyledNavLink>
                </NavItem>
              ))}
              <NavItem onClick={toggle}>
                <MdOutlineClose size={25} aria-label="Close menu" />
              </NavItem>
            </NavLinks>
            <IconLinks>
              <NavItem>
                <StyledNavLink to="/cart">
                  <BadgedCartIcon
                    numOfItems={userCart?.cart?.cartItems?.length}
                  />
                </StyledNavLink>
              </NavItem>
              {!userProfile.loading && (
                <NavItem>
                  {userProfile.user ? (
                    <UncontrolledDropdown>
                      <DropdownToggle
                        className="p-0 bg-secondary"
                        color="light"
                      >
                        <img
                          src={userProfile.user.image}
                          alt="User"
                          width={40}
                          className="rounded-circle"
                          loading="lazy"
                        />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => navigate("/profile")}>
                          Profile
                        </DropdownItem>
                        {userProfile.user.role === "admin" && (
                          <>
                            <DropdownItem divider />
                            <DropdownItem
                              onClick={() => navigate("/admin/products")}
                            >
                              Dashboard
                            </DropdownItem>
                          </>
                        )}
                        <DropdownItem divider />
                        <DropdownItem onClick={() => dispatch(logout())}>
                          Logout
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  ) : (
                    <StyledNavLink to="/login">
                      <BsPersonFill aria-label="Login" />
                    </StyledNavLink>
                  )}
                </NavItem>
              )}
              <MenuToggle onClick={toggle}>
                <TfiMenu size={25} aria-label="Toggle menu" />
              </MenuToggle>
            </IconLinks>
          </Nav>
        </Navbar>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;
