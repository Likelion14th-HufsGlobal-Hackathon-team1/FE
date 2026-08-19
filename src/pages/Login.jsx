import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import headerBg from "../assets/login-header-bg.png";

/* ───────────────────── 랜덤 문구 ───────────────────── */
const BRAND_PHRASES = [
  "구매 이후의 이야기가 여기서 이어집니다",
  "당신의 소중한 아이템, 함께 돌봐드릴게요",
  "오래 함께할수록 빛나는 가치를 만듭니다",
  "일상 속 작은 케어가 특별한 여정이 됩니다",
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
    /* 가로 2배 너비로 타일링하여 끊김 없이 스크롤 */
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
  padding: 32px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  cursor: pointer;
  font-family: var(--font-kopub);
  font-size: 13px;
  color: var(--color-walnut);
  user-select: none;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: var(--color-walnut);
  cursor: pointer;
`;

const LoginButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 20px;
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

const SignUpLink = styled.p`
  margin-top: 16px;
  padding: 0;
  font-family: var(--font-kopub);
  font-size: 13px;
  color: var(--color-soft-taupe);
  text-align: center;

  a {
    color: var(--color-walnut);
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 2px;
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
const Login = () => {
  const navigate = useNavigate();

  const phrase = useMemo(
    () => BRAND_PHRASES[Math.floor(Math.random() * BRAND_PHRASES.length)],
    []
  );

  const [userId, setUserId] = useState(() => {
    try {
      return localStorage.getItem("saved_user_id") || "";
    } catch {
      return "";
    }
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saveId, setSaveId] = useState(() => {
    try {
      return !!localStorage.getItem("saved_user_id");
    } catch {
      return false;
    }
  });

  const [errors, setErrors] = useState({ userId: "", password: "" });
  const [loginError, setLoginError] = useState("");

  /* ── 유효성 검사 ── */
  const validate = () => {
    const next = { userId: "", password: "" };
    let valid = true;

    if (!userId.trim()) {
      next.userId = "아이디를 입력해주세요";
      valid = false;
    }

    if (!password) {
      next.password = "비밀번호를 입력해주세요";
      valid = false;
    } else if (password.length < 4) {
      next.password = "비밀번호는 4자 이상이어야 합니다";
      valid = false;
    }

    setErrors(next);
    return valid;
  };

  /* ── 로그인 제출 ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!validate()) return;

    try {
      // TODO: 실제 API 연동 시 교체
      // 임시 로그인 로직 (demo: admin / 1234)
      const isSuccess = userId === "admin" && password === "1234";

      if (!isSuccess) {
        setLoginError("아이디 또는 비밀번호가 일치하지 않습니다");
        return;
      }

      // 아이디 저장
      if (saveId) {
        localStorage.setItem("saved_user_id", userId);
      } else {
        localStorage.removeItem("saved_user_id");
      }

      navigate("/home");
    } catch {
      setLoginError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
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
        {/* 아이디 */}
        <InputWrapper>
          <Input
            type="text"
            placeholder="아이디"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              if (errors.userId) setErrors((p) => ({ ...p, userId: "" }));
              if (loginError) setLoginError("");
            }}
            $hasError={!!(errors.userId || loginError)}
            autoComplete="username"
            aria-label="아이디"
            aria-invalid={!!(errors.userId || loginError)}
          />
          {errors.userId && <ErrorText role="alert">{errors.userId}</ErrorText>}
        </InputWrapper>

        {/* 비밀번호 */}
        <InputWrapper>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: "" }));
              if (loginError) setLoginError("");
            }}
            $hasError={!!(errors.password || loginError)}
            $hasToggle
            autoComplete="current-password"
            aria-label="비밀번호"
            aria-invalid={!!(errors.password || loginError)}
          />
          <ToggleButton
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            <EyeIcon open={showPassword} />
          </ToggleButton>
          {errors.password && (
            <ErrorText role="alert">{errors.password}</ErrorText>
          )}
          {loginError && !errors.password && (
            <ErrorText role="alert">{loginError}</ErrorText>
          )}
        </InputWrapper>

        {/* 아이디 저장 */}
        <CheckboxRow>
          <Checkbox
            type="checkbox"
            checked={saveId}
            onChange={(e) => setSaveId(e.target.checked)}
          />
          자동로그인
        </CheckboxRow>

        {/* 로그인 버튼 */}
        <LoginButton type="submit">로그인</LoginButton>

        {/* 회원가입 링크 (로그인 버튼 바로 아래) */}
        <SignUpLink>
          아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </SignUpLink>
      </FormSection>
    </PageWrapper>
  );
};

export default Login;
