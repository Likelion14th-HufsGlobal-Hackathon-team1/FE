import { useEffect, useState } from "react";
import { TbBookmark, TbPencil, TbPlus } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import bagImage from "../assets/bag1.png";
import PrimaryButton from "../components/Button";
import CharmKeyring from "../components/CharmKeyring";
import { apiGet } from "../utils/api";

const DEFAULT_CHARM_LAYOUTS = [
  { x: 34, y: 38, rotation: -8, scale: 0.16 },
  { x: 50, y: 40, rotation: 5, scale: 0.16 },
  { x: 66, y: 37, rotation: -3, scale: 0.16 },
  { x: 41, y: 54, rotation: 7, scale: 0.16 },
  { x: 59, y: 53, rotation: -6, scale: 0.16 },
  { x: 74, y: 58, rotation: 8, scale: 0.16 },
];

const Page = styled.main`
  display: flex;
  width: min(100%, 480px);
  min-height: calc(100svh - 105px - env(safe-area-inset-bottom));
  margin: 0 auto;
  padding: 66px clamp(20px, 7.7vw, 37px) 20px;
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
  top: ${({ $layout }) => $layout.y}%;
  left: ${({ $layout }) => $layout.x}%;
  width: ${({ $layout }) => $layout.scale * 100}%;
  aspect-ratio: 1;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.14));
  transform: translate(-50%, -50%) rotate(${({ $layout }) => $layout.rotation}deg);

  > span {
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
  margin-top: clamp(48px, 10svh, 96px);

  @media (max-height: 720px) {
    margin-top: 40px;
  }
`;

const LoadMessage = styled.p`
  margin: 16px 0 0;
  color: ${({ $error }) => ($error ? "#b42318" : "var(--color-soft-taupe)")};
  font: 300 12px/1.4 var(--font-kopub);
  text-align: center;
`;

const JourneyCharm = () => {
  const navigate = useNavigate();
  const [charms, setCharms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadCharms = async () => {
      try {
        console.info("[Charm 목록] GET /api/charms 요청을 전송합니다.");
        const { data } = await apiGet("/charms");
        const list = Array.isArray(data?.charms) ? data.charms : [];
        if (!active) return;
        setCharms(list);
        console.info(`[Charm 목록] Charm ${list.length}개를 확인했습니다.`, { totalCountries: data?.totalCountries, totalJourneys: data?.totalJourneys });
      } catch (loadError) {
        console.error("[Charm 목록 오류] Charm 목록 조회에 실패했습니다.", loadError);
        if (active) setError(loadError.message || "Charm 목록을 불러오지 못했습니다.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadCharms();
    return () => { active = false; };
  }, []);

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
        {charms.map((charm, index) => {
          if (!charm?.aiImageUrl) return null;
          const hasServerPosition = Number.isFinite(charm.positionX)
            && Number.isFinite(charm.positionY)
            && Number.isFinite(charm.scale)
            && charm.scale > 0;
          const layout = hasServerPosition
            ? {
                x: charm.positionX * 100,
                y: charm.positionY * 100,
                rotation: Number.isFinite(charm.rotation) ? charm.rotation : 0,
                scale: charm.scale,
              }
            : DEFAULT_CHARM_LAYOUTS[index % DEFAULT_CHARM_LAYOUTS.length];
          return (
            <AddedCharm
              key={charm.charmId}
              type="button"
              aria-label={`생성한 Charm ${index + 1} 상세 보기`}
              $layout={layout}
              onClick={() =>
                navigate(`/journey/detail?charmId=${charm.charmId}`)
              }
            >
              <CharmKeyring src={charm.aiImageUrl} />
            </AddedCharm>
          );
        })}
      </BagStage>

      {isLoading && <LoadMessage>Charm을 불러오는 중...</LoadMessage>}
      {error && <LoadMessage $error role="alert">{error}</LoadMessage>}

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
