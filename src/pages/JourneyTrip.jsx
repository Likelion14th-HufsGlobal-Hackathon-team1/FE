import { useEffect, useMemo, useRef, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { TbArrowLeft, TbCamera, TbSparkles } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import PrimaryButton from "../components/Button";
import { apiGet, apiPost } from "../utils/api";

const COUNTRIES = [
  "대한민국",
  "일본",
  "중국",
  "미국",
  "프랑스",
  "이탈리아",
  "영국",
  "스페인",
  "독일",
  "태국",
  "베트남",
  "싱가포르",
  "직접 입력",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, index) => CURRENT_YEAR - 9 + index);
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

const Page = styled.main`
  display: flex;
  width: min(100%, 480px);
  min-height: calc(100svh - 105px - env(safe-area-inset-bottom));
  margin: 0 auto;
  padding: 18px clamp(20px, 7.7vw, 37px) 20px;
  flex-direction: column;
  color: #090a0a;
  background: var(--color-ivory-paper);
  text-align: left;
`;

const BackButton = styled.button`
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 0;
  padding: 0;
  background: transparent;
  color: #090a0a;
  cursor: pointer;

  svg {
    width: 30px;
    height: 30px;
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 3px;
  }
`;

const Intro = styled.section`
  width: min(100%, 246px);
  margin-top: 18px;
`;

const TitleRow = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  gap: 15px;
`;

const CameraIcon = styled(TbCamera)`
  width: 25px;
  height: 25px;
  flex: 0 0 auto;
`;

const Title = styled.h1`
  margin: 0;
  color: #090a0a;
  font: 300 20px/1 var(--font-kopub);
`;

const DescriptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

const AccentLine = styled.span`
  width: 1px;
  height: 34px;
  flex: 0 0 auto;
  background: var(--color-soft-taupe);
`;

const Description = styled.p`
  margin: 0;
  font: 300 12px/1.15 var(--font-kopub);
  white-space: nowrap;

  @media (max-width: 340px) {
    font-size: 11px;
  }
`;

const Form = styled.form`
  display: flex;
  flex: 1;
  margin-top: 28px;
  flex-direction: column;
  gap: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

const Label = styled.label`
  font: 300 14px/1 var(--font-kopub);
`;

const Control = styled.input`
  width: 100%;
  height: 32px;
  border: 1px solid var(--color-soft-taupe);
  border-radius: 8px;
  padding: 0 12px;
  background: transparent;
  color: #090a0a;
  font: 300 14px/1 var(--font-kopub);

  &:focus-visible {
    border-color: var(--color-walnut);
    outline: 1px solid var(--color-walnut);
  }
`;

const DropdownRoot = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  display: flex;
  width: 100%;
  height: 32px;
  align-items: center;
  justify-content: space-between;
  border: 1px solid
    ${({ $open }) => ($open ? "var(--color-walnut)" : "var(--color-soft-taupe)")};
  border-radius: 8px;
  padding: 0 6px 0 12px;
  background: var(--color-ivory-paper);
  color: #090a0a;
  font: 300 14px/1 var(--font-kopub);
  text-align: left;
  cursor: pointer;

  svg {
    width: 25px;
    height: 25px;
    flex: 0 0 auto;
    transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
    transition: transform 160ms ease;
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 2px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  z-index: 30;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 220px;
  overflow-y: auto;
  border: 1px solid var(--color-soft-taupe);
  border-radius: 8px;
  padding: 4px;
  background: var(--color-cream);
  box-shadow: 0 8px 18px rgba(92, 64, 51, 0.16);
  scrollbar-color: var(--color-soft-taupe) transparent;
  scrollbar-width: thin;
`;

const DropdownOption = styled.button`
  width: 100%;
  min-height: 34px;
  border: 0;
  border-radius: 6px;
  padding: 6px 10px;
  background: ${({ $selected }) =>
    $selected ? "var(--color-walnut)" : "transparent"};
  color: ${({ $selected }) => ($selected ? "#fff" : "#090a0a")};
  font: 300 14px/1.2 var(--font-kopub);
  text-align: left;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    outline: none;
    background: ${({ $selected }) =>
      $selected ? "var(--color-walnut)" : "rgba(182, 168, 146, 0.35)"};
  }
`;

const DateControl = styled.div`
  display: grid;
  grid-template-columns: 1.35fr 1fr 1fr;
  gap: 6px;
`;

const PhotoHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
`;

const PhotoLabel = styled.span`
  font: 300 14px/1 var(--font-kopub);
`;

const PhotoUrlRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
`;

const PhotoUrlInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 40px;
  border: 1px solid var(--color-soft-taupe);
  border-radius: 8px;
  padding: 0 12px;
  color: #090a0a;
  background: transparent;
  font: 300 12px/1.3 var(--font-kopub);
  outline: none;

  &::placeholder { color: #a89b89; }
  &:focus { border-color: var(--color-walnut); }
`;

const PhotoUrlButton = styled.button`
  height: 40px;
  border: 0;
  border-radius: 8px;
  padding: 0 14px;
  color: var(--color-cream);
  background: var(--color-walnut);
  font: 300 12px/1 var(--font-kopub);
  cursor: pointer;

  &:focus-visible { outline: 2px solid var(--color-walnut); outline-offset: 2px; }
`;

const PreviewList = styled.div`
  display: flex;
  min-height: ${({ $hasPhotos }) => ($hasPhotos ? "115px" : "0")};
  flex-wrap: wrap;
  gap: 15px;
`;

const Preview = styled.img`
  width: 85px;
  height: 115px;
  border-radius: 15px;
  object-fit: cover;
`;

const SubmitButton = styled(PrimaryButton)`
  margin-top: clamp(48px, 10svh, 96px);

  @media (max-height: 720px) {
    margin-top: 40px;
  }
`;

const SubmitError = styled.p`
  margin: -8px 0 0;
  color: #b42318;
  font: 300 12px/1.45 var(--font-kopub);
  text-align: center;
`;

const Dropdown = ({ ariaLabel, value, options, placeholder = "", onChange }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const selectedOption = options.find(
    (option) => String(option.value ?? option) === String(value),
  );
  const selectedLabel = selectedOption?.label ?? selectedOption ?? placeholder;

  return (
    <DropdownRoot ref={rootRef}>
      <DropdownButton
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        $open={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selectedLabel || "\u00a0"}</span>
        <RiArrowDropDownLine aria-hidden="true" />
      </DropdownButton>
      {open && (
        <DropdownMenu role="listbox" aria-label={ariaLabel}>
          {options.map((option) => {
            const optionValue = String(option.value ?? option);
            const optionLabel = option.label ?? option;
            const selected = optionValue === String(value);
            return (
              <DropdownOption
                key={optionValue}
                type="button"
                role="option"
                aria-selected={selected}
                $selected={selected}
                onClick={() => {
                  onChange(optionValue);
                  setOpen(false);
                }}
              >
                {optionLabel}
              </DropdownOption>
            );
          })}
        </DropdownMenu>
      )}
    </DropdownRoot>
  );
};

const JourneyTrip = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [country, setCountry] = useState("");
  const [customCountry, setCustomCountry] = useState("");
  const [city, setCity] = useState("");
  const [product, setProduct] = useState("");
  const [registeredProducts, setRegisteredProducts] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        const { data } = await apiGet("/products");
        const list = Array.isArray(data?.products) ? data.products : [];
        if (!active) return;
        setRegisteredProducts(list.map((item) => ({
          id: String(item.productId),
          apiId: item.productId,
          name: item.productName,
        })));
      } catch (productError) {
        console.error("[Journey 오류] 등록 제품 조회에 실패했습니다.", productError);
        if (active) setSubmitError(productError.message || "등록 제품을 불러오지 못했습니다.");
      }
    };
    loadProducts();
    return () => { active = false; };
  }, []);

  const days = useMemo(() => {
    const count =
      year && month ? new Date(Number(year), Number(month), 0).getDate() : 31;
    return Array.from({ length: count }, (_, index) => index + 1);
  }, [year, month]);

  const handlePhotoUrlAdd = () => {
    const url = photoUrlInput.trim();
    if (!/^https?:\/\//i.test(url)) {
      setSubmitError("http:// 또는 https://로 시작하는 이미지 URL을 입력해주세요.");
      return;
    }
    setPhotos((current) => [
      ...current,
      { name: `url-${current.length + 1}`, src: url },
    ]);
    setPhotoUrlInput("");
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    console.info("[Journey 1/7] Charm 생성 요청을 시작합니다.");

    const selectedProduct = registeredProducts.find(
      (item) => item.id === product,
    );
    const selectedCountry = country === "직접 입력" ? customCountry.trim() : country;
    if (!year || !month || !day || !selectedCountry || !city.trim() || !selectedProduct || photos.length === 0) {
      console.warn("[Journey 중단] 필수 입력값이 누락되었습니다.");
      setSubmitError("날짜, 국가, 도시, 제품, 사진을 모두 입력해주세요.");
      return;
    }
    console.info("[Journey 2/7] 입력값 검증이 완료되었습니다.", {
      travelDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      country: selectedCountry,
      city: city.trim(),
      productId: selectedProduct.apiId,
      imageCount: photos.length,
    });

    const accessToken = localStorage.getItem("accessToken") ?? sessionStorage.getItem("accessToken");
    if (!accessToken) {
      console.warn("[Journey 중단] accessToken을 찾을 수 없습니다.");
      setSubmitError("로그인 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }
    console.info("[Journey 3/7] JWT 인증 정보를 확인했습니다.");

    setIsSubmitting(true);
    try {
      console.info("[Journey 4/7] POST /api/journeys 요청을 전송합니다.");
      const journeyData = {
        productId: selectedProduct.apiId,
        country: selectedCountry,
        city: city.trim(),
        travelDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        imageUrls: photos.map((photo) => photo.src),
      };
      const { data, status } = await apiPost("/journeys", { ...journeyData, memo: "" });

      console.info(`[Journey 5/7] 서버 응답을 받았습니다. HTTP ${status}`);

      const candidates = Array.isArray(data.candidates)
        ? data.candidates.filter((candidate) => candidate?.candidateId != null && candidate?.imageUrl)
        : [];
      if (candidates.length === 0) throw new Error("생성된 Charm 후보가 없습니다.");
      console.info(`[Journey 6/7] AI Charm 후보 ${candidates.length}개를 확인했습니다.`, {
        candidateIds: candidates.map((candidate) => candidate.candidateId),
      });

      console.info("[Journey 7/7] Charm 후보 선택 화면으로 이동합니다.");
      navigate("/journey/make", { state: { candidates, journeyData } });
    } catch (error) {
      console.error("[Journey 오류] 여정 인증 또는 Charm 생성 요청에 실패했습니다.", error);
      setSubmitError(error instanceof Error ? error.message : "여정 인증 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page>
      <BackButton type="button" aria-label="이전 페이지" onClick={() => navigate(-1)}>
        <TbArrowLeft aria-hidden="true" />
      </BackButton>

      <Intro>
        <TitleRow>
          <CameraIcon aria-hidden="true" />
          <Title>여정 인증</Title>
        </TitleRow>
        <DescriptionRow>
          <AccentLine aria-hidden="true" />
          <Description>
            MCM과 함께한 여행의 순간을 인증하고,
            <br />
            오늘의 여정을 기록으로 남겨보세요.
          </Description>
        </DescriptionRow>
      </Intro>

      <Form onSubmit={handleSubmit}>
        <Field>
          <Label as="span">DATE</Label>
          <DateControl>
            <Dropdown
              ariaLabel="여행 연도"
              value={year}
              placeholder="년"
              options={YEARS}
              onChange={setYear}
            />
            <Dropdown
              ariaLabel="여행 월"
              value={month}
              placeholder="월"
              options={MONTHS}
              onChange={setMonth}
            />
            <Dropdown
              ariaLabel="여행 일"
              value={day}
              placeholder="일"
              options={days}
              onChange={setDay}
            />
          </DateControl>
        </Field>

        <Field>
          <Label as="span">COUNTRY</Label>
          <Dropdown
            ariaLabel="국가"
            value={country}
            options={COUNTRIES}
            onChange={setCountry}
          />
          {country === "직접 입력" && (
            <Control
              aria-label="국가 직접 입력"
              value={customCountry}
              onChange={(event) => setCustomCountry(event.target.value)}
              autoComplete="country-name"
              autoFocus
            />
          )}
        </Field>

        <Field>
          <Label htmlFor="journey-city">CITY</Label>
          <Control id="journey-city" value={city} onChange={(event) => setCity(event.target.value)} autoComplete="off" />
        </Field>

        <Field>
          <Label as="span">PRODUCT</Label>
          <Dropdown
            ariaLabel="제품"
            value={product}
            options={registeredProducts.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            onChange={setProduct}
          />
        </Field>

        <Field>
          <PhotoHeading>
            <PhotoLabel>PHOTO</PhotoLabel>
          </PhotoHeading>
          <PhotoUrlRow>
            <PhotoUrlInput
              type="url"
              inputMode="url"
              aria-label="여행 사진 이미지 URL"
              placeholder="https://.../photo.jpg"
              value={photoUrlInput}
              onChange={(event) => setPhotoUrlInput(event.target.value)}
            />
            <PhotoUrlButton type="button" onClick={handlePhotoUrlAdd}>추가</PhotoUrlButton>
          </PhotoUrlRow>
          <PreviewList $hasPhotos={photos.length > 0} aria-live="polite">
            {photos.map((photo, index) => (
              <Preview key={`${photo.name}-${index}`} src={photo.src} alt={`선택한 여행 사진 ${index + 1}`} />
            ))}
          </PreviewList>
        </Field>

        <SubmitButton type="submit" icon={<TbSparkles />} disabled={isSubmitting}>
          {isSubmitting ? "Charm 생성 중..." : "Charm 생성"}
        </SubmitButton>
        {submitError && <SubmitError role="alert">{submitError}</SubmitError>}
      </Form>
    </Page>
  );
};

export default JourneyTrip;
