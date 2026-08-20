import { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { TbSearch } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import charmBagBase from "../assets/bag1.png";
import mcmLogo from "../assets/mcm-logo.svg";
import CharmKeyring from "../components/CharmKeyring";
import { apiGet, apiPatch } from "../utils/api";
import { readStoredJson, STORAGE_KEYS } from "../utils/storage";

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
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? "var(--color-walnut)" : "rgba(182, 168, 146, 0.42)"};
  transition: background-color 240ms ease;
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
  position: absolute;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background:
    radial-gradient(ellipse at 76% 12%, rgba(255, 247, 235, 0.28) 0%, transparent 31%),
    radial-gradient(ellipse at 13% 92%, rgba(255, 244, 226, 0.32) 0%, transparent 36%),
    linear-gradient(135deg, #8b725e 0%, #a78d76 42%, #c4ad96 68%, #907661 100%);
  box-shadow: inset 0 0 34px rgba(72, 48, 35, 0.14);

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: -35%;
    pointer-events: none;
  }

  &::before {
    background: linear-gradient(116deg, transparent 32%, rgba(255, 248, 238, 0.2) 47%, transparent 61%);
    transform: rotate(-6deg);
    filter: blur(8px);
  }

  &::after {
    background: linear-gradient(25deg, rgba(62, 42, 31, 0.18), transparent 44%);
    filter: blur(12px);
  }
`;

const Logo = styled.img`
  position: relative;
  z-index: 1;
  width: 94px;
  height: 94px;
  object-fit: contain;
  filter: brightness(0) invert(1);
`;

const CardTagline = styled.span`
  position: relative;
  z-index: 1;
  margin-top: 0;
  color: rgba(255, 255, 255, 0.92);
  font-family: Arial, sans-serif;
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 3px;
  white-space: nowrap;
`;

const CardBack = styled(CardFace)`
  position: absolute;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 11px;
  padding: 14px 18px;
  transform: rotateY(180deg);
  font-family: var(--font-english);
  text-align: center;
  color: rgba(255, 255, 255, 0.94);
  background:
    radial-gradient(ellipse at 76% 12%, rgba(255, 247, 235, 0.28) 0%, transparent 31%),
    radial-gradient(ellipse at 13% 92%, rgba(255, 244, 226, 0.32) 0%, transparent 36%),
    linear-gradient(135deg, #8b725e 0%, #a78d76 42%, #c4ad96 68%, #907661 100%);
  box-shadow: inset 0 0 34px rgba(72, 48, 35, 0.14);

  &::before {
    content: "";
    position: absolute;
    inset: -35%;
    background: linear-gradient(116deg, transparent 32%, rgba(255, 248, 238, 0.2) 47%, transparent 61%);
    transform: rotate(-6deg);
    filter: blur(8px);
    pointer-events: none;
  }

  & > span {
    position: relative;
    z-index: 1;
  }
`;

const Brand = styled.span`
  font-size: 22px;
  line-height: 1;
  letter-spacing: 1px;
  text-shadow: 0 1px 8px rgba(64, 42, 31, 0.2);
`;

const Certificate = styled.span`
  font-size: clamp(12px, 3.7vw, 15px);
  line-height: 1;
  letter-spacing: 0.08em;
  text-align: center;
  white-space: normal;
`;

const ProductDetails = styled.span`
  display: grid;
  grid-template-columns: minmax(0, auto) minmax(0, 1fr);
  column-gap: 12px;
  width: fit-content;
  max-width: 100%;
  padding: 9px 13px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 10px;
  background: rgba(76, 50, 37, 0.12);
  font-size: clamp(12px, 3.7vw, 15px);
  line-height: 1.25;
  text-align: left;

  & > span {
    min-width: 0;
    overflow-wrap: anywhere;
    white-space: normal;
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

const ToggleRow = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 5px;
  padding-top: 2px;
  font: 300 12px/1 var(--font-kopub);
  flex-wrap: wrap;
  justify-content: flex-end;
  text-align: right;
  white-space: normal;
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
  overflow-wrap: anywhere;
  white-space: normal;
`;

const CharmSection = styled.section`
  margin-top: 25px;
  border-top: 1px solid var(--color-walnut);
  padding-top: 20px;
`;

const HomeCharmStage = styled.div`
  position: relative;
  width: min(282px, 86vw);
  aspect-ratio: 198 / 144;
  margin: 10px auto 0;
`;

const HomeBagImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const HomePlacedCharm = styled.span`
  position: absolute;
  z-index: 2;
  top: ${({ $y }) => $y}%;
  left: ${({ $x }) => $x}%;
  width: ${({ $size }) => ($size / 330) * 100}%;
  aspect-ratio: 1;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.16));
  transform: translate(-50%, -50%) rotate(${({ $rotation }) => $rotation}deg);

  > span {
    width: 100%;
    height: 100%;
  }
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
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [homeCharms, setHomeCharms] = useState([]);
  const [careAlert, setCareAlert] = useState(() => {
    try {
      return localStorage.getItem("care_alert_enabled") !== "false";
    } catch {
      return true;
    }
  });
  const [careHistory, setCareHistory] = useState([]);
  const [careHistoryLoaded, setCareHistoryLoaded] = useState(false);
  const [careNotifications, setCareNotifications] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showCareReminder, setShowCareReminder] = useState(false);
  const [showReservationComplete, setShowReservationComplete] = useState(Boolean(reservation));
  const cardViewport = useRef(null);
  const dragState = useRef(null);
  const suppressCardClick = useRef(false);

  useEffect(() => {
    let active = true;
    const loadHomeCharms = async () => {
      try {
        console.info("[Home Charm] 생성 Charm 목록을 조회합니다. GET /api/charms");
        const { data } = await apiGet("/charms");
        const charms = Array.isArray(data?.charms) ? data.charms : [];
        const savedLayout = readStoredJson(STORAGE_KEYS.charmLayout);
        if (!active) return;
        setHomeCharms(charms.filter((charm) => charm?.charmId != null && charm?.aiImageUrl).map((charm, index) => {
          const key = `${charm.charmId}-${index}`;
          const hasServerPosition = Number.isFinite(charm.positionX)
            && Number.isFinite(charm.positionY)
            && Number.isFinite(charm.scale)
            && charm.scale > 0;
          return {
            key,
            imageUrl: charm.aiImageUrl,
            layout: hasServerPosition
              ? {
                  x: charm.positionX * 100,
                  y: charm.positionY * 100,
                  rotation: Number.isFinite(charm.rotation) ? charm.rotation : 0,
                  size: charm.scale * 330,
                }
              : savedLayout[key] ?? {
                  x: 28 + (index % 4) * 15,
                  y: 43 + (index % 2) * 19,
                  rotation: index % 2 === 0 ? -6 : 6,
                  size: 54,
                },
          };
        }));
        console.info(`[Home Charm] 생성 Charm ${charms.length}개를 가방에 반영했습니다.`);
      } catch (charmError) {
        console.error("[Home Charm 오류] Charm 목록 조회에 실패했습니다.", charmError);
      }
    };
    loadHomeCharms();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        console.info("[Product 3/3] 등록 제품 목록을 조회합니다. GET /api/products");
        const { data } = await apiGet("/products");
        const list = Array.isArray(data?.products) ? data.products : [];
        if (!active) return;
        setProducts(list.map((product) => ({
          id: product.productId,
          name: product.productName,
          image: product.productImage,
        })));
        setActiveCardIndex(0);
        console.info(`[Product 3/3] 등록 제품 ${list.length}개를 불러왔습니다.`);
      } catch (productError) {
        console.error("[Product 오류] 등록 제품 목록 조회에 실패했습니다.", productError);
        if (active) setProducts([]);
      }
    };
    loadProducts();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setCareHistoryLoaded(false);
    const loadCareHistory = async () => {
      try {
        console.info("[Home Care] 케어 이력을 조회합니다. GET /api/care/reports");
        const { data } = await apiGet("/care/reports");
        const reports = Array.isArray(data?.reports) ? data.reports : [];
        if (!active) return;
        const reservationStores = readStoredJson(STORAGE_KEYS.reservationStores);
        const reservationDates = readStoredJson(STORAGE_KEYS.reservationDates);
      setCareHistory(reports.map((report) => ({
        id: report.careId,
        productId: report.product?.productId ?? null,
        date: reservation?.careId === report.careId
            ? reservation.date.replace(/\s*\([^)]*\)$/, "")
            : reservationDates[String(report.careId)]
              ? new Date(`${reservationDates[String(report.careId)]}T00:00:00`).toLocaleDateString("ko-KR").replace(/\. /g, ".").replace(/\.$/, "")
              : "-",
          product: report.product?.productName ?? "-",
          store: reservation?.careId === report.careId
            ? reservation.store
            : reservationStores[String(report.careId)] ?? "미예약",
        })));
        console.info(`[Home Care] 케어 이력 ${reports.length}건을 확인했습니다.`);
      } catch (historyError) {
        console.error("[Home Care 오류] 케어 이력 조회에 실패했습니다.", historyError);
      } finally {
        if (active) setCareHistoryLoaded(true);
      }
    };
    loadCareHistory();
    return () => { active = false; };
  }, [reservation]);

  useEffect(() => {
    if (!careHistoryLoaded) return;
    if (careHistory.length === 0) {
      setCareNotifications([]);
      setActiveNotification(null);
      setShowCareReminder(false);
      return;
    }

    let active = true;
    const loadNotifications = async () => {
      try {
        console.info("[Home Care] 케어 알림을 조회합니다. GET /api/care/notifications");
        const { data } = await apiGet("/care/notifications");
        const notifications = Array.isArray(data?.notifications) ? data.notifications : [];
        if (!active) return;
        setCareNotifications(notifications);
        const unread = notifications.find((notification) => !notification.isRead);
        if (careAlert && unread && !reservation) {
          setActiveNotification(unread);
          setShowCareReminder(true);
        }
        console.info(`[Home Care] 읽지 않은 케어 알림 ${notifications.filter((item) => !item.isRead).length}건을 확인했습니다.`);
      } catch (notificationError) {
        console.error("[Home Care 오류] 케어 알림 조회에 실패했습니다.", notificationError);
      }
    };
    loadNotifications();
    return () => { active = false; };
  }, [careAlert, careHistory, careHistoryLoaded, reservation]);

  const handleCareAlertToggle = () => {
    setCareAlert((current) => {
      const next = !current;
      try {
        localStorage.setItem("care_alert_enabled", String(next));
      } catch {
        // 브라우저 저장소를 사용할 수 없어도 현재 화면의 토글은 동작합니다.
      }
      if (!next) {
        setShowCareReminder(false);
      } else {
        const unread = careHistory.length > 0
          ? careNotifications.find((notification) => !notification.isRead)
          : null;
        setActiveNotification(unread ?? null);
        setShowCareReminder(Boolean(unread));
      }
      return next;
    });
  };

  const readActiveNotification = async () => {
    if (!activeNotification) {
      setShowCareReminder(false);
      return;
    }
    try {
      await apiPatch(`/care/notifications/${activeNotification.notificationId}/read`);
      setCareNotifications((current) => current.map((notification) =>
        notification.notificationId === activeNotification.notificationId
          ? { ...notification, isRead: true }
          : notification,
      ));
      console.info(`[Home Care] 알림 ${activeNotification.notificationId}을 읽음 처리했습니다.`);
    } catch (readError) {
      console.error("[Home Care 오류] 알림 읽음 처리에 실패했습니다.", readError);
    } finally {
      setShowCareReminder(false);
      setActiveNotification(null);
    }
  };

  const openCareUpload = async () => {
    await readActiveNotification();
    navigate("/care/upload");
  };

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
      Math.max(0, products.length - 1),
      Math.max(0, Math.round(event.currentTarget.scrollLeft / cardStep)),
    );
    setActiveCardIndex(nextIndex);
  };

  const handleCardClick = async (productId) => {
    if (suppressCardClick.current) {
      suppressCardClick.current = false;
      return;
    }

    const willOpen = !flippedCards.has(productId);
    setFlippedCards((current) => {
      const next = new Set(current);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

    if (willOpen && !productDetails[productId]) {
      try {
        console.info(`[Product 상세] 제품 ${productId} 정보를 조회합니다. GET /api/products/${productId}`);
        const { data } = await apiGet(`/products/${productId}`);
        setProductDetails((current) => ({ ...current, [productId]: data }));
      } catch (detailError) {
        console.error(`[Product 오류] 제품 ${productId} 상세 조회에 실패했습니다.`, detailError);
      }
    }
  };

  const reminderReservationDate = activeNotification
    ? [...careHistory].reverse().find(
        (care) =>
          String(care.productId) === String(activeNotification.productId)
          && care.date !== "-",
      )?.date ?? null
    : null;

  return (
    <Page>
      <RegisterBar>
        <RegisterButton type="button" onClick={() => navigate("/product-registration")}>
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
          {products.map((product, index) => {
            const isFlipped = flippedCards.has(product.id);
            const detail = productDetails[product.id];

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
                    <CardTagline>ARCHIVE YOUR JOURNEY</CardTagline>
                  </CardFront>
                  <CardBack>
                    <Brand>MCM</Brand>
                    <Certificate>CERTIFICATE OF AUTHENTICITY</Certificate>
                    <ProductDetails>
                      <span>Product</span>
                      <span>{detail?.productName ?? product.name}</span>
                      <span>Product ID</span>
                      <span>{detail?.productCode ?? product.id}</span>
                      <span>Purchase Date</span>
                      <span>{detail?.purchaseDate ? new Date(`${detail.purchaseDate}T00:00:00`).toLocaleDateString("ko-KR").replace(/\. /g, ".").replace(/\.$/, "") : "-"}</span>
                    </ProductDetails>
                  </CardBack>
                </CardInner>
              </CardButton>
            );
          })}
        </CardTrack>
      </CardViewport>

      <Pagination aria-hidden="true">
        {products.map((product, index) => (
          <PaginationDot key={product.id} $active={activeCardIndex === index} />
        ))}
      </Pagination>

      <MainContent>
        <Section>
          <CareHeader>
            <div>
              <Title>AI Care</Title>
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
                onClick={handleCareAlertToggle}
              />
              <span>Off</span>
            </ToggleRow>
          </CareHeader>

          <CareTable>
            <CareColumn>
              <ColumnTitle>케어 일자</ColumnTitle>
              {careHistory.map((care) => (
                <CareValue key={care.id}>•&nbsp; {care.date}</CareValue>
              ))}
            </CareColumn>
            <CareColumn>
              <ColumnTitle>케어 제품</ColumnTitle>
              {careHistory.map((care) => (
                <CareValue key={care.id}>{care.product}</CareValue>
              ))}
            </CareColumn>
            <CareColumn>
              <ColumnTitle>이용 매장</ColumnTitle>
              {careHistory.map((care) => (
                <CareValue key={care.id}>{care.store}</CareValue>
              ))}
            </CareColumn>
          </CareTable>
        </Section>

        <CharmSection>
          <Title>나의 Charm</Title>
          <HomeCharmStage aria-label="내가 꾸민 MCM 가방">
            <HomeBagImage src={charmBagBase} alt="MCM 가방" />
            {homeCharms.map((charm, index) => (
              <HomePlacedCharm
                key={charm.key}
                $x={charm.layout.x}
                $y={charm.layout.y}
                $size={charm.layout.size}
                $rotation={charm.layout.rotation}
              >
                <CharmKeyring
                  src={charm.imageUrl}
                  alt={`생성한 Charm ${index + 1}`}
                />
              </HomePlacedCharm>
            ))}
          </HomeCharmStage>
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
              onClick={readActiveNotification}
            >
              <AiOutlineClose aria-hidden="true" />
            </CloseButton>

            <ReminderTitle id="care-reminder-title">Care Reminder</ReminderTitle>
            <ReminderMessage id="care-reminder-description">
              제품 케어 예정일이 다가왔어요.
              <br />
              {reminderReservationDate && (
                <>
                  예약일은 {reminderReservationDate}이에요.
                  <br />
                </>
              )}
              오래도록 좋은 상태를 유지할 수 있도록
              <br />
              지금 컨디션을 확인해보세요.
            </ReminderMessage>

            <CareBookingButton
              type="button"
              onClick={openCareUpload}
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
