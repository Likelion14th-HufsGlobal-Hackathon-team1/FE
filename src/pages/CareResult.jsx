import { useEffect, useState } from "react";
import { TbArrowLeft, TbClipboardCheck, TbSearch } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import PrimaryButton from "../components/Button";

const GOOD_CONDITION_THRESHOLD = 70;

// TODO: 백엔드 연동 후 분석 API 응답으로 교체합니다.
const MOCK_ANALYSIS = {
  overallCondition: 86,
  items: [
    {
      label: "표면 오염도",
      status: "좋음",
      score: 18,
      description: "AI가 얼룩, 이염, 변색 등 가방 표면의 오염 상태를 분석해요.",
    },
    {
      label: "소재 컨디션",
      status: "주의",
      score: 57,
      description: "AI가 가죽의 건조함, 갈라짐, 광택 등 소재의 상태를 분석해요.",
    },
    {
      label: "형태/부속품",
      status: "케어 필요",
      score: 84,
      description: "AI가 형태 변형, 모서리 마모, 스트랩과 금속 부속의 상태를 분석해요.",
    },
  ],
};

const STATUS_COLORS = {
  좋음: "#18c954",
  주의: "#e5c800",
  "케어 필요": "#ff3b30",
};

const Page = styled.main`
  display: flex;
  width: min(100%, 480px);
  min-height: calc(100svh - 105px - env(safe-area-inset-bottom));
  margin: 0 auto;
  padding: 18px clamp(20px, 7.7vw, 37px) 58px;
  flex-direction: column;
  color: #090a0a;
  background: var(--color-ivory-paper);
  text-align: left;
`;

const BackButton = styled.button`
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 0;
  padding: 0;
  background: transparent;
  color: #090a0a;
  cursor: pointer;

  svg { width: 25px; height: 25px; }
`;

const Header = styled.header`
  margin-top: 7px;
  text-align: center;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin: 0;
  color: #090a0a;
  font: 300 20px/1 var(--font-kopub);

  svg { width: 23px; height: 23px; }
`;

const Subtitle = styled.p`
  margin: 10px 0 0;
  color: var(--color-soft-taupe);
  font: 300 10px/1.3 var(--font-kopub);
`;

const PhotoFrame = styled.div`
  display: grid;
  width: fit-content;
  max-width: 100%;
  margin: 18px auto 0;
  place-items: center;
  background: transparent;
`;

const BagPhoto = styled.img`
  display: block;
  width: auto;
  max-width: min(100%, 320px);
  height: auto;
  max-height: min(38svh, 300px);
  border-radius: 30px;
  object-fit: contain;
`;

const PhotoFallback = styled.span`
  display: grid;
  width: min(190px, 50vw);
  aspect-ratio: 1 / 1;
  place-items: center;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.7);
  color: var(--color-soft-taupe);
  font: 300 12px/1.4 var(--font-kopub);
`;

const Summary = styled.section`
  margin-top: 17px;
  text-align: center;
`;

const Score = styled.strong`
  display: block;
  font: 500 17px/1.3 var(--font-kopub);
`;

const SummaryText = styled.p`
  margin: 3px 0 0;
  font: 300 14px/1.55 var(--font-kopub);
`;

const AnalysisCard = styled.section`
  margin-top: 25px;
  border-radius: 17px;
  padding: 15px 18px 17px;
  background: #fff;
`;

const Item = styled.div`
  & + & { margin-top: 12px; }
`;

const ItemTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font: 300 12px/1 var(--font-kopub);
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  margin-left: 2px;
  border-radius: 50%;
  background: ${({ $status }) => STATUS_COLORS[$status]};
`;

const Status = styled.strong`
  color: ${({ $status }) => STATUS_COLORS[$status]};
  font-weight: 500;
`;

const ItemDescription = styled.p`
  margin: 7px 0 0;
  border-radius: 5px;
  padding: 6px 8px;
  background: #f1f1f1;
  color: #666;
  font: 300 9px/1.35 var(--font-kopub);
`;

const ScaleLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  color: #8c8c8c;
  font: 300 8px/1 var(--font-kopub);

  span:first-child { color: #18c954; }
  span:last-child { color: #ff3b30; }
`;

const ProgressTrack = styled.div`
  position: relative;
  height: 12px;
  margin-top: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #12d94d 0%, #46df39 34%, #ffd21a 62%, #ff3b30 100%);
`;

const ProgressMarker = styled.span`
  position: absolute;
  top: 50%;
  left: ${({ $score }) => `${$score}%`};
  width: 3px;
  height: 17px;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.16);
  transform: translate(-50%, -50%);
`;

const StoreButton = styled(PrimaryButton)`
  margin-top: 35px;
`;

const CareResult = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [photoUrl, setPhotoUrl] = useState("");
  const analysis = MOCK_ANALYSIS;
  const isGoodCondition = analysis.overallCondition >= GOOD_CONDITION_THRESHOLD;

  useEffect(() => {
    if (!state?.photo) return undefined;
    const objectUrl = URL.createObjectURL(state.photo);
    setPhotoUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [state?.photo]);

  return (
    <Page>
      <BackButton type="button" aria-label="이전 페이지" onClick={() => navigate(-1)}>
        <TbArrowLeft aria-hidden="true" />
      </BackButton>

      <Header>
        <Title><TbClipboardCheck aria-hidden="true" />내 가방 상태 분석 완료</Title>
        <Subtitle>
          ※ AI 분석 결과는 촬영 환경에 따라 실제 제품 상태와 차이가 있을 수 있습니다.
        </Subtitle>
      </Header>

      <PhotoFrame>
        {photoUrl ? (
          <BagPhoto src={photoUrl} alt="업로드한 가방" />
        ) : (
          <PhotoFallback>업로드한 사진이 없습니다.</PhotoFallback>
        )}
      </PhotoFrame>

      <Summary>
        <Score>전체 컨디션 {analysis.overallCondition}%</Score>
        {isGoodCondition ? (
          <SummaryText>
            현재 좋은 컨디션을 유지하고 있어요.<br />
            MCM의 전문 케어와 함께<br />
            소중한 제품을 더욱 오래 간직해보세요.
          </SummaryText>
        ) : (
          <SummaryText>
            전문적인 케어가 필요해요<br />
            가까운 MCM 매장에서 제품의 상태를 직접 확인하고,<br />
            적합한 케어 방법을 상담받아보세요.
          </SummaryText>
        )}
      </Summary>

      <AnalysisCard>
        {analysis.items.map((item) => (
          <Item key={item.label}>
            <ItemTitle>
              <span>{item.label}</span>
              <StatusDot $status={item.status} aria-hidden="true" />
              <Status $status={item.status}>{item.status}</Status>
            </ItemTitle>
            <ItemDescription>{item.description}</ItemDescription>
            <ScaleLabels><span>좋음</span><span>케어 필요</span></ScaleLabels>
            <ProgressTrack>
              <ProgressMarker $score={item.score} aria-hidden="true" />
            </ProgressTrack>
          </Item>
        ))}
      </AnalysisCard>

      <StoreButton icon={<TbSearch />} onClick={() => navigate("/reservation")}>
        MCM 케어 상담 예약하기
      </StoreButton>
    </Page>
  );
};

export default CareResult;
