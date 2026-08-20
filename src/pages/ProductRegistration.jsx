import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import qrcodeImg from "../assets/qrcode.png";

/* ───────────────────── 스타일 ───────────────────── */
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  background: var(--color-ivory-paper);
  padding: 32px 20px calc(130px + env(safe-area-inset-bottom));
  max-width: 420px;
  margin: 0 auto;
  height: 100svh;
  box-sizing: border-box;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
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

/* ── 상단 헤더 (마이페이지와 동일 구조) ── */
const PageTitle = styled.h1`
  font-family: var(--font-english);
  font-size: var(--font-size-title);
  font-weight: 400;
  color: var(--color-walnut);
  margin: 0 0 12px;
  text-align: left;
`;

const SubtitleRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 10px;
  margin-bottom: 28px;
  padding-left: 2px;
`;

const AccentBar = styled.div`
  width: 2.5px;
  background: var(--color-soft-taupe);
  border-radius: 2px;
  flex-shrink: 0;
`;

const SubtitleText = styled.p`
  font-family: var(--font-kopub);
  font-size: var(--font-size-body);
  font-weight: 300;
  color: var(--color-walnut);
  margin: 0;
  line-height: 1.7;
  text-align: left;
`;

/* ── 스캔 카드 ── */
const ScanCard = styled.div`
  width: 100%;
  border: 2px dashed var(--color-soft-taupe);
  border-radius: 16px;
  padding: 28px 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  background: var(--color-cream);
`;

const ScanIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const ScanTitle = styled.span`
  font-family: var(--font-kopub);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-walnut);
`;

const ScanDescription = styled.p`
  font-family: var(--font-kopub);
  font-size: 12px;
  font-weight: 300;
  color: var(--color-soft-taupe);
  text-align: center;
  line-height: 1.6;
  margin: 0;
`;

const ScanButton = styled.button`
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 21px;
  background: var(--color-walnut);
  color: var(--color-cream);
  font-family: var(--font-kopub);
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  margin-top: 4px;
  transition: opacity 200ms ease;

  &:hover {
    opacity: 0.9;
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 3px;
  }
`;

const ScanSuccess = styled.span`
  font-family: var(--font-kopub);
  font-size: 12px;
  font-weight: 400;
  color: var(--color-walnut);
  margin-top: 4px;
`;

/* ── 제품 기본 정보 ── */
const ProductFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
`;

const ProductField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProductLabel = styled.label`
  font-family: var(--font-english);
  font-size: 14px;
  font-weight: 400;
  color: var(--color-walnut);
  text-align: left;
`;

const ProductInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--color-soft-taupe);
  border-radius: 8px;
  background: transparent;
  color: var(--color-walnut);
  font-family: var(--font-kopub);
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: var(--color-walnut);
  }
`;

const DateSelects = styled.div`
  display: grid;
  grid-template-columns: 1.35fr 1fr 1fr;
  gap: 8px;
`;

const DateDropdown = styled.div`
  position: relative;
  min-width: 0;
`;

const DateDropdownButton = styled.button`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid var(--color-soft-taupe);
  border-radius: 8px;
  background: var(--color-ivory-paper);
  color: var(--color-walnut);
  font-family: var(--font-kopub);
  font-size: 14px;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;

  &:focus {
    border-color: var(--color-walnut);
  }
`;

const DropdownArrow = styled.span`
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: ${({ $open }) => $open ? "rotate(225deg) translate(-1px, -1px)" : "rotate(45deg) translate(-1px, -1px)"};
`;

const DateDropdownMenu = styled.div`
  position: absolute;
  z-index: 20;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  max-height: 190px;
  overflow-y: auto;
  padding: 6px;
  border: 1px solid var(--color-soft-taupe);
  border-radius: 14px;
  background: var(--color-ivory-paper);
  box-shadow: 0 8px 20px rgba(77, 49, 37, 0.14);
  scrollbar-width: thin;
  scrollbar-color: var(--color-soft-taupe) transparent;
`;

const DateDropdownOption = styled.button`
  width: 100%;
  min-height: 34px;
  padding: 7px 9px;
  border: 0;
  border-radius: 9px;
  background: ${({ $selected }) => $selected ? "var(--color-walnut)" : "transparent"};
  color: ${({ $selected }) => $selected ? "var(--color-cream)" : "var(--color-walnut)"};
  font-family: var(--font-kopub);
  font-size: 14px;
  text-align: left;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: ${({ $selected }) => $selected ? "var(--color-walnut)" : "rgba(100, 68, 52, 0.1)"};
    outline: none;
  }
`;

/* ── 기억의 캡슐 활성화 섹션 ── */
const LINE_HEIGHT = 32;
const LINES_COUNT = 5;

const SectionTitle = styled.h2`
  font-family: var(--font-kopub);
  font-size: 15px;
  font-weight: 500;
  color: var(--color-walnut);
  margin: 0 0 14px;
  text-align: left;
`;

const FormCard = styled.div`
  width: 100%;
  background: var(--color-cream);
  border: 1px solid var(--color-soft-taupe);
  border-radius: 16px;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 28px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldLabel = styled.label`
  font-family: var(--font-kopub);
  font-size: 12px;
  font-weight: 300;
  color: var(--color-soft-taupe);
  text-align: left;
  height: ${LINE_HEIGHT}px;
  display: flex;
  align-items: center;
`;

const FieldInput = styled.input`
  width: 100%;
  height: ${LINE_HEIGHT}px;
  padding: 0;
  border: none;
  border-bottom: 1px solid var(--color-soft-taupe);
  background: transparent;
  font-family: var(--font-kopub);
  font-size: 14px;
  font-weight: 400;
  color: var(--color-walnut);
  outline: none;
  text-align: left;
  line-height: ${LINE_HEIGHT}px;
  transition: border-color 200ms ease;

  &::placeholder {
    color: var(--color-soft-taupe);
  }

  &:focus {
    border-bottom-color: var(--color-walnut);
  }
`;

/* 줄노트 스타일 textarea */

const TextareaWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const NotebookLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
`;

const NotebookLine = styled.div`
  height: ${LINE_HEIGHT}px;
  border-bottom: 1px solid var(--color-soft-taupe);
`;

const FieldTextarea = styled.textarea`
  width: 100%;
  height: ${LINE_HEIGHT * LINES_COUNT}px;
  padding: 0;
  border: none;
  background: transparent;
  font-family: var(--font-kopub);
  font-size: 14px;
  font-weight: 400;
  color: var(--color-walnut);
  outline: none;
  resize: none;
  line-height: ${LINE_HEIGHT}px;
  text-align: left;
  position: relative;
  z-index: 1;

  &::placeholder {
    color: var(--color-soft-taupe);
  }
`;

const ErrorText = styled.span`
  font-family: var(--font-kopub);
  font-size: 12px;
  color: #e53e3e;
  margin-top: 2px;
  text-align: left;
`;

/* ── 하단 버튼 ── */
const SubmitButton = styled.button`
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
  flex-shrink: 0;
  transition: opacity 200ms ease;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.8;
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

const PurchaseDateDropdown = ({ label, value, options, open, onToggle, onSelect, ariaLabel }) => (
  <DateDropdown>
    <DateDropdownButton type="button" onClick={onToggle} aria-label={ariaLabel} aria-expanded={open}>
      <span>{value || label}</span>
      <DropdownArrow $open={open} aria-hidden="true" />
    </DateDropdownButton>
    {open && (
      <DateDropdownMenu role="listbox" aria-label={ariaLabel}>
        {options.map((option) => (
          <DateDropdownOption
            key={option}
            type="button"
            role="option"
            aria-selected={String(value) === String(option)}
            $selected={String(value) === String(option)}
            onClick={() => onSelect(String(option))}
          >
            {option}
          </DateDropdownOption>
        ))}
      </DateDropdownMenu>
    )}
  </DateDropdown>
);

/* ───────────────────── 컴포넌트 ───────────────────── */
const ProductRegistration = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, index) => currentYear - index);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const days = Array.from({ length: 31 }, (_, index) => index + 1);

  const [scanned, setScanned] = useState(false);
  const [openDateDropdown, setOpenDateDropdown] = useState("");
  const [form, setForm] = useState({
    productName: "",
    productCode: "",
    purchaseYear: "",
    purchaseMonth: "",
    purchaseDay: "",
    nickname: "",
    startDate: "",
    memory: "",
  });
  const [errors, setErrors] = useState({});

  const handleScan = () => {
    setScanned(true);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDateSelect = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setOpenDateDropdown("");
    if (errors.purchaseDate) {
      setErrors((prev) => ({ ...prev, purchaseDate: "" }));
    }
  };

  const validate = () => {
    const next = {};
    let valid = true;

    if (!form.productName.trim()) {
      next.productName = "제품명을 입력해주세요";
      valid = false;
    }

    if (!form.productCode.trim()) {
      next.productCode = "제품 코드를 입력해주세요";
      valid = false;
    }

    if (!form.purchaseYear || !form.purchaseMonth || !form.purchaseDay) {
      next.purchaseDate = "구매일을 선택해주세요";
      valid = false;
    }

    if (!form.nickname.trim()) {
      next.nickname = "가방 별칭을 입력해주세요";
      valid = false;
    }

    if (!form.startDate.trim()) {
      next.startDate = "여정 시작일을 입력해주세요";
      valid = false;
    }

    if (!form.memory.trim()) {
      next.memory = "첫 번째 기억을 작성해주세요";
      valid = false;
    }

    setErrors(next);
    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // 오픈 예정일 계산 (여정 시작일 + 10년)
    const dateParts = form.startDate.replace(/[-./]/g, ".").split(".");
    let openDate = form.startDate;
    if (dateParts.length >= 3) {
      const year = parseInt(dateParts[0], 10) + 10;
      openDate = `${year}.${dateParts[1]}.${dateParts[2]}`;
    }

    // 마이페이지 컬렉션에 추가 (localStorage 임시 저장)
    const newItem = {
      id: Date.now(),
      productName: form.productName,
      productCode: form.productCode,
      purchaseDate: `${form.purchaseYear}-${String(form.purchaseMonth).padStart(2, "0")}-${String(form.purchaseDay).padStart(2, "0")}`,
      name: form.nickname || "새로 등록한 제품",
      startDate: form.startDate,
      openDate,
      memory: form.memory,
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("user_collection") || "[]"
      );
      existing.push(newItem);
      localStorage.setItem("user_collection", JSON.stringify(existing));
    } catch {
      // localStorage 실패 시 무시
    }

    navigate("/mypage");
  };

  return (
    <PageWrapper>
      {/* 뒤로가기 */}
      <BackButton
        type="button"
        onClick={() => navigate(-1)}
        aria-label="뒤로 가기"
      >
        <ArrowLeftIcon />
      </BackButton>

      {/* 타이틀 — 마이페이지와 동일 구조 */}
      <PageTitle>Product Registration</PageTitle>

      <SubtitleRow>
        <AccentBar />
        <SubtitleText>
          이 기억은 10년 뒤에 다시 열어볼 수 있어요.
          <br />
          오늘의 순간을 미래의 나에게 남겨보세요.
        </SubtitleText>
      </SubtitleRow>

      {/* 디지털 정품 태그 스캔 */}
      <ScanCard>
        <ScanIcon src={qrcodeImg} alt="QR 코드" />
        <ScanTitle>디지털 정품 태그 태깅</ScanTitle>
        <ScanDescription>
          가방 내부의 MCM 로고 탭에 스마트폰을 가까이 대거나,
          <br />
          동봉된 개별 워런티 카드의 QR 코드를 인식해 주세요.
        </ScanDescription>
        {scanned ? (
          <ScanSuccess>스캔 완료</ScanSuccess>
        ) : (
          <ScanButton type="button" onClick={handleScan}>
            스캔 시작
          </ScanButton>
        )}
      </ScanCard>

      <ProductFields>
        <ProductField>
          <ProductLabel htmlFor="pr-product-name">PRODUCT NAME</ProductLabel>
          <ProductInput
            id="pr-product-name"
            type="text"
            value={form.productName}
            onChange={handleChange("productName")}
          />
          {errors.productName && <ErrorText role="alert">{errors.productName}</ErrorText>}
        </ProductField>

        <ProductField>
          <ProductLabel htmlFor="pr-product-code">PRODUCT CODE</ProductLabel>
          <ProductInput
            id="pr-product-code"
            type="text"
            value={form.productCode}
            onChange={handleChange("productCode")}
          />
          {errors.productCode && <ErrorText role="alert">{errors.productCode}</ErrorText>}
        </ProductField>

        <ProductField>
          <ProductLabel htmlFor="pr-purchase-year">PURCHASE DATE</ProductLabel>
          <DateSelects>
            <PurchaseDateDropdown
              label="Year"
              value={form.purchaseYear}
              options={years}
              open={openDateDropdown === "year"}
              onToggle={() => setOpenDateDropdown((current) => current === "year" ? "" : "year")}
              onSelect={(value) => handleDateSelect("purchaseYear", value)}
              ariaLabel="구매 연도"
            />
            <PurchaseDateDropdown
              label="Month"
              value={form.purchaseMonth}
              options={months}
              open={openDateDropdown === "month"}
              onToggle={() => setOpenDateDropdown((current) => current === "month" ? "" : "month")}
              onSelect={(value) => handleDateSelect("purchaseMonth", value)}
              ariaLabel="구매 월"
            />
            <PurchaseDateDropdown
              label="Date"
              value={form.purchaseDay}
              options={days}
              open={openDateDropdown === "date"}
              onToggle={() => setOpenDateDropdown((current) => current === "date" ? "" : "date")}
              onSelect={(value) => handleDateSelect("purchaseDay", value)}
              ariaLabel="구매 일"
            />
          </DateSelects>
          {errors.purchaseDate && <ErrorText role="alert">{errors.purchaseDate}</ErrorText>}
        </ProductField>
      </ProductFields>

      {/* 기억의 캡슐 활성화 */}
      <SectionTitle>기억의 캡슐 활성화</SectionTitle>

      <FormCard>
        <FieldGroup>
          <FieldLabel htmlFor="pr-nickname">가방 별칭</FieldLabel>
          <FieldInput
            id="pr-nickname"
            type="text"
            placeholder="Mcm Small Drawstring Backpack"
            value={form.nickname}
            onChange={handleChange("nickname")}
          />
          {errors.nickname && (
            <ErrorText role="alert">{errors.nickname}</ErrorText>
          )}
        </FieldGroup>

        <FieldGroup>
          <FieldLabel htmlFor="pr-date">여정 시작일 (구매일)</FieldLabel>
          <FieldInput
            id="pr-date"
            type="text"
            placeholder="2026.8.12"
            value={form.startDate}
            onChange={handleChange("startDate")}
          />
          {errors.startDate && (
            <ErrorText role="alert">{errors.startDate}</ErrorText>
          )}
        </FieldGroup>

        <FieldGroup>
          <FieldLabel htmlFor="pr-memory">첫 번째 기억 아카이빙</FieldLabel>
          <TextareaWrapper>
            <NotebookLines>
              {Array.from({ length: LINES_COUNT }).map((_, i) => (
                <NotebookLine key={i} />
              ))}
            </NotebookLines>
            <FieldTextarea
              id="pr-memory"
              placeholder="이 순간을 기록해보세요"
              value={form.memory}
              onChange={handleChange("memory")}
            />
          </TextareaWrapper>
          {errors.memory && (
            <ErrorText role="alert">{errors.memory}</ErrorText>
          )}
        </FieldGroup>
      </FormCard>

      {/* 제품 등록 버튼 */}
      <SubmitButton type="button" onClick={handleSubmit}>
        제품 등록
      </SubmitButton>
    </PageWrapper>
  );
};

export default ProductRegistration;
