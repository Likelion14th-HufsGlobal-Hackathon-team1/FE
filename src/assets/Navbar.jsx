import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

import careIcon from "./navbar-icons/care.svg";
import homeIcon from "./navbar-icons/home.svg";
import journeyIcon from "./navbar-icons/journey.svg";
import mypageIcon from "./navbar-icons/mypage.svg";

const NAV_ITEMS = [
  { label: "Home", to: "/", icon: homeIcon, matches: (path) => path === "/" },
  {
    label: "Care",
    to: "/care/upload",
    icon: careIcon,
    matches: (path) => path.startsWith("/care"),
  },
  {
    label: "Journey",
    to: "/journey/trip",
    icon: journeyIcon,
    matches: (path) => path.startsWith("/journey"),
  },
  {
    label: "My Page",
    to: "/mypage",
    icon: mypageIcon,
    matches: (path) => path === "/mypage",
  },
];

const Nav = styled.nav`
  position: fixed;
  z-index: 1000;
  right: 50%;
  bottom: 0;
  width: min(420px, 100vw);
  height: calc(85px + env(safe-area-inset-bottom));
  transform: translateX(50%);
  border-radius: 35px 35px 0 0;
  background: var(--color-ivory-paper);
  box-shadow:
    0 -28px 9px rgba(0, 0, 0, 0.02),
    0 -13px 7px rgba(0, 0, 0, 0.03),
    0 -3px 4px rgba(0, 0, 0, 0.03);
`;

const MenuList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 55px);
  justify-content: center;
  gap: 35px;
  padding-top: 11px;

  @media (max-width: 390px) {
    gap: calc((100vw - 240px) / 3);
  }
`;

const MenuLink = styled(Link)`
  display: flex;
  width: 55px;
  height: 63px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding-top: 5px;
  border-radius: 13px;
  color: var(--color-walnut);
  font-family: var(--font-kopub);
  font-size: 12px;
  font-weight: 300;
  line-height: 1;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 160ms ease;

  &[aria-current="page"] {
    background: rgba(182, 168, 146, 0.3);
    font-weight: 500;
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 2px;
  }
`;

const MenuIcon = styled.img`
  display: block;
  width: 30px;
  height: 30px;
`;

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <Nav aria-label="주요 메뉴">
      <MenuList>
        {NAV_ITEMS.map((item) => {
          const isActive = item.matches(pathname);

          return (
            <MenuLink
              key={item.label}
              to={item.to}
              aria-current={isActive ? "page" : undefined}
            >
              <MenuIcon src={item.icon} alt="" aria-hidden="true" />
              <span>{item.label}</span>
            </MenuLink>
          );
        })}
      </MenuList>
    </Nav>
  );
};

export default Navbar;
