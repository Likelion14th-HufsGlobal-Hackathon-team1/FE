import { useEffect, useMemo, useRef, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { TbArrowLeft, TbCamera, TbPlus, TbSparkles } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import PrimaryButton from "../components/Button";

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

// TODO: 로그인한 사용자의 등록 제품 API 응답으로 교체합니다.
const REGISTERED_PRODUCTS = [
  { id: "MCM-000001", name: "Aren Shopper" },
  { id: "MCM-000002", name: "Stark Backpack" },
  { id: "MCM-000003", name: "Liz Shopper" },
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, index) => CURRENT_YEAR - 9 + index);
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

const Page = styled.main`
  width: min(100%, 480px);
  min-height: calc(100svh - 105px - env(safe-area-inset-bottom));
  margin: 0 auto;
  padding: 18px clamp(20px, 7.7vw, 37px) 84px;
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

const PhotoButton = styled.label`
  display: flex;
  height: 22px;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 30px;
  padding: 0 11px;
  background: var(--color-soft-taupe);
  color: #090a0a;
  font: 300 12px/1 var(--font-kopub);
  cursor: pointer;

  svg {
    width: 12px;
    height: 12px;
  }

  &:focus-within {
    outline: 2px solid var(--color-walnut);
    outline-offset: 3px;
  }
`;

const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
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
  margin-top: 15px;
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

const readImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, src: reader.result });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
  const [photos, setPhotos] = useState([]);

  const days = useMemo(() => {
    const count =
      year && month ? new Date(Number(year), Number(month), 0).getDate() : 31;
    return Array.from({ length: count }, (_, index) => index + 1);
  }, [year, month]);

  const handlePhotoChange = async (event) => {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    const previews = await Promise.all(files.map(readImage));
    setPhotos((current) => [...current, ...previews]);
    event.target.value = "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/journey/make");
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
            options={REGISTERED_PRODUCTS.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            onChange={setProduct}
          />
        </Field>

        <Field>
          <PhotoHeading>
            <PhotoLabel>PHOTO</PhotoLabel>
            <PhotoButton>
              PHOTO
              <TbPlus aria-hidden="true" />
              <HiddenFileInput type="file" accept="image/*" multiple onChange={handlePhotoChange} />
            </PhotoButton>
          </PhotoHeading>
          <PreviewList $hasPhotos={photos.length > 0} aria-live="polite">
            {photos.map((photo, index) => (
              <Preview key={`${photo.name}-${index}`} src={photo.src} alt={`선택한 여행 사진 ${index + 1}`} />
            ))}
          </PreviewList>
        </Field>

        <SubmitButton type="submit" icon={<TbSparkles />}>
          Charm 생성
        </SubmitButton>
      </Form>
    </Page>
  );
};

export default JourneyTrip;
