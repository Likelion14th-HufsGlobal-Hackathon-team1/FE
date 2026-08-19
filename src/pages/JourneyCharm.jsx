import { TbBookmark, TbPencil, TbPlus } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import bagImage from "../assets/bag1.png";
import PrimaryButton from "../components/Button";

const CREATED_CHARMS_STORAGE_KEY = "onepick-created-charms";

const CHARM_POSITIONS = [
  { top: "38%", left: "34%", rotate: "-8deg" },
  { top: "40%", left: "50%", rotate: "5deg" },
  { top: "37%", left: "66%", rotate: "-3deg" },
  { top: "54%", left: "41%", rotate: "7deg" },
  { top: "53%", left: "59%", rotate: "-6deg" },
  { top: "58%", left: "74%", rotate: "8deg" },
];

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

const BagStage = styled.div`
  position: relative;
  width: min(282px, 82vw);
  aspect-ratio: 198 / 144;
  align-self: center;
  margin-top: 31px;
`;

const BagImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const AddedCharm = styled.button`
  position: absolute;
  z-index: 1;
  top: ${({ $position }) => $position.top};
  left: ${({ $position }) => $position.left};
  width: clamp(35px, 16%, 50px);
  height: 27%;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.14));
  transform: translate(-50%, -50%) rotate(${({ $position }) => $position.rotate});

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:focus-visible {
    border-radius: 8px;
    outline: 2px solid var(--color-walnut);
    outline-offset: 2px;
  }
`;

const VerifyButton = styled(PrimaryButton)`
  margin-top: auto;
`;

const JourneyCharm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  let createdCharms = state?.createdCharms;

  if (!Array.isArray(createdCharms)) {
    try {
      const savedCharms = JSON.parse(
        localStorage.getItem(CREATED_CHARMS_STORAGE_KEY) ?? "[]",
      );
      createdCharms = Array.isArray(savedCharms) ? savedCharms : [];
    } catch {
      createdCharms = [];
    }
  }

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

      <BagStage>
        <BagImage src={bagImage} alt="MCM 가방" />
        {createdCharms.map((charm, index) => {
          if (!charm?.imageUrl) return null;
          const position = CHARM_POSITIONS[index % CHARM_POSITIONS.length];
          return (
            <AddedCharm
              key={charm.instanceId ?? `${charm.id}-${index}`}
              type="button"
              aria-label={`생성한 Charm ${index + 1} 상세 보기`}
              $position={position}
              onClick={() =>
                navigate("/journey/detail", {
                  state: { selectedCharm: charm, selectedIndex: index },
                })
              }
            >
              <img src={charm.imageUrl} alt="" />
            </AddedCharm>
          );
        })}
      </BagStage>

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
