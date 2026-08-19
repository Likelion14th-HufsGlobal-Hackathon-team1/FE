import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import charmBag from "../assets/charm-bag.svg";
import mcmLogo from "../assets/mcm-logo.svg";

const Page = styled.main`
  display: flex;
  width: min(100%, 480px);
  min-height: 100svh;
  margin: 0 auto;
  padding: clamp(55px, 9svh, 86px) 38px clamp(48px, 7svh, 68px);
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  color: #33251f;
  background: var(--color-ivory-paper);
  text-align: center;

  @media (max-width: 360px) {
    padding-inline: 28px;
  }
`;

const BrandLogo = styled.img`
  display: block;
  width: 86px;
  height: 76px;
  object-fit: contain;
`;

const Tagline = styled.p`
  margin: 20px 0 0;
  color: #33251f;
  font: 400 clamp(16px, 4.5vw, 19px) / 1.3 var(--font-english);
`;

const HeroVisual = styled.img`
  display: block;
  width: min(315px, 92vw);
  height: auto;
  margin-top: clamp(70px, 11svh, 110px);
  margin-bottom: clamp(50px, 7svh, 76px);
`;

const StartButton = styled.button`
  display: flex;
  width: 100%;
  height: 56px;
  margin-top: auto;
  align-items: center;
  justify-content: center;
  gap: 16px;
  border: 0;
  border-radius: 30px;
  color: #fffaf2;
  background: var(--color-walnut);
  font: 300 clamp(16px, 4.5vw, 19px) / 1 var(--font-kopub);
  cursor: pointer;
  transition: filter 160ms ease, transform 160ms ease;

  &:hover { filter: brightness(1.08); }
  &:active { transform: scale(.98); }
  &:focus-visible { outline: 2px solid var(--color-walnut); outline-offset: 3px; }
`;

function Landing() {
  const navigate = useNavigate();

  return (
    <Page>
      <BrandLogo src={mcmLogo} alt="MCM" />
      <Tagline>Archive the journey,<br />preserve the story of your MCM.</Tagline>
      <HeroVisual src={charmBag} alt="참 장식이 달린 MCM 가방" />
      <StartButton type="button" onClick={() => navigate("/login")}>
        Archiv 시작하기 <FiArrowRight aria-hidden="true" />
      </StartButton>
    </Page>
  );
}

export default Landing;
