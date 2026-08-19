import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import example1 from "../assets/example1.png";
import example2 from "../assets/example2.png";

/* ───────────────────── 유틸 ───────────────────── */
const getRandomPhotos = (photoArray, count) => {
  const shuffled = [...photoArray].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const PHOTO_POOL = [example1, example2];

/* ───────────────────── 애니메이션 ───────────────────── */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ───────────────────── 스타일 ───────────────────── */
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  background: var(--color-ivory-paper);
  max-width: 420px;
  margin: 0 auto;
  position: relative;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px 20px 12px;
`;

const BackButton = styled.button`
  position: absolute;
  left: 20px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--color-walnut);

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const TopTitle = styled.h1`
  font-family: var(--font-english);
  font-size: 18px;
  font-weight: 400;
  color: var(--color-walnut);
  margin: 0;
`;

/* ── 컨텐츠 ── */
const ContentArea = styled.div`
  flex: 1;
  padding: 0 16px 8px;
  animation: ${fadeInUp} 0.4s ease;
  overflow: visible;
`;

/* ── 다이어리 카드 (CapsuleDetail과 동일 고정 크기) ── */
const CARD_HEIGHT = 620;

const DiaryCard = styled.div`
  position: relative;
  background: var(--color-cream);
  border-radius: 16px;
  padding: 24px 20px 28px;
  box-shadow: 0 4px 24px rgba(92, 64, 51, 0.08);
  min-height: ${CARD_HEIGHT}px;
  display: flex;
  flex-direction: column;
  overflow: visible;
`;

/* 카드 내부 뒤로가기 */
const CardBackButton = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: var(--color-walnut);
  margin-bottom: 12px;

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

/* ── 마스킹테이프 탭 (CapsuleDetail과 동일) ── */
const TapeTabs = styled.div`
  position: absolute;
  right: -56px;
  top: 180px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 2px;
  pointer-events: auto;
`;

const TapeTab = styled.button`
  width: 56px;
  padding: 12px 8px;
  border: none;
  cursor: pointer;
  font-family: var(--font-english);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-align: center;
  border-radius: 0 6px 6px 0;
  position: relative;
  transition: background 200ms ease, color 200ms ease, box-shadow 200ms ease;

  background: ${(props) =>
    props.$active ? "var(--color-walnut)" : "var(--color-soft-taupe)"};
  color: ${(props) =>
    props.$active ? "var(--color-cream)" : "var(--color-walnut)"};
  box-shadow: ${(props) =>
    props.$active
      ? "2px 2px 6px rgba(0, 0, 0, 0.15)"
      : "inset 0 1px 3px rgba(0, 0, 0, 0.2)"};

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: -2px;
  }
`;

/* ── 참 정보 영역 ── */
const CharmHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
`;

const CharmImage = styled.img`
  width: 90px;
  height: 90px;
  object-fit: contain;
  flex-shrink: 0;
`;

const CharmInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
`;

const CharmRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-soft-taupe);

  &:last-child {
    border-bottom: none;
  }
`;

const CharmLabel = styled.span`
  font-family: var(--font-english);
  font-size: 11px;
  font-weight: 400;
  color: var(--color-soft-taupe);
  letter-spacing: 0.5px;
  width: 70px;
  flex-shrink: 0;
`;

const CharmValue = styled.span`
  font-family: var(--font-kopub);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-walnut);
`;

/* ── 폴라로이드 사진 (CapsuleDetail과 동일) ── */
const PhotoCollage = styled.div`
  position: relative;
  width: 100%;
  height: 280px;
  margin-top: auto;
`;

const PolaroidFrame = styled.div`
  position: absolute;
  width: 155px;
  padding: 8px 8px 24px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  transform: rotate(${(props) => props.$rotation}deg);

  &:nth-child(1) {
    top: 8px;
    left: 8px;
    z-index: 2;
  }

  &:nth-child(2) {
    top: 50px;
    right: 16px;
    z-index: 1;
  }
`;

const PolaroidImg = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 2px;
  display: block;
`;

const TapeDecor = styled.div`
  position: absolute;
  top: -8px;
  left: 16px;
  width: 44px;
  height: 18px;
  background: rgba(175, 170, 155, 0.45);
  transform: rotate(-6deg);
  border-radius: 2px;
  z-index: 3;
`;

/* ── 도트 인디케이터 ── */
const DotIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 14px 0 20px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) =>
    props.$active ? "var(--color-walnut)" : "var(--color-soft-taupe)"};
`;

/* ───────────────────── 아이콘 ───────────────────── */
const ArrowLeftIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

/* ───────────────────── 컴포넌트 ───────────────────── */
const CharmDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Charm 목록에서 전달된 데이터
  const charm = location.state?.charm || {
    image: null,
    date: "2028.8.15",
    country: "FRANCE",
    city: "PARIS",
  };

  // 랜덤 폴라로이드 사진
  const photos = useMemo(() => {
    const selected = getRandomPhotos(PHOTO_POOL, 2);
    return selected.map((src) => ({
      src,
      rotation: Math.random() * 8 - 3,
    }));
  }, []);

  return (
    <PageWrapper>
      {/* 상단 헤더 */}
      <TopBar>
        <BackButton
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <ArrowLeftIcon />
        </BackButton>
        <TopTitle>charm</TopTitle>
      </TopBar>

      {/* 컨텐츠 */}
      <ContentArea>
        <DiaryCard>
          {/* 마스킹테이프 탭 */}
          <TapeTabs>
            <TapeTab
              $active={false}
              onClick={() => navigate("/capsule-detail")}
            >
              letter
            </TapeTab>
            <TapeTab $active={true}>charm</TapeTab>
          </TapeTabs>

          {/* 카드 내부 뒤로가기 */}
          <CardBackButton
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Charm 목록으로 돌아가기"
          >
            <ArrowLeftIcon size={18} />
          </CardBackButton>

          {/* 참 정보 */}
          <CharmHeader>
            {charm.image && (
              <CharmImage src={charm.image} alt="참 이미지" />
            )}
            <CharmInfo>
              <CharmRow>
                <CharmLabel>DATE</CharmLabel>
                <CharmValue>{charm.date}</CharmValue>
              </CharmRow>
              <CharmRow>
                <CharmLabel>COUNTRY</CharmLabel>
                <CharmValue>{charm.country}</CharmValue>
              </CharmRow>
              <CharmRow>
                <CharmLabel>CITY</CharmLabel>
                <CharmValue>{charm.city}</CharmValue>
              </CharmRow>
            </CharmInfo>
          </CharmHeader>

          {/* 인증 사진 콜라주 */}
          <PhotoCollage>
            {photos.map((photo, i) => (
              <PolaroidFrame key={i} $rotation={photo.rotation}>
                <TapeDecor />
                <PolaroidImg src={photo.src} alt={`인증 사진 ${i + 1}`} />
              </PolaroidFrame>
            ))}
          </PhotoCollage>
        </DiaryCard>
      </ContentArea>

      {/* 도트 인디케이터 */}
      <DotIndicator>
        <Dot $active={false} />
        <Dot $active={true} />
      </DotIndicator>
    </PageWrapper>
  );
};

export default CharmDetail;
