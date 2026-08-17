import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import DUMMY_COLLECTION from "../data/collection";
import lockImg from "../assets/lock.png";

/* ───────────────────── 애니메이션 ───────────────────── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ───────────────────── 스타일 ───────────────────── */
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  background: var(--color-ivory-paper);
  padding: 32px 20px 40px;
  max-width: 420px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--color-walnut);
  margin-bottom: 20px;

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const PageTitle = styled.h1`
  font-family: var(--font-kopub);
  font-size: var(--font-size-title);
  font-weight: 500;
  color: var(--color-walnut);
  margin: 0 0 24px;
  text-align: left;
`;

/* ── 카드 리스트 ── */
const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  margin-bottom: 28px;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  background: var(--color-cream);
  border: 1px solid var(--color-soft-taupe);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const CardImageWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 10px;
  background: var(--color-soft-taupe);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  flex-shrink: 0;
`;

const CardImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
  padding-right: 28px;
`;

const CardName = styled.span`
  font-family: var(--font-kopub);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-walnut);
  line-height: 1.4;
  text-align: center;
  word-break: keep-all;
`;

const CardLockImg = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
`;

const CardDateRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const CardDateText = styled.span`
  font-family: var(--font-kopub);
  font-size: 12px;
  font-weight: 300;
  color: var(--color-walnut);
`;

const CardOpenLabel = styled.span`
  font-family: var(--font-english);
  font-size: 11px;
  font-weight: 400;
  color: var(--color-soft-taupe);
  letter-spacing: 0.5px;
`;

/* ── DEMO ONLY - 해커톤 발표용, 추후 제거 예정 ── */
const DemoPreviewButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: transform 200ms ease;

  &:hover {
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 2px;
  }
`;

const OpenedState = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  animation: ${fadeIn} 0.4s ease;
`;

const DDayText = styled.span`
  font-family: var(--font-kopub);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-walnut);
`;

const OpenButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 18px;
  border-radius: 14px;
  background: var(--color-walnut);
  color: var(--color-ivory-paper);
  font-family: var(--font-english);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.5px;
  cursor: pointer;
  width: fit-content;
`;
/* ── END DEMO ONLY ── */

/* ── 하단 버튼 ── */
const RegisterButton = styled.button`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 26px;
  background: var(--color-walnut);
  color: #fff;
  font-family: var(--font-kopub);
  font-size: var(--font-size-button);
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 200ms ease;

  &:hover {
    opacity: 0.9;
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 3px;
  }
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

// DEMO ONLY - 해커톤 발표용, 추후 제거 예정
const ClockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--color-walnut)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/* ───────────────────── 컴포넌트 ───────────────────── */
const CollectionAll = () => {
  const navigate = useNavigate();

  // DEMO ONLY - 해커톤 발표용, 추후 제거 예정
  const [openedItems, setOpenedItems] = useState({});

  const handleDemoOpen = (itemId) => {
    setOpenedItems((prev) => ({ ...prev, [itemId]: true }));
  };
  // END DEMO ONLY

  return (
    <PageWrapper>
      {/* 뒤로가기 */}
      <BackButton
        type="button"
        onClick={() => navigate("/mypage")}
        aria-label="마이페이지로 돌아가기"
      >
        <ArrowLeftIcon />
      </BackButton>

      {/* 타이틀 */}
      <PageTitle>나의 컬렉션 ({DUMMY_COLLECTION.length})</PageTitle>

      {/* 카드 리스트 */}
      <CardList>
        {DUMMY_COLLECTION.map((item) => (
          <Card key={item.id}>
            {/* DEMO ONLY - 해커톤 발표용, 추후 제거 예정 */}
            {!openedItems[item.id] && (
              <DemoPreviewButton
                type="button"
                onClick={() => handleDemoOpen(item.id)}
                aria-label="미리보기 (데모)"
                title="시간 빨리감기 데모"
              >
                <ClockIcon />
              </DemoPreviewButton>
            )}
            {/* END DEMO ONLY */}

            <CardImageWrapper>
              <CardImage src={item.image} alt={item.name} />
            </CardImageWrapper>

            <CardInfo>
              <CardName>{item.name}</CardName>

              {openedItems[item.id] ? (
                // DEMO ONLY - 오픈된 상태 UI
                <OpenedState>
                  <DDayText>D-Day</DDayText>
                  <OpenButton onClick={() => navigate("/capsule-letter")}>
                    open
                  </OpenButton>
                </OpenedState>
              ) : (
                <>
                  <CardLockImg src={lockImg} alt="" aria-hidden="true" />
                  <CardDateRow>
                    <CardDateText>등록일 {item.startDate}</CardDateText>
                    <CardOpenLabel>OPEN ON {item.openDate}</CardOpenLabel>
                  </CardDateRow>
                </>
              )}
            </CardInfo>
          </Card>
        ))}
      </CardList>

      {/* 새로운 제품 등록 버튼 */}
      <RegisterButton
        type="button"
        onClick={() => navigate("/product-registration")}
      >
        + 새로운 제품 등록하기
      </RegisterButton>
    </PageWrapper>
  );
};

export default CollectionAll;
