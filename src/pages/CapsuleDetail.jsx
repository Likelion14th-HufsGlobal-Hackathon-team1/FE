import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import { apiGet } from "../utils/api";

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(`${date}T00:00:00`)
    .toLocaleDateString("ko-KR")
    .replace(/\. /g, ".")
    .replace(/\.$/, "");
};

/* ───────────────────── 애니메이션 ───────────────────── */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const envelopeShake = keyframes`
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-3deg); }
  40% { transform: rotate(3deg); }
  60% { transform: rotate(-2deg); }
  80% { transform: rotate(2deg); }
`;

const fadeInText = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

/* ───────────────────── 인트로 ───────────────────── */
const IntroOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--color-ivory-paper);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  animation: ${fadeOut} 0.5s ease forwards;
  animation-delay: 1.8s;
  pointer-events: none;
`;

const IntroIcon = styled.div`
  font-size: 48px;
  animation: ${envelopeShake} 1s ease-in-out;
`;

const IntroText = styled.p`
  font-family: var(--font-kopub);
  font-size: 16px;
  font-weight: 300;
  color: var(--color-walnut);
  opacity: 0;
  animation: ${fadeInText} 0.6s ease forwards;
  animation-delay: 0.5s;
`;

/* ───────────────────── 페이지 ───────────────────── */
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100svh;
  background: var(--color-ivory-paper);
  max-width: 420px;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
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

/* ── 마스킹테이프 탭 ── */
const TAB_WIDTH = 48;

const TapeTabs = styled.div`
  position: absolute;
  right: -${TAB_WIDTH}px;
  top: 180px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 2px;
  pointer-events: auto;
`;

const TapeTab = styled.button`
  width: ${TAB_WIDTH}px;
  padding: 12px 5px;
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

/* ── 컨텐츠 ── */
const ContentArea = styled.div`
  flex: 1;
  /* 카드 밖으로 돌출되는 책갈피 너비만큼 오른쪽 공간을 확보한다. */
  padding: 0 ${TAB_WIDTH + 16}px 8px 16px;
  animation: ${fadeInUp} 0.4s ease;
  overflow: visible;
  box-sizing: border-box;

  @media (max-width: 360px) {
    padding-right: ${TAB_WIDTH + 10}px;
    padding-left: 10px;
  }
`;

/* ── 고정 크기 다이어리 카드 ── */
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
  box-sizing: border-box;

  @media (max-width: 360px) {
    padding-right: 16px;
    padding-left: 16px;
  }
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
  transition: background 200ms ease;
`;

/* ── Letter: 폴라로이드 사진 ── */
const PhotoCollage = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
  margin-bottom: 20px;
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
    top: 40px;
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

/* ── Letter: 줄노트 ── */
const LINE_H = 36;

const LetterLines = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const LetterLine = styled.div`
  min-height: ${LINE_H}px;
  border-bottom: 1px solid var(--color-soft-taupe);
  display: flex;
  align-items: center;
  padding: 0 4px;
`;

const LetterLineRight = styled.div`
  min-height: ${LINE_H}px;
  border-bottom: 1px solid var(--color-soft-taupe);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 4px;
`;

const EmptyLine = styled.div`
  height: ${LINE_H}px;
  border-bottom: 1px solid var(--color-soft-taupe);
`;

const LetterTitle = styled.span`
  font-family: var(--font-english);
  font-size: 15px;
  font-weight: 400;
  color: var(--color-walnut);
`;

const LetterDate = styled.span`
  font-family: var(--font-kopub);
  font-size: 13px;
  font-weight: 300;
  color: var(--color-walnut);
`;

const LetterBody = styled.p`
  font-family: var(--font-kopub);
  font-size: 13px;
  font-weight: 300;
  color: var(--color-walnut);
  line-height: ${LINE_H}px;
  margin: 0;
  padding: 0 4px;
  text-align: left;
  word-break: keep-all;
  background-image: repeating-linear-gradient(
    transparent,
    transparent ${LINE_H - 1}px,
    var(--color-soft-taupe) ${LINE_H - 1}px,
    var(--color-soft-taupe) ${LINE_H}px
  );
  min-height: ${LINE_H * 4}px;
`;

const LetterFrom = styled.span`
  font-family: var(--font-kopub);
  font-size: 13px;
  font-weight: 400;
  color: var(--color-walnut);
`;

/* ── Charm 리스트 ── */
const CharmScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 8px 2px 16px 0;
`;

const CharmItem = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  min-height: 132px;
  padding: 18px 0;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(182, 168, 146, 0.3);
  }
`;

const CharmImageContainer = styled.div`
  width: 88px;
  height: 88px;
  flex: 0 0 88px;
  border: 0;
  padding: 0;
  background: transparent;
`;

const CharmImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CharmInfo = styled.div`
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 0;
`;

const CharmRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 0;
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

/* ───────────────────── 아이콘 ───────────────────── */
const ArrowLeftIcon = () => (
  <svg
    width="22"
    height="22"
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
const CapsuleDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.productId;
  const [product, setProduct] = useState(null);
  const [charms, setCharms] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [showIntro, setShowIntro] = useState(() => {
    // open 버튼으로 처음 진입할 때만 인트로 표시 (이후 재방문 시 스킵)
    if (sessionStorage.getItem("capsule_intro_shown")) {
      return false;
    }
    sessionStorage.setItem("capsule_intro_shown", "true");
    return true;
  });
  const [activeTab, setActiveTab] = useState("charm");

  useEffect(() => {
    if (!productId) {
      setLoadError("제품 정보가 없습니다. 컬렉션에서 제품을 다시 선택해주세요.");
      return;
    }

    let active = true;
    const loadCapsule = async () => {
      try {
        console.info(`[Capsule 1/2] 제품 상세를 조회합니다. GET /api/products/${productId}`);
        const [{ data: productData }, { data: charmData }] = await Promise.all([
          apiGet(`/products/${productId}`),
          apiGet("/charms"),
        ]);
        const allCharms = Array.isArray(charmData?.charms) ? charmData.charms : [];
        const charmDetails = await Promise.allSettled(
          allCharms.map(async (charm) => {
            const { data: detail } = await apiGet(`/charms/${charm.charmId}`);
            return detail;
          }),
        );
        if (!active) return;
        setProduct(productData);
        setCharms(charmDetails
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value)
          .filter((charm) => String(charm.product?.productId ?? charm.productId) === String(productId)));
        console.info("[Capsule 2/2] 기억의 캡슐과 Charm을 불러왔습니다.");
      } catch (error) {
        if (active) setLoadError(error.message || "기억의 캡슐을 불러오지 못했습니다.");
        console.error("[Capsule 오류] 기억의 캡슐 조회에 실패했습니다.", error);
      }
    };
    loadCapsule();
    return () => { active = false; };
  }, [productId]);

  useEffect(() => {
    if (!showIntro) return;
    const timer = setTimeout(() => setShowIntro(false), 2300);
    return () => clearTimeout(timer);
  }, [showIntro]);

  const photos = useMemo(() => {
    const journeyImages = charms
      .flatMap((charm) => Array.isArray(charm.images) ? charm.images : [])
      .filter(Boolean)
      .slice(0, 2);
    const selected = journeyImages.length > 0
      ? journeyImages
      : product?.productImage
        ? [product.productImage]
        : [];
    return selected.map((src, index) => ({
      src,
      rotation: index % 2 === 0 ? -5 : 3,
    }));
  }, [charms, product?.productImage]);

  return (
    <PageWrapper>
      {showIntro && (
        <IntroOverlay>
          <IntroIcon>&#9993;</IntroIcon>
          <IntroText>타임캡슐 편지가 도착했습니다</IntroText>
        </IntroOverlay>
      )}

      <TopBar>
        <BackButton
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <ArrowLeftIcon />
        </BackButton>
        <TopTitle>{activeTab === "letter" ? "Letter" : "charm"}</TopTitle>
      </TopBar>

      <ContentArea key={activeTab}>
        <DiaryCard>
          {/* 마스킹테이프 탭 */}
          <TapeTabs>
            <TapeTab
              $active={activeTab === "letter"}
              onClick={() => setActiveTab("letter")}
            >
              letter
            </TapeTab>
            <TapeTab
              $active={activeTab === "charm"}
              onClick={() => setActiveTab("charm")}
            >
              charm
            </TapeTab>
          </TapeTabs>

          {activeTab === "letter" ? (
            <>
              {/* 폴라로이드 사진 */}
              <PhotoCollage>
                {photos.map((photo, i) => (
                  <PolaroidFrame key={i} $rotation={photo.rotation}>
                    <TapeDecor />
                    <PolaroidImg src={photo.src} alt={`사진 ${i + 1}`} />
                  </PolaroidFrame>
                ))}
              </PhotoCollage>

              {/* 줄노트 편지 */}
              <LetterLines>
                <LetterLine>
                  <LetterTitle>{product?.nickname || product?.productName || "To my future self"}</LetterTitle>
                </LetterLine>
                <LetterLine>
                  <LetterDate>{formatDate(product?.purchaseDate)}</LetterDate>
                </LetterLine>
                <LetterBody>{loadError || product?.memoryCapsule || "기록된 기억이 없습니다."}</LetterBody>
                <EmptyLine />
                <LetterLineRight>
                  <LetterFrom>{product?.nickname ? `${product.nickname}의 기록` : "나로부터"}</LetterFrom>
                </LetterLineRight>
              </LetterLines>
            </>
          ) : (
            /* Charm 리스트 */
            <CharmScrollArea>
              {charms.map((charm) => (
                <CharmItem key={charm.charmId}>
                  <CharmImageContainer>
                    <CharmImage src={charm.aiImageUrl} alt="AI가 생성한 Charm" />
                  </CharmImageContainer>
                  <CharmInfo>
                    <CharmRow>
                      <CharmLabel>DATE</CharmLabel>
                      <CharmValue>{formatDate(charm.travelDate)}</CharmValue>
                    </CharmRow>
                    <CharmRow>
                      <CharmLabel>COUNTRY</CharmLabel>
                      <CharmValue>{charm.country || "-"}</CharmValue>
                    </CharmRow>
                    <CharmRow>
                      <CharmLabel>CITY</CharmLabel>
                      <CharmValue>{charm.city || "-"}</CharmValue>
                    </CharmRow>
                  </CharmInfo>
                </CharmItem>
              ))}
              {!loadError && charms.length === 0 && <LetterBody>생성된 Charm이 없습니다.</LetterBody>}
            </CharmScrollArea>
          )}
        </DiaryCard>
      </ContentArea>

      <DotIndicator>
        <Dot $active={activeTab === "letter"} />
        <Dot $active={activeTab === "charm"} />
      </DotIndicator>
    </PageWrapper>
  );
};

export default CapsuleDetail;
