import { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { TbSearch } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
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

// TODO: 백엔드 로그인 응답의 케어 알림 정보로 교체합니다.
const CARE_REMINDER = {
  shouldShow: true,
  intervalMonths: 3,
};

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

const ModalLayer = styled.div`
  position: fixed;
  z-index: 1100;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  pointer-events: none;
`;

const ReminderModal = styled.section`
  position: relative;
  width: min(322px, calc(100vw - 40px));
  min-height: 348px;
  border: 1px solid var(--color-walnut);
  border-radius: 30px;
  padding: 53px 25px 28px;
  background: var(--color-cream);
  box-shadow:
    -4px -4px 25px rgba(0, 0, 0, 0.15),
    4px 4px 25px rgba(0, 0, 0, 0.1);
  color: #090a0a;
  text-align: center;
  pointer-events: auto;

  @media (max-width: 360px) {
    min-height: 330px;
    padding-inline: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 19px;
  right: 23px;
  display: grid;
  width: 25px;
  height: 25px;
  place-items: center;
  border: 0;
  padding: 0;
  background: transparent;
  color: #090a0a;
  cursor: pointer;

  svg {
    width: 25px;
    height: 25px;
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 3px;
  }
`;

const ReminderTitle = styled.h2`
  margin: 0;
  color: #090a0a;
  font: 400 23px/1.2 var(--font-english);
`;

const ReminderMessage = styled.p`
  margin: 38px 0 0;
  font: 300 clamp(14px, 4vw, 16px) / 1.55 var(--font-kopub);
  word-break: keep-all;
`;

const CompleteModal = styled(ReminderModal)`
  width: min(340px, calc(100vw - 40px));
  min-height: 430px;
  padding: 56px 24px 28px;
`;

const CompleteMessage = styled.p`
  margin: 34px 0 22px;
  font: 300 14px/1.55 var(--font-kopub);
  word-break: keep-all;
`;

const ReservationDetails = styled.dl`
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 13px 0;
  margin: 0;
  padding: 20px 8px 0;
  border-top: 1px solid #a99884;
  color: #33251f;
  font: 300 13px/1.2 var(--font-kopub);
  text-align: left;

  dt, dd { margin: 0; }
  dt { border-right: 1px solid #a99884; }
  dd { padding-left: 13px; }
`;

const CompleteButton = styled.button`
  width: 100%; height: 41px; margin-top: 30px; border: 0; border-radius: 24px;
  color: #fff; background: var(--color-walnut); font: 300 15px var(--font-kopub); cursor: pointer;
`;

const CareBookingButton = styled.button`
  display: flex;
  width: 100%;
  height: 39px;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 54px;
  border: 0;
  border-radius: 30px;
  padding: 0 18px;
  background: var(--color-walnut);
  color: #fff;
  font: 300 clamp(15px, 4.5vw, 18px) / 1 var(--font-kopub);
  white-space: nowrap;
  cursor: pointer;

  svg {
    width: 25px;
    height: 25px;
    flex: 0 0 auto;
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 3px;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const reservation = state?.reservationComplete;
  const [flippedCards, setFlippedCards] = useState(() => new Set());
  const [careAlert, setCareAlert] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showCareReminder, setShowCareReminder] = useState(
    CARE_REMINDER.shouldShow && !reservation,
  );
  const [showReservationComplete, setShowReservationComplete] = useState(Boolean(reservation));
  const cardViewport = useRef(null);
  const dragState = useRef(null);
  const suppressCardClick = useRef(false);

  const closeReservationComplete = () => {
    setShowReservationComplete(false);
    navigate("/home", { replace: true, state: null });
  };

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

      {showReservationComplete && reservation && (
        <ModalLayer>
          <CompleteModal role="dialog" aria-modal="true" aria-labelledby="reservation-complete-title" aria-describedby="reservation-complete-description">
            <CloseButton type="button" aria-label="예약 완료 안내 닫기" onClick={closeReservationComplete}>
              <AiOutlineClose aria-hidden="true" />
            </CloseButton>
            <ReminderTitle id="reservation-complete-title">Reservation Complete</ReminderTitle>
            <CompleteMessage id="reservation-complete-description">
              케어 상담 예약이 완료되었어요.<br />예약한 일정에 제품과 함께<br />MCM 매장을 방문해주세요.
            </CompleteMessage>
            <ReservationDetails>
              <dt>DATE</dt><dd>{reservation.date}</dd>
              <dt>TIME</dt><dd>{reservation.time}</dd>
              <dt>CARE</dt><dd>{reservation.care}</dd>
              <dt>STORE</dt><dd>{reservation.store}</dd>
            </ReservationDetails>
            <CompleteButton type="button" onClick={closeReservationComplete}>확인 완료</CompleteButton>
          </CompleteModal>
        </ModalLayer>
      )}

      {showCareReminder && (
        <ModalLayer>
          <ReminderModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="care-reminder-title"
            aria-describedby="care-reminder-description"
          >
            <CloseButton
              type="button"
              aria-label="케어 알림 닫기"
              onClick={() => setShowCareReminder(false)}
            >
              <AiOutlineClose aria-hidden="true" />
            </CloseButton>

            <ReminderTitle id="care-reminder-title">Care Reminder</ReminderTitle>
            <ReminderMessage id="care-reminder-description">
              마지막 케어 이후 {CARE_REMINDER.intervalMonths}개월이 지났어요.
              <br />
              오래도록 좋은 상태를 유지할 수 있도록
              <br />
              지금 컨디션을 확인해보세요.
            </ReminderMessage>

            <CareBookingButton
              type="button"
              onClick={() => navigate("/care/upload")}
            >
              <TbSearch aria-hidden="true" />
              MCM 케어 상담 예약
            </CareBookingButton>
          </ReminderModal>
        </ModalLayer>
      )}
    </Page>
  );
};

export default Home;
