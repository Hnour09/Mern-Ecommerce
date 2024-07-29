import styled from "styled-components";
import { flexCentering } from "../../styles/customStyles";

// Define some color constants for easier theming
const primaryColor = "#3498db";
const secondaryColor = "#2ecc71";
const backgroundColor = "#f5f5f5";
const textColor = "#333";
const boxShadowColor = "rgba(0, 0, 0, 0.1)";

export const Nav = styled.nav`
  ${flexCentering}
  gap: 20px;
  svg {
    font-size: 24px;
    transition: color 0.3s;
    &:hover {
      color: ${secondaryColor};
    }
  }
`;

export const NavLinks = styled.ul`
  ${flexCentering}
  gap: 20px;
  transition: all 0.3s ease-in-out;

  @media (max-width: 767px) {
    display: ${(props) => (props.isOpen ? `flex` : `none`)};
    position: fixed;
    top: 25px;
    bottom: 25px;
    left: 25px;
    right: 25px;
    background-color: white;
    color: ${textColor};
    box-shadow: 0 20px 40px ${boxShadowColor};
    border-radius: 20px;
    flex-direction: column;
    gap: 30px;
    z-index: 9999;
    padding: 20px;
    overflow: hidden;

    span {
      position: absolute;
      top: 20px;
      right: 20px;
      color: gray;
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: ${primaryColor};
      }
    }
  }

  li {
    transition: transform 0.3s, color 0.3s;
    &:hover {
      transform: scale(1.1);
      color: ${primaryColor};
    }
  }
`;

export const IconLinks = styled.ul`
  ${flexCentering}
  gap: 20px;
  li {
    transition: transform 0.3s, color 0.3s;
    &:hover {
      transform: scale(1.1);
      color: ${primaryColor};
    }
  }
`;
