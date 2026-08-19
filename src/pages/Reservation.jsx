import { useMemo, useState } from "react";
import { FiArrowLeft, FiChevronDown, FiChevronLeft, FiChevronRight, FiSearch, FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const STORES = [
  { id: 1, name: "MCM 롯데백화점 강남점", address: "서울 강남구 도곡로 401" },
  { id: 2, name: "MCM 현대백화점 무역센터점", address: "서울 강남구 테헤란로 517" },
  { id: 3, name: "MCM 롯데백화점 본점", address: "서울 중구 남대문로 81" },
  { id: 4, name: "MCM 신세계백화점 센텀시티점", address: "부산 해운대구 센텀남대로 35" },
  { id: 5, name: "MCM 신세계백화점 대구점", address: "대구 동구 동부로 149" },
];

const REGISTERED_PRODUCTS = [
  { id: "MCM-000001", name: "Aren Shopper" },
  { id: "MCM-000002", name: "Stark Backpack" },
  { id: "MCM-000003", name: "Liz Shopper" },
];

const TIMES = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const Page = styled.main`
  width: min(100%, 480px); min-height: 100svh; margin: 0 auto; padding: 28px 36px 34px;
  color: #33251f; background: var(--color-ivory-paper); text-align: left;
  @media (max-width: 380px) { padding-inline: 24px; }
`;
const BackButton = styled.button`
  display: grid; width: 32px; height: 32px; margin: 0 0 12px -8px; padding: 0; place-items: center;
  border: 0; color: #33251f; background: transparent; font-size: 21px; cursor: pointer;
`;
const Intro = styled.div`display: flex; align-items: center; gap: 12px; font-size: 18px;`;
const Description = styled.p`
  margin: 8px 0 28px; padding-left: 12px; border-left: 1px solid #b9aa94; font-size: 11px; line-height: 1.35;
`;
const Section = styled.section`margin-top: 27px;`;
const Label = styled.h2`margin: 0 0 10px; color: #33251f; font: 400 13px/1 var(--font-english);`;
const StorePicker = styled.div`position: relative;`;
const SearchBox = styled.div`position: relative;`;
const SearchInput = styled.input`
  width: 100%; height: 40px; padding: 0 40px 0 14px; border: 1px solid #c7b79f;
  border-radius: ${({ $showList }) => ($showList ? "8px 8px 0 0" : "8px")};
  outline: none; color: #33251f; background: rgba(255,255,255,.18); font: 12px var(--font-kopub);
  &::placeholder { color: #a89b89; } &:focus { border-color: var(--color-walnut); }
`;
const SearchIcon = styled(FiSearch)`position: absolute; top: 50%; right: 14px; transform: translateY(-50%); pointer-events: none;`;
const StoreList = styled.div`
  max-height: 174px; padding: 5px; overflow-y: auto; border: 1px solid #c7b79f; border-top: 0; border-radius: 0 0 8px 8px;
  background: var(--color-ivory-paper); box-shadow: 0 8px 18px rgba(92,64,51,.08);
`;
const StoreButton = styled.button`
  display: block; width: 100%; padding: 8px 10px; border: 0; border-radius: 6px;
  color: ${({ $selected }) => ($selected ? "#fffaf2" : "#33251f")};
  background: ${({ $selected }) => ($selected ? "var(--color-walnut)" : "transparent")}; text-align: left; cursor: pointer;
  strong, span { display: block; } strong { font: 400 12px/1.2 var(--font-kopub); }
  span { margin-top: 3px; font: 300 9px/1.2 var(--font-kopub); opacity: .75; }
  &:hover { background: ${({ $selected }) => ($selected ? "var(--color-walnut)" : "rgba(182,168,146,.25)")}; }
`;
const SelectedStoreButton = styled(StoreButton)`
  position: relative; min-height: 52px; padding: 9px 38px 9px 12px; border: 1px solid #c7b79f;
  background: transparent; color: #090a0a;
  svg { position: absolute; top: 50%; right: 13px; transform: translateY(-50%); }
  &:hover { background: transparent; }
`;
const Empty = styled.p`padding: 16px 10px; color: #8e8172; font-size: 11px; text-align: center;`;
const MonthHeader = styled.div`
  display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 16px; font: 13px var(--font-english);
`;
const MonthButton = styled.button`
  display: grid; padding: 3px; place-items: center; border: 0; color: #33251f; background: transparent; cursor: pointer;
`;
const CalendarGrid = styled.div`display: grid; grid-template-columns: repeat(7,1fr); row-gap: 7px; text-align: center;`;
const Weekday = styled.span`margin-bottom: 3px; color: #b8ad9f; font: 9px var(--font-english);`;
const DayButton = styled.button`
  width: 31px; height: 31px; margin: auto; padding: 0; border: 0; border-radius: 50%;
  color: ${({ $selected }) => ($selected ? "#fff" : "#33251f")};
  background: ${({ $selected }) => ($selected ? "var(--color-walnut)" : "transparent")};
  font: 11px var(--font-english); cursor: pointer;
  &:hover { background: ${({ $selected }) => ($selected ? "var(--color-walnut)" : "rgba(182,168,146,.28)")}; }
`;
const TimeGrid = styled.div`display: grid; grid-template-columns: repeat(4,1fr); gap: 8px;`;
const TimeButton = styled.button`
  height: 32px; border: 1px solid ${({ disabled }) => (disabled ? "#d8d2c8" : "#b7a68e")}; border-radius: 7px;
  color: ${({ $selected, disabled }) => ($selected ? "#fff" : disabled ? "#c7c1b8" : "#33251f")};
  background: ${({ $selected }) => ($selected ? "var(--color-walnut)" : "transparent")};
  font: 11px var(--font-english); cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;
const SelectWrap = styled.div`position: relative;`;
const SelectButton = styled.button`
  display: flex; width: 100%; height: 40px; padding: 0 13px 0 14px; align-items: center; justify-content: space-between;
  border: 1px solid #b7a68e; border-radius: ${({ $open }) => ($open ? "8px 8px 0 0" : "8px")};
  color: ${({ $hasValue }) => ($hasValue ? "#33251f" : "#a89b89")}; background: rgba(255,255,255,.12); font: 12px var(--font-kopub); text-align: left; cursor: pointer;
  &:focus-visible { outline: 2px solid var(--color-walnut); outline-offset: 2px; }
  svg { flex: 0 0 auto; transition: transform 160ms ease; transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")}); }
`;
const OptionList = styled.div`
  position: absolute; z-index: 10; top: 100%; left: 0; width: 100%; padding: 5px;
  border: 1px solid #b7a68e; border-top: 0; border-radius: 0 0 8px 8px;
  background: var(--color-ivory-paper); box-shadow: 0 8px 18px rgba(92,64,51,.12);
`;
const OptionButton = styled.button`
  display: block; width: 100%; padding: 9px 10px; border: 0; border-radius: 5px;
  color: ${({ $selected }) => ($selected ? "#fffaf2" : "#33251f")};
  background: ${({ $selected }) => ($selected ? "var(--color-walnut)" : "transparent")};
  font: 12px var(--font-kopub); text-align: left; cursor: pointer;
  &:hover, &:focus-visible { color: ${({ $selected }) => ($selected ? "#fffaf2" : "#33251f")}; background: ${({ $selected }) => ($selected ? "var(--color-walnut)" : "rgba(182,168,146,.28)")}; outline: none; }
`;
const SubmitButton = styled.button`
  display: flex; width: 100%; height: 54px; margin-top: 38px; align-items: center; justify-content: center; gap: 10px;
  border: 0; border-radius: 28px; color: #fffaf2; background: var(--color-walnut); font: 400 17px var(--font-kopub); cursor: pointer;
  &:disabled { opacity: .45; cursor: not-allowed; }
`;

function Reservation() {
  const navigate = useNavigate();
  const today = new Date();
  const [query, setQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [careItem, setCareItem] = useState("");
  const [isCareItemOpen, setIsCareItemOpen] = useState(false);

  const filteredStores = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return [];
    return STORES.filter(({ name, address }) => `${name} ${address}`.toLowerCase().includes(keyword));
  }, [query]);

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    return [...Array(firstDay).fill(null), ...Array.from({ length: lastDate }, (_, index) => index + 1)];
  }, [visibleMonth]);

  const chooseDay = (day) => {
    setSelectedDate(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day));
    setSelectedTime("");
  };

  const isSelectedDay = (day) => selectedDate && selectedDate.getFullYear() === visibleMonth.getFullYear()
    && selectedDate.getMonth() === visibleMonth.getMonth() && selectedDate.getDate() === day;
  const canSubmit = selectedStore && selectedDate && selectedTime && careItem;
  const selectedProduct = REGISTERED_PRODUCTS.find((product) => product.id === careItem);

  const handleSubmit = () => {
    if (!canSubmit) return;
    const date = [
      selectedDate.getFullYear(),
      String(selectedDate.getMonth() + 1).padStart(2, "0"),
      String(selectedDate.getDate()).padStart(2, "0"),
    ].join(".");
    const weekday = selectedDate.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();

    navigate("/home", {
      state: {
        reservationComplete: {
          date: `${date} (${weekday})`,
          time: selectedTime,
          care: selectedProduct.name,
          store: selectedStore.name,
        },
      },
    });
  };

  return (
    <Page>
      <BackButton type="button" aria-label="뒤로 가기" onClick={() => navigate(-1)}><FiArrowLeft /></BackButton>
      <Intro><FiShoppingBag aria-hidden="true" /><span>매장 예약</span></Intro>
      <Description>소중한 제품을 오래 간직할 수 있도록,<br />가까운 MCM 매장에서 전문 케어를 받아보세요.</Description>

      <Section>
        <Label>STORE</Label>
        <StorePicker>
          {selectedStore && !isStoreOpen ? (
            <SelectedStoreButton type="button" $selected onClick={() => { setQuery(""); setIsStoreOpen(true); }} aria-label={`${selectedStore.name} 선택됨, 매장 다시 선택하기`}>
              <strong>{selectedStore.name}</strong><span>{selectedStore.address}</span><FiChevronDown aria-hidden="true" />
            </SelectedStoreButton>
          ) : (
            <>
              <SearchBox>
                <SearchInput $showList={Boolean(query.trim())} autoFocus={Boolean(selectedStore)} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="매장명 및 지역 검색" aria-label="매장명 및 지역 검색" />
                <SearchIcon aria-hidden="true" />
              </SearchBox>
              {query.trim() && (
                <StoreList role="listbox" aria-label="MCM 매장 검색 결과">
                  {filteredStores.length ? filteredStores.map((store) => (
                    <StoreButton key={store.id} type="button" role="option" aria-selected={selectedStore?.id === store.id} $selected={selectedStore?.id === store.id} onClick={() => { setSelectedStore(store); setQuery(""); setIsStoreOpen(false); }}>
                      <strong>{store.name}</strong><span>{store.address}</span>
                    </StoreButton>
                  )) : <Empty>검색 결과가 없습니다.</Empty>}
                </StoreList>
              )}
            </>
          )}
        </StorePicker>
      </Section>

      <Section>
        <Label>DATE</Label>
        <MonthHeader>
          <MonthButton type="button" aria-label="이전 달" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}><FiChevronLeft /></MonthButton>
          <span>{visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
          <MonthButton type="button" aria-label="다음 달" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}><FiChevronRight /></MonthButton>
        </MonthHeader>
        <CalendarGrid>
          {WEEKDAYS.map((day) => <Weekday key={day}>{day}</Weekday>)}
          {calendarDays.map((day, index) => day ? (
            <DayButton key={day} type="button" $selected={isSelectedDay(day)} onClick={() => chooseDay(day)}>{day}</DayButton>
          ) : <span key={`empty-${index}`} />)}
        </CalendarGrid>
      </Section>

      <Section>
        <Label>TIME</Label>
        <TimeGrid>{TIMES.map((time) => (
          <TimeButton key={time} type="button" $selected={selectedTime === time} onClick={() => setSelectedTime(time)}>{time}</TimeButton>
        ))}</TimeGrid>
      </Section>

      <Section>
        <Label>CARE ITEM</Label>
        <SelectWrap>
          <SelectButton type="button" $open={isCareItemOpen} $hasValue={Boolean(selectedProduct)} aria-haspopup="listbox" aria-expanded={isCareItemOpen} onClick={() => setIsCareItemOpen((open) => !open)}>
            <span>{selectedProduct ? `${selectedProduct.name} · ${selectedProduct.id}` : "등록 제품을 선택해 주세요"}</span>
            <FiChevronDown aria-hidden="true" />
          </SelectButton>
          {isCareItemOpen && (
            <OptionList role="listbox" aria-label="등록 제품">
              {REGISTERED_PRODUCTS.map((product) => (
                <OptionButton key={product.id} type="button" role="option" aria-selected={careItem === product.id} $selected={careItem === product.id} onClick={() => { setCareItem(product.id); setIsCareItemOpen(false); }}>
                  {product.name} · {product.id}
                </OptionButton>
              ))}
            </OptionList>
          )}
        </SelectWrap>
      </Section>

      <SubmitButton type="button" disabled={!canSubmit} onClick={handleSubmit}><FiShoppingBag aria-hidden="true" />매장 예약</SubmitButton>
    </Page>
  );
}

export default Reservation;
