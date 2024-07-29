import React from "react";
import { Col, Container, Row } from "reactstrap";
import { AiTwotoneHeart } from "react-icons/ai";
import logo from "../../assets/imgs/logo.jpg";
import paymentLogo from "../../assets/imgs/payment-method.png";
import { NavLink } from "react-router-dom";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaPhoneAlt,
  FaTiktok,
  FaTwitter,
} from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import SocialIcon from "../../common/components/Icons/SocialIcon";
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

const bounceIn = keyframes`
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
`;

// Styled Components
const FooterWrapper = styled.footer`
  background-color: #343a40;
  color: #f8f9fa;
  padding: 2rem 0;
  animation: ${fadeIn} 1s ease-in-out;
`;

const FooterLogoSection = styled(Col)`
  text-align: left;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 2s ease-in-out;
`;

const FooterLogo = styled.img`
  max-width: 150px;
  margin-bottom: 1rem;
`;

const FooterDescription = styled.p`
  font-size: 1rem;
  color: #adb5bd;
`;

const FooterSocialIcons = styled.div`
  display: flex;
  align-items: center;

  .social-icon {
    margin-right: 0.5rem;
    animation: ${bounceIn} 0.5s ease-in-out;
  }
`;

const FooterSection = styled(Col)`
  margin-bottom: 1rem;
`;

const FooterTitle = styled.h5`
  font-size: 1.25rem;
  font-weight: bold;
  color: #f8f9fa;
  margin-top: 1rem;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
`;

const FooterLinkItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const FooterLinkIcon = styled(MdKeyboardArrowRight)`
  color: #adb5bd;
`;

const FooterLink = styled(NavLink)`
  text-decoration: none;
  color: #adb5bd;
  transition: color 0.3s;

  &:hover {
    color: #007bff;
  }
`;

const FooterContact = styled.ul`
  list-style: none;
  padding: 0;
`;

const FooterContactItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const FooterContactIcon = styled.span`
  color: #adb5bd;
  margin-right: 0.5rem;
`;

const FooterPaymentLogo = styled.div`
  img {
    max-width: 100%;
    height: auto;
  }
`;

const FooterMadeText = styled.div`
  background-color: #23272b;
  font-size: 1rem;
  color: #adb5bd;
  text-align: center;
  padding: 1rem;
  margin-top: 1rem;
  animation: ${fadeIn} 2s ease-in-out;
`;

// Footer Component
const Footer = () => {
  return (
    <FooterWrapper>
      <Container>
        <Row>
          <FooterLogoSection lg={6}>
            <FooterLogo src={logo} alt="Logo" />
            <FooterDescription>
              Discover a world of style and innovation with our exclusive range
              of products tailored for urban trendsetters.
            </FooterDescription>
            <FooterSocialIcons>
              {[
                { Icon: FaFacebookF, bgColor: "#3b5998" },
                { Icon: FaInstagram, bgColor: "#ac2bac" },
                { Icon: FaTiktok, bgColor: "#000" },
                { Icon: FaTwitter, bgColor: "#55acee" },
              ].map((item, idx) => (
                <SocialIcon key={idx} {...item} />
              ))}
            </FooterSocialIcons>
          </FooterLogoSection>
          <Col lg={6}>
            <Row>
              <FooterSection md={6}>
                <FooterTitle>Quick Links</FooterTitle>
                <FooterLinks>
                  {["Privacy Policy", "Get in Touch", "Support"].map((item) => (
                    <FooterLinkItem key={item}>
                      <FooterLinkIcon />
                      <FooterLink to="/">{item}</FooterLink>
                    </FooterLinkItem>
                  ))}
                </FooterLinks>
              </FooterSection>
              <FooterSection md={6}>
                <FooterTitle>Contact Us</FooterTitle>
                <FooterContact>
                  {[
                    {
                      Icon: AiFillHome,
                      text: "123 Fashion Ave, New York, NY 10001, USA",
                    },
                    { Icon: FaEnvelope, text: "contact@fashionhub.com" },
                    { Icon: FaPhoneAlt, text: "+1 (800) 123-4567" },
                  ].map(({ Icon, text }) => (
                    <FooterContactItem key={text}>
                      <FooterContactIcon as={Icon} size={20} />
                      {text}
                    </FooterContactItem>
                  ))}
                </FooterContact>
                <FooterPaymentLogo>
                  <img
                    src={paymentLogo}
                    alt="payment methods"
                    width="170px"
                    height="24px"
                  />
                </FooterPaymentLogo>
              </FooterSection>
            </Row>
          </Col>
        </Row>
      </Container>

      <FooterMadeText>Crafted with Passion by HNoureddine</FooterMadeText>
    </FooterWrapper>
  );
};

export default Footer;
