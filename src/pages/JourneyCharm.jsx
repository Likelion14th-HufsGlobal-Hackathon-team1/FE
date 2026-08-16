import { TbBookmark, TbPencil, TbPlus } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import charmBag from "../assets/charm-bag.svg";
import PrimaryButton from "../components/Button";

const Page = styled.main`
  display: flex;
  width: min(100%, 480px);
  min-height: calc(100svh - 105px - env(safe-area-inset-bottom));
  margin: 0 auto;
  padding: 66px clamp(20px, 7.7vw, 37px) 99px;
  flex-direction: column;
  color: #090a0a;
  background: var(--color-ivory-paper);
  text-align: left;

  @media (max-height: 700px) {
    padding-top: 40px;
    padding-bottom: 48px;
  }
`;

const Intro = styled.section`
  width: min(100%, 246px);
`;

const TitleRow = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  gap: 15px;
`;

const BookmarkIcon = styled(TbBookmark)`
  width: 25px;
  height: 25px;
  flex: 0 0 auto;
`;

const Title = styled.h1`
  margin: 0;
  color: #090a0a;
  font: 300 20px/1 var(--font-kopub);
  letter-spacing: 0;
  white-space: nowrap;
`;

const DescriptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

const AccentLine = styled.span`
  width: 1px;
  height: 34px;
  flex: 0 0 auto;
  background: var(--color-soft-taupe);
`;

const Description = styled.p`
  margin: 0;
  color: #090a0a;
  font: 300 12px/1.15 var(--font-kopub);
  white-space: nowrap;

  @media (max-width: 340px) {
    font-size: 11px;
  }
`;

const DecorateButton = styled.button`
  display: flex;
  width: 75px;
  height: 21px;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  gap: 5px;
  margin-top: 53px;
  border: 0;
  border-radius: 30px;
  padding: 0;
  background: var(--color-soft-taupe);
  color: #090a0a;
  font: 300 12px/1 var(--font-kopub);
  cursor: pointer;

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    filter: brightness(0.96);
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 3px;
  }
`;

const BagImage = styled.img`
  display: block;
  width: min(282px, 82vw);
  height: auto;
  align-self: center;
  margin-top: 31px;
  object-fit: contain;
`;

const VerifyButton = styled(PrimaryButton)`
  margin-top: auto;
`;

const JourneyCharm = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <Intro>
        <TitleRow>
          <BookmarkIcon aria-hidden="true" />
          <Title>나의 Journey</Title>
        </TitleRow>

        <DescriptionRow>
          <AccentLine aria-hidden="true" />
          <Description>
            MCM과 함께한 순간을 기록하고,
            <br />
            여행의 추억을 하나씩 Charm으로 남겨보세요.
          </Description>
        </DescriptionRow>
      </Intro>

      <DecorateButton
        type="button"
        onClick={() => navigate("/journey/design")}
      >
        <TbPencil aria-hidden="true" />
        꾸미기
      </DecorateButton>

      <BagImage src={charmBag} alt="참 장식이 달린 MCM 가방" />

      <VerifyButton
        icon={<TbPlus />}
        onClick={() => navigate("/journey/trip")}
      >
        여정 인증하기
      </VerifyButton>
    </Page>
  );
};

export default JourneyCharm;
