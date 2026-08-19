import { useEffect, useRef, useState } from "react";
import { TbPhoto, TbPhotoPlus, TbWand } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import PrimaryButton from "../components/Button";

const Page = styled.main`
  display: flex;
  width: min(100%, 480px);
  min-height: calc(100svh - 105px - env(safe-area-inset-bottom));
  margin: 0 auto;
  padding: 65px clamp(20px, 7.7vw, 37px) 74px;
  flex-direction: column;
  color: #090a0a;
  background: var(--color-ivory-paper);
  text-align: left;

  @media (max-width: 360px) {
    padding-inline: 22px;
  }

  @media (max-height: 720px) {
    padding-top: 38px;
    padding-bottom: 42px;
  }
`;

const Intro = styled.section`
  width: 100%;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0;
  color: #090a0a;
  font: 300 20px/1 var(--font-kopub);

  svg { width: 25px; height: 25px; }
`;

const Description = styled.p`
  margin: 13px 0 0;
  border-left: 1px solid var(--color-soft-taupe);
  padding-left: 11px;
  color: #090a0a;
  font: 300 12px/1.45 var(--font-kopub);
`;

const UploadArea = styled.button`
  display: grid;
  width: 100%;
  min-height: 229px;
  margin-top: 44px;
  place-items: center;
  border: 0;
  padding: 0;
  overflow: hidden;
  background: ${({ $hasPhoto }) =>
    $hasPhoto
      ? "transparent"
      : `
        repeating-linear-gradient(to right, var(--color-walnut) 0 19px, transparent 19px 37px) top / 100% 1.5px no-repeat,
        repeating-linear-gradient(to right, var(--color-walnut) 0 19px, transparent 19px 37px) bottom / 100% 1.5px no-repeat,
        repeating-linear-gradient(to bottom, var(--color-walnut) 0 19px, transparent 19px 37px) left / 1.5px 100% no-repeat,
        repeating-linear-gradient(to bottom, var(--color-walnut) 0 19px, transparent 19px 37px) right / 1.5px 100% no-repeat
      `};
  color: var(--color-soft-taupe);
  cursor: pointer;

  &:focus-visible { outline: 2px solid var(--color-walnut); outline-offset: 4px; }

  @media (max-height: 720px) {
    margin-top: 28px;
  }
`;

const UploadGuide = styled.span`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  font: 300 11px/1.4 var(--font-kopub);

  svg { width: 35px; height: 35px; }
`;

const Preview = styled.img`
  display: block;
  width: calc(100% - 16px);
  height: 213px;
  object-fit: contain;
`;

const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const ActionButton = styled(PrimaryButton)`
  margin-top: 45px;

  @media (max-height: 720px) {
    margin-top: 28px;
  }
`;

const CareUpload = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!photo) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const openFilePicker = () => inputRef.current?.click();

  const handlePhotoChange = (event) => {
    const selectedPhoto = event.target.files?.[0];
    if (selectedPhoto) setPhoto(selectedPhoto);
  };

  const handleAction = () => {
    if (!photo) {
      openFilePicker();
      return;
    }

    navigate("/care/result", { state: { previewUrl } });
  };

  return (
    <Page>
      <Intro>
        <Title><TbWand aria-hidden="true" />가방 상태 분석</Title>
        <Description>
          오래도록 아름답게 간직할 수 있도록,<br />
          AI가 가방의 현재 상태를 분석하고<br />
          맞춤 케어 방법을 제안해드려요.
        </Description>
      </Intro>

      <HiddenInput
        ref={inputRef}
        type="file"
        accept="image/*"
        aria-label="가방 사진 선택"
        onChange={handlePhotoChange}
      />

      <UploadArea
        type="button"
        aria-label="가방 사진 업로드"
        $hasPhoto={Boolean(previewUrl)}
        onClick={openFilePicker}
      >
        {previewUrl ? (
          <Preview src={previewUrl} alt="업로드한 가방 미리보기" />
        ) : (
          <UploadGuide>
            <TbPhotoPlus aria-hidden="true" />
            <span>분석하고 싶은 가방 사진을 업로드 해주세요.</span>
          </UploadGuide>
        )}
      </UploadArea>

      <ActionButton icon={photo ? <TbWand /> : <TbPhoto />} onClick={handleAction}>
        {photo ? "분석 결과 확인" : "사진 업로드"}
      </ActionButton>
    </Page>
  );
};

export default CareUpload;
