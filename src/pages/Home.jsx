import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import charmBag from "../assets/charm-bag.svg";
import mcmLogo from "../assets/mcm-logo.svg";

const PRODUCTS = [
  { id: "MCM-000001", name: "Aren Shopper", registered: "2026.08.11" },
  { id: "MCM-000002", name: "Stark Backpack", registered: "2026.05.02" },
  { id: "MCM-000003", name: "Liz Shopper", registered: "2025.12.18" },
];

const CARE_HISTORY = [
  { date: "2026.08.11", status: "양호", store: "미방문" },
  { date: "2026.02.24", status: "매장 방문 필요", store: "MCM 강남점" },
  { date: "2025.08.31", status: "양호", store: "미방문" },
];

const Page = styled.div`
  width: min(100%, 480px);
  min-height: 100svh;
  margin: 0 auto;
  overflow-x: hidden;
  color: #090a0a;
  background: var(--color-ivory-paper);
  text-align: left;
`;

const RegisterBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 33px;
  padding: 0 22px;
  background: var(--color-soft-taupe);
`;

const RegisterButton = styled.button`
  border: 0;
  padding: 5px 0;
  color: #090a0a;
  background: transparent;
  font: 700 14px/1 var(--font-kopub);
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 3px;
  }
`;

const CardViewport = styled.div`
  width: 100%;
  margin-top: 73px;
  overflow-x: auto;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
  overscroll-behavior-inline: contain;
  touch-action: pan-y;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CardTrack = styled.div`
  display: flex;
  gap: 15px;
  width: max-content;
  padding-inline: max(16px, calc((100vw - min(84vw, 339px)) / 2));

  @media (min-width: 480px) {
    padding-inline: calc((480px - 339px) / 2);
  }
`;

const CardButton = styled.button`
  width: min(84vw, 339px);
  height: 183px;
  border: 0;
  padding: 0;
  border-radius: 15px;
  background: transparent;
  perspective: 1000px;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  cursor: pointer;
  user-select: none;
  opacity: ${({ $active }) => ($active ? 1 : 0.48)};
  transform: scale(${({ $active }) => ($active ? 1 : 0.92)});
  filter: ${({ $active }) => ($active ? "none" : "saturate(0.75)")};
  transition:
    opacity 240ms ease,
    transform 240ms ease,
    filter 240ms ease;

  ${({ $active }) =>
    $active &&
    `
      box-shadow: 0 10px 24px rgba(92, 64, 51, 0.14);
    `}

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 4px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  height: 6px;
  margin-top: 10px;
`;

const PaginationDot = styled.span`
  width: ${({ $active }) => ($active ? "18px" : "6px")};
  height: 6px;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? "var(--color-walnut)" : "var(--color-soft-taupe)"};
  transition:
    width 240ms ease,
    background-color 240ms ease;
`;

const CardInner = styled.span`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 480ms cubic-bezier(0.2, 0.7, 0.2, 1);
  transform: ${({ $flipped }) => ($flipped ? "rotateY(180deg)" : "none")};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const CardFace = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  border-radius: 15px;
  background: var(--color-soft-taupe);
  backface-visibility: hidden;
  overflow: hidden;
`;

const CardFront = styled(CardFace)`
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img`
  width: 82px;
  height: 82px;
  object-fit: contain;
`;

const CardBack = styled(CardFace)`
  flex-direction: column;
  align-items: center;
  gap: 13px;
  padding: 11px 14px;
  transform: rotateY(180deg);
  font-family: var(--font-english);
  text-align: center;
`;

const Brand = styled.span`
  font-size: 20px;
  line-height: 1;
`;

const Certificate = styled.span`
  font-size: clamp(14px, 4.2vw, 17px);
  line-height: 1;
  letter-spacing: -0.02em;
  white-space: nowrap;
`;

const ProductDetails = styled.span`
  display: grid;
  grid-template-columns: max-content max-content;
  column-gap: 12px;
  width: max-content;
  max-width: 100%;
  font-size: clamp(14px, 4.2vw, 17px);
  line-height: 1.15;
  text-align: left;

  & > span {
    white-space: nowrap;
  }
`;

const MainContent = styled.main`
  padding: 14px 30px 18px;

  @media (max-width: 360px) {
    padding-inline: 20px;
  }
`;

const Section = styled.section`
  border-top: 1px solid var(--color-walnut);
  padding-top: 31px;
`;

const CareHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-inline: 4px;
`;

const Title = styled.h2`
  margin: 0;
  color: #090a0a;
  font: 300 20px/1 var(--font-kopub);
`;

const Description = styled.p`
  margin-top: 8px;
  font: 300 14px/1.25 var(--font-kopub);
`;

const ToggleRow = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 5px;
  padding-top: 2px;
  font: 300 12px/1 var(--font-kopub);
  white-space: nowrap;
`;

const Switch = styled.button`
  position: relative;
  width: 35px;
  height: 15px;
  border: 0;
  border-radius: 30px;
  padding: 0;
  background: var(--color-walnut);
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    top: 1px;
    left: ${({ $checked }) => ($checked ? "1px" : "21px")};
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: ${({ $checked }) =>
      $checked ? "#fff" : "var(--color-soft-taupe)"};
    transition: left 180ms ease;
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 3px;
  }
`;

const CareTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.15fr 1fr;
  gap: 10px;
  margin-top: 20px;
  font: 300 14px/1.55 var(--font-kopub);
  text-align: center;

  @media (max-width: 360px) {
    gap: 5px;
    font-size: 12px;
  }
`;

const CareColumn = styled.div`
  min-width: 0;
`;

const ColumnTitle = styled.strong`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const CareValue = styled.span`
  display: block;
  white-space: nowrap;
`;

const CharmSection = styled.section`
  margin-top: 25px;
  border-top: 1px solid var(--color-walnut);
  padding-top: 20px;
`;

const CharmImage = styled.img`
  display: block;
  width: min(282px, 86vw);
  height: auto;
  margin: 10px auto 0;
`;

const Home = () => {
  const navigate = useNavigate();
  const [flippedCards, setFlippedCards] = useState(() => new Set());
  const [careAlert, setCareAlert] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const cardViewport = useRef(null);
  const dragState = useRef(null);
  const suppressCardClick = useRef(false);

  const handlePointerDown = (event) => {
    dragState.current = {
      x: event.clientX,
      y: event.clientY,
      scrollLeft: cardViewport.current?.scrollLeft ?? 0,
      moved: false,
    };
    suppressCardClick.current = false;
  };

  const handlePointerMove = (event) => {
    const drag = dragState.current;
    if (!drag || !cardViewport.current) return;

    const distanceX = event.clientX - drag.x;
    const distanceY = event.clientY - drag.y;
    if (Math.abs(distanceX) <= Math.abs(distanceY) || Math.abs(distanceX) < 12) {
      return;
    }

    if (!drag.moved) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    suppressCardClick.current = true;
    cardViewport.current.scrollLeft = drag.scrollLeft - distanceX;
  };

  const handlePointerEnd = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragState.current = null;
  };

  const handleCardScroll = (event) => {
    const firstCard = event.currentTarget.querySelector("button");
    if (!firstCard) return;

    const cardStep = firstCard.offsetWidth + 15;
    const nextIndex = Math.min(
      PRODUCTS.length - 1,
      Math.max(0, Math.round(event.currentTarget.scrollLeft / cardStep)),
    );
    setActiveCardIndex(nextIndex);
  };

  const handleCardClick = (productId) => {
    if (suppressCardClick.current) {
      suppressCardClick.current = false;
      return;
    }

    setFlippedCards((current) => {
      const next = new Set(current);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  return (
    <Page>
      <RegisterBar>
        <RegisterButton type="button" onClick={() => navigate("/mypage")}>
          제품 등록
        </RegisterButton>
      </RegisterBar>

      <CardViewport
        ref={cardViewport}
        aria-label="등록 제품 카드"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onScroll={handleCardScroll}
      >
        <CardTrack>
          {PRODUCTS.map((product, index) => {
            const isFlipped = flippedCards.has(product.id);

            return (
              <CardButton
                key={product.id}
                type="button"
                aria-label={`${product.name} 카드 ${isFlipped ? "앞면" : "상세 정보"} 보기`}
                aria-pressed={isFlipped}
                $active={activeCardIndex === index}
                onClick={() => handleCardClick(product.id)}
              >
                <CardInner $flipped={isFlipped}>
                  <CardFront>
                    <Logo src={mcmLogo} alt="MCM" draggable="false" />
                  </CardFront>
                  <CardBack>
                    <Brand>MCM</Brand>
                    <Certificate>CERTIFICATE OF AUTHENTICITY</Certificate>
                    <ProductDetails>
                      <span>Product</span>
                      <span>{product.name}</span>
                      <span>Product ID</span>
                      <span>{product.id}</span>
                      <span>Registered</span>
                      <span>{product.registered}</span>
                    </ProductDetails>
                  </CardBack>
                </CardInner>
              </CardButton>
            );
          })}
        </CardTrack>
      </CardViewport>

      <Pagination aria-hidden="true">
        {PRODUCTS.map((product, index) => (
          <PaginationDot key={product.id} $active={activeCardIndex === index} />
        ))}
      </Pagination>

      <MainContent>
        <Section>
          <CareHeader>
            <div>
              <Title>AI Care</Title>
              <Description>현재 좋은 상태를 유지하고 있어요.</Description>
            </div>
            <ToggleRow>
              <span>케어주기 알림</span>
              <span>On</span>
              <Switch
                type="button"
                role="switch"
                aria-checked={careAlert}
                aria-label="케어주기 알림"
                $checked={careAlert}
                onClick={() => setCareAlert((current) => !current)}
              />
              <span>Off</span>
            </ToggleRow>
          </CareHeader>

          <CareTable>
            <CareColumn>
              <ColumnTitle>케어 일자</ColumnTitle>
              {CARE_HISTORY.map((care) => (
                <CareValue key={care.date}>•&nbsp; {care.date}</CareValue>
              ))}
            </CareColumn>
            <CareColumn>
              <ColumnTitle>제품 상태</ColumnTitle>
              {CARE_HISTORY.map((care) => (
                <CareValue key={care.date}>{care.status}</CareValue>
              ))}
            </CareColumn>
            <CareColumn>
              <ColumnTitle>이용 매장</ColumnTitle>
              {CARE_HISTORY.map((care) => (
                <CareValue key={care.date}>{care.store}</CareValue>
              ))}
            </CareColumn>
          </CareTable>
        </Section>

        <CharmSection>
          <Title>나의 Charm</Title>
          <CharmImage src={charmBag} alt="참 장식이 달린 MCM 가방" />
        </CharmSection>
      </MainContent>
    </Page>
  );
};

export default Home;
