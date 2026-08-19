import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import { apiPost } from "../utils/api";
import headerBg from "../assets/login-header-bg.png";

/* ───────────────────── 랜덤 문구 ───────────────────── */
const BRAND_PHRASES = [
  "구매 이후의 이야기가 여기서 이어집니다",
  "당신의 소중한 아이템, 함께 돌봐드릴게요",
  "오래 함께할수록 빛나는 가치를 만듭니다",
  "가방과 함께한 순간을 기록하고 이어가보세요",
];

/* ───────────────────── 애니메이션 ───────────────────── */
const scrollPattern = keyframes`
  0% { background-position: 0 center; }
  100% { background-position: -600px center; }
`;

/* ───────────────────── 스타일 ───────────────────── */
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100svh;
  background: var(--color-ivory-paper);
`;

const HeaderBanner = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    width: 200%;
    background: url(${headerBg}) repeat-x center;
    background-size: auto 100%;
    animation: ${scrollPattern} 20s linear infinite;
  }
`;

const BrandLogo = styled.div`
  position: relative;
  z-index: 1;
  font-family: var(--font-english);
  font-size: 36px;
  font-weight: 700;
  color: var(--color-walnut);
  letter-spacing: 2px;
  text-align: center;
  user-select: none;
`;

const BrandPhrase = styled.p`
  position: relative;
  z-index: 1;
  font-family: var(--font-kopub);
  font-size: 13px;
  font-weight: 300;
  color: var(--color-walnut);
  text-align: center;
  margin: 0;
`;

const FormSection = styled.form`
  width: 100%;
  max-width: 420px;
  padding: 32px 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: var(--font-kopub);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-walnut);
  text-align: left;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 ${(props) => (props.$hasToggle ? "48px" : "16px")} 0 16px;
  border: 1px solid
    ${(props) => (props.$hasError ? "#e53e3e" : "var(--color-soft-taupe)")};
  border-radius: 8px;
  background: #fff;
  font-family: var(--font-kopub);
  font-size: 14px;
  color: var(--color-walnut);
  outline: none;
  transition: border-color 200ms ease;

  &::placeholder {
    color: var(--color-soft-taupe);
  }

  &:focus {
    border-color: ${(props) =>
      props.$hasError ? "#e53e3e" : "var(--color-walnut)"};
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--color-soft-taupe);

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const ErrorText = styled.span`
  display: block;
  font-family: var(--font-kopub);
  font-size: 12px;
  color: #e53e3e;
  margin-top: 4px;
  padding-left: 4px;
`;

const AgreementRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 4px;
  cursor: pointer;
  font-family: var(--font-kopub);
  font-size: 13px;
  color: var(--color-walnut);
  line-height: 1.5;
  user-select: none;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: var(--color-walnut);
  cursor: pointer;
  flex-shrink: 0;
`;

const AgreementLink = styled.a`
  color: var(--color-walnut);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 12px;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ───────────────────── 아이콘 ───────────────────── */
const EyeIcon = ({ open }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {open ? (
      <>
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

/* ───────────────────── 컴포넌트 ───────────────────── */
const SignUp = () => {
  const navigate = useNavigate();

  const phrase = useMemo(
    () => BRAND_PHRASES[Math.floor(Math.random() * BRAND_PHRASES.length)],
    []
  );

  const [form, setForm] = useState({
    name: "",
    nickname: "",
    userId: "",
    password: "",
    passwordConfirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  /* ── 유효성 검사 ── */
  const validate = () => {
    const next = {};
    let valid = true;

    if (!form.name.trim()) {
      next.name = "이름을 입력해주세요";
      valid = false;
    }

    if (!form.nickname.trim()) {
      next.nickname = "닉네임을 입력해주세요";
      valid = false;
    }

    if (!form.userId.trim()) {
      next.userId = "아이디를 입력해주세요";
      valid = false;
    }

    if (!form.password) {
      next.password = "비밀번호를 입력해주세요";
      valid = false;
    } else if (form.password.length < 8) {
      next.password = "비밀번호는 8자 이상이어야 합니다";
      valid = false;
    }

    if (!form.passwordConfirm) {
      next.passwordConfirm = "비밀번호 확인을 입력해주세요";
      valid = false;
    } else if (form.password !== form.passwordConfirm) {
      next.passwordConfirm = "비밀번호가 일치하지 않습니다";
      valid = false;
    }

    if (!agreed) {
      next.agreement = "약관에 동의해주세요";
      valid = false;
    }

    setErrors(next);
    return valid;
  };

  /* ── 제출 ── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      // BE: POST /users — { name, nickname, email, loginId, password } → 201 { userId, nickname }
      // email은 BE 필수 필드이나 UI에서 수집하지 않으므로 더미값 자동 생성
      await apiPost("/users", {
        name: form.name.trim(),
        nickname: form.nickname.trim(),
        email: `${form.userId.trim()}@mcm-archiv.local`,
        loginId: form.userId.trim(),
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      // err.status: 0 = 네트워크 에러, 400 = 검증 실패, 403 = CORS/권한, 그 외 = 서버 에러
      console.error("[SignUp] 회원가입 실패:", err.status, err.code, err.message);

      if (err.code === "NETWORK_ERROR" || err.status === 0) {
        setErrors((prev) => ({
          ...prev,
          general: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
        }));
      } else if (err.status === 400) {
        const msg = err.message || "";
        if (msg.includes("아이디")) {
          setErrors((prev) => ({ ...prev, userId: "이미 사용 중인 아이디입니다" }));
        } else if (msg.includes("이메일")) {
          setErrors((prev) => ({ ...prev, general: "이미 가입된 계정입니다" }));
        } else {
          setErrors((prev) => ({ ...prev, general: msg || "입력값을 확인해주세요" }));
        }
      } else if (err.status === 403) {
        setErrors((prev) => ({
          ...prev,
          general: "서버 접근이 거부되었습니다. 잠시 후 다시 시도해주세요.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: err.message || "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      {/* 상단 배경 배너 */}
      <HeaderBanner>
        <BrandLogo>MCM</BrandLogo>
        <BrandPhrase>{phrase}</BrandPhrase>
      </HeaderBanner>

      {/* 폼 영역 */}
      <FormSection onSubmit={handleSubmit} noValidate>
        {/* 성명 */}
        <FieldGroup>
          <Label htmlFor="signup-name">성명</Label>
          <InputWrapper>
            <Input
              id="signup-name"
              type="text"
              placeholder="이름을 입력해주세요"
              value={form.name}
              onChange={handleChange("name")}
              $hasError={!!errors.name}
              autoComplete="name"
              aria-invalid={!!errors.name}
            />
          </InputWrapper>
          {errors.name && <ErrorText role="alert">{errors.name}</ErrorText>}
        </FieldGroup>

        {/* 닉네임 */}
        <FieldGroup>
          <Label htmlFor="signup-nickname">닉네임</Label>
          <InputWrapper>
            <Input
              id="signup-nickname"
              type="text"
              placeholder="사용하실 닉네임을 입력해주세요"
              value={form.nickname}
              onChange={handleChange("nickname")}
              $hasError={!!errors.nickname}
              autoComplete="nickname"
              aria-invalid={!!errors.nickname}
            />
          </InputWrapper>
          {errors.nickname && (
            <ErrorText role="alert">{errors.nickname}</ErrorText>
          )}
        </FieldGroup>

        {/* 아이디 */}
        <FieldGroup>
          <Label htmlFor="signup-userid">아이디</Label>
          <InputWrapper>
            <Input
              id="signup-userid"
              type="text"
              placeholder="아이디를 입력해주세요"
              value={form.userId}
              onChange={handleChange("userId")}
              $hasError={!!errors.userId}
              autoComplete="username"
              aria-invalid={!!errors.userId}
            />
          </InputWrapper>
          {errors.userId && (
            <ErrorText role="alert">{errors.userId}</ErrorText>
          )}
        </FieldGroup>

        {/* 비밀번호 */}
        <FieldGroup>
          <Label htmlFor="signup-password">비밀번호</Label>
          <InputWrapper>
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요"
              value={form.password}
              onChange={handleChange("password")}
              $hasError={!!errors.password}
              $hasToggle
              autoComplete="new-password"
              aria-invalid={!!errors.password}
            />
            <ToggleButton
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              <EyeIcon open={showPassword} />
            </ToggleButton>
          </InputWrapper>
          {errors.password && (
            <ErrorText role="alert">{errors.password}</ErrorText>
          )}
        </FieldGroup>

        {/* 비밀번호 확인 */}
        <FieldGroup>
          <Label htmlFor="signup-password-confirm">비밀번호 확인</Label>
          <InputWrapper>
            <Input
              id="signup-password-confirm"
              type="password"
              placeholder="비밀번호를 한 번 더 입력해주세요"
              value={form.passwordConfirm}
              onChange={handleChange("passwordConfirm")}
              $hasError={!!errors.passwordConfirm}
              autoComplete="new-password"
              aria-invalid={!!errors.passwordConfirm}
            />
          </InputWrapper>
          {errors.passwordConfirm && (
            <ErrorText role="alert">{errors.passwordConfirm}</ErrorText>
          )}
        </FieldGroup>

        {/* 약관 동의 */}
        <AgreementRow>
          <Checkbox
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (errors.agreement) {
                setErrors((prev) => ({ ...prev, agreement: "" }));
              }
            }}
          />
          <span>
            <AgreementLink href="#" onClick={(e) => e.preventDefault()}>
              이용약관
            </AgreementLink>
            {" 및 "}
            <AgreementLink href="#" onClick={(e) => e.preventDefault()}>
              개인정보처리방침
            </AgreementLink>
            에 동의합니다
          </span>
        </AgreementRow>
        {errors.agreement && (
          <ErrorText role="alert">{errors.agreement}</ErrorText>
        )}

        {/* 서버 에러 (일반) */}
        {errors.general && (
          <ErrorText role="alert">{errors.general}</ErrorText>
        )}

        {/* 회원가입 버튼 */}
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? "가입 처리 중..." : "회원가입"}
        </SubmitButton>
      </FormSection>
    </PageWrapper>
  );
};

export default SignUp;
