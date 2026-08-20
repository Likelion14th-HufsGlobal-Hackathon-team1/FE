import { useEffect, useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { PiMagicWandLight } from "react-icons/pi";
import { RiArrowDropDownLine, RiImageAddLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import PrimaryButton from "../components/Button";
import { apiGet, apiPost } from "../utils/api";
import { uploadImageToCloudinary } from "../utils/cloudinary";

const Page = styled.main`
  display: flex;
  width: min(100%, 402px);
  min-height: calc(100svh - 105px - env(safe-area-inset-bottom));
  margin: 0 auto;
  padding: 65px 31px 20px;
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

const ProductDropdown = styled.div`
  position: relative;
  width: 100%;
  margin-top: 28px;
`;

const ProductDropdownButton = styled.button`
  display: flex;
  width: 100%;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--color-soft-taupe);
  border-radius: ${({ $open }) => ($open ? "8px 8px 0 0" : "8px")};
  padding: 0 8px 0 12px;
  color: ${({ $hasValue }) => ($hasValue ? "#090a0a" : "#a89b89")};
  background: transparent;
  font: 300 13px/1 var(--font-kopub);
  text-align: left;
  cursor: pointer;

  svg { width: 23px; height: 23px; transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")}); transition: transform 160ms ease; }
  &:focus-visible { outline: 2px solid var(--color-walnut); outline-offset: 2px; }
`;

const ProductDropdownMenu = styled.div`
  position: absolute;
  z-index: 30;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 5px;
  border: 1px solid var(--color-soft-taupe);
  border-top: 0;
  border-radius: 0 0 8px 8px;
  background: var(--color-ivory-paper);
  box-shadow: 0 8px 18px rgba(92, 64, 51, .12);
`;

const ProductDropdownOption = styled.button`
  display: block;
  width: 100%;
  min-height: 36px;
  border: 0;
  border-radius: 5px;
  padding: 8px 10px;
  color: ${({ $selected }) => ($selected ? "#fffaf2" : "#090a0a")};
  background: ${({ $selected }) => ($selected ? "var(--color-walnut)" : "transparent")};
  font: 300 13px/1.2 var(--font-kopub);
  text-align: left;
  cursor: pointer;

  &:hover, &:focus-visible { outline: none; background: ${({ $selected }) => ($selected ? "var(--color-walnut)" : "rgba(182, 168, 146, .28)")}; }
`;

const PhotoField = styled.div`
  width: 100%;
  margin-top: 28px;
`;

const FileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
`;

const PhotoPicker = styled.label`
  position: relative;
  display: flex;
  width: calc(100% - 9px);
  height: 293px;
  margin-inline: auto;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  border: 0;
  border-radius: ${({ $hasFile }) => ($hasFile ? "30px" : "0")};
  padding: ${({ $hasFile }) => ($hasFile ? "0" : "18px")};
  overflow: hidden;
  color: var(--color-soft-taupe);
  background: transparent;
  font: 300 12px/1.5 var(--font-kopub);
  text-align: center;
  cursor: pointer;

  &::before {
    position: absolute;
    inset: 0;
    display: ${({ $hasFile }) => ($hasFile ? "none" : "block")};
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='330' height='293' viewBox='0 0 330 293' preserveAspectRatio='none'%3E%3Crect x='1' y='1' width='328' height='291' fill='none' stroke='%235c4033' stroke-width='2' stroke-dasharray='14 14'/%3E%3C/svg%3E");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    content: "";
    pointer-events: none;
  }

  svg { width: 40px; height: 40px; flex: 0 0 auto; }
  &:focus-within { outline: 2px solid rgba(95, 65, 50, .16); outline-offset: 3px; }
`;

const Preview = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 30px;
  object-fit: cover;
`;

const UploadButton = styled.label`
  display: flex;
  width: 100%;
  min-height: 51px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 60px;
  border-radius: 30px;
  padding: 11px 20px;
  background: var(--color-walnut);
  color: #fff;
  font: 300 18px/1 var(--font-kopub);
  cursor: pointer;

  svg { width: 25px; height: 25px; }
  &:focus-within { outline: 2px solid var(--color-walnut); outline-offset: 3px; }
`;

const ErrorMessage = styled.p`
  margin: 12px 0 0;
  color: #b42318;
  font: 300 12px/1.4 var(--font-kopub);
  text-align: center;
`;

const ActionButton = styled(PrimaryButton)`
  margin-top: 60px;

  @media (max-height: 720px) {
    margin-top: 40px;
  }
`;

const CareUpload = () => {
  const navigate = useNavigate();
  const productDropdownRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        console.info("[Care 1/6] 등록 제품을 조회합니다. GET /api/products");
        const { data } = await apiGet("/products");
        const list = Array.isArray(data) ? data : data?.products;
        const normalized = Array.isArray(list)
          ? list.map((product) => ({
              id: product.productId ?? product.id,
              name: product.productName ?? product.nickname ?? product.name ?? `제품 ${product.productId ?? product.id}`,
            })).filter((product) => product.id != null)
          : [];
        if (!active) return;
        setProducts(normalized);
        if (normalized.length === 1) setProductId(String(normalized[0].id));
        console.info(`[Care 2/6] 등록 제품 ${normalized.length}개를 확인했습니다.`);
      } catch (loadError) {
        if (!active) return;
        console.error("[Care 오류] 등록 제품 조회에 실패했습니다.", loadError);
        setError(loadError.message || "등록 제품을 불러오지 못했습니다.");
      }
    };
    loadProducts();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  useEffect(() => {
    const closeDropdown = (event) => {
      if (!productDropdownRef.current?.contains(event.target)) setIsProductOpen(false);
    };
    document.addEventListener("pointerdown", closeDropdown);
    return () => document.removeEventListener("pointerdown", closeDropdown);
  }, []);

  const selectedProduct = products.find((product) => String(product.id) === productId);

  const handleAction = async () => {
    if (!selectedImage) {
      setError("분석할 가방 사진을 선택해주세요.");
      return;
    }
    if (!productId) {
      setError("분석할 제품을 선택해주세요.");
      return;
    }

    setError("");
    setIsAnalyzing(true);
    try {
      console.info("[Care 3/7] 선택한 사진을 Cloudinary에 업로드합니다.", {
        name: selectedImage.name,
        size: selectedImage.size,
      });
      const imageUrl = await uploadImageToCloudinary(selectedImage);
      console.info("[Care 4/7] Cloudinary secure_url을 확인했습니다.", { imageUrl });
      console.info("[Care 5/7] AI 케어 분석을 요청합니다. POST /api/care/reports", { productId: Number(productId) });
      const { data, status } = await apiPost("/care/reports", {
        productId: Number(productId),
        imageUrl,
      });
      console.info(`[Care 6/7] 분석 결과를 받았습니다. HTTP ${status}`, { careId: data.careId });
      console.info("[Care 7/7] 분석 결과 화면으로 이동합니다.");
      navigate(`/care/result?careId=${data.careId}`, { state: { analysis: data, photoUrl: imageUrl } });
    } catch (analyzeError) {
      console.error("[Care 오류] AI 케어 분석에 실패했습니다.", analyzeError);
      setError(analyzeError.message || "가방 상태 분석에 실패했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Page>
      <Intro>
        <Title><PiMagicWandLight aria-hidden="true" />가방 상태 분석</Title>
        <Description>
          오래도록 아름답게 간직할 수 있도록,<br />
          AI가 가방의 현재 상태를 분석하고<br />
          맞춤 케어 방법을 제안해드려요.
        </Description>
      </Intro>

      <ProductDropdown ref={productDropdownRef}>
        <ProductDropdownButton type="button" $open={isProductOpen} $hasValue={Boolean(selectedProduct)} aria-haspopup="listbox" aria-expanded={isProductOpen} onClick={() => setIsProductOpen((open) => !open)}>
          <span>{selectedProduct?.name ?? "분석할 등록 제품을 선택해주세요"}</span>
          <RiArrowDropDownLine aria-hidden="true" />
        </ProductDropdownButton>
        {isProductOpen && (
          <ProductDropdownMenu role="listbox" aria-label="분석할 등록 제품">
            {products.map((product) => (
              <ProductDropdownOption key={product.id} type="button" role="option" aria-selected={String(product.id) === productId} $selected={String(product.id) === productId} onClick={() => { setProductId(String(product.id)); setIsProductOpen(false); setError(""); }}>
                {product.name}
              </ProductDropdownOption>
            ))}
          </ProductDropdownMenu>
        )}
      </ProductDropdown>

      <PhotoField>
        <PhotoPicker htmlFor="care-image-file" $hasFile={Boolean(selectedImage)}>
          {previewUrl ? (
            <Preview src={previewUrl} alt="분석할 가방 미리보기" />
          ) : (
            <>
              <RiImageAddLine aria-hidden="true" />
              <span>분석하고 싶은 가방 사진을 업로드 해주세요.</span>
            </>
          )}
          <FileInput
            id="care-image-file"
            type="file"
            accept="image/*"
            onChange={(event) => {
              setSelectedImage(event.target.files?.[0] ?? null);
              setError("");
            }}
          />
        </PhotoPicker>
        {!selectedImage && (
          <UploadButton htmlFor="care-image-file">
            <CiImageOn aria-hidden="true" />
            <span>사진 업로드</span>
          </UploadButton>
        )}
      </PhotoField>

      {selectedImage && (
        <ActionButton icon={<PiMagicWandLight />} disabled={isAnalyzing} onClick={handleAction}>
          {isAnalyzing ? "사진 업로드 및 분석 중..." : "분석 결과 확인"}
        </ActionButton>
      )}
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
    </Page>
  );
};

export default CareUpload;
