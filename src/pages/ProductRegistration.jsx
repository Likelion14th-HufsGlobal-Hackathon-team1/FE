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

/* ───────────────────── 컴포넌트 ───────────────────── */
const ProductRegistration = () => {
  const navigate = useNavigate();

  const [scanned, setScanned] = useState(false);
  const [form, setForm] = useState({
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

  const validate = () => {
    const next = {};
    let valid = true;

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
    const dateParts = form.startDate.replace(/[-.\/]/g, ".").split(".");
    let openDate = form.startDate;
    if (dateParts.length >= 3) {
      const year = parseInt(dateParts[0], 10) + 10;
      openDate = `${year}.${dateParts[1]}.${dateParts[2]}`;
    }

    // 마이페이지 컬렉션에 추가 (localStorage 임시 저장)
    const newItem = {
      id: Date.now(),
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
