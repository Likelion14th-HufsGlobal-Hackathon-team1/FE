import { useEffect, useRef, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { TbWand } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import PrimaryButton from "../components/Button";
import { apiGet, apiPost } from "../utils/api";

const Page = styled.main`
  display: flex;
  width: min(100%, 480px);
  min-height: calc(100svh - 105px - env(safe-area-inset-bottom));
  margin: 0 auto;
  padding: 65px clamp(20px, 7.7vw, 37px) 20px;
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

const Preview = styled.img`
  display: block;
  margin: 32px auto 0;
  width: auto;
  max-width: min(100%, 320px);
  height: auto;
  max-height: min(38svh, 300px);
  border-radius: 30px;
  object-fit: contain;
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

const UrlField = styled.div`
  width: 100%;
  margin-top: 18px;
`;

const UrlLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #090a0a;
  font: 300 12px/1 var(--font-kopub);
`;

const UrlInput = styled.input`
  width: 100%;
  height: 42px;
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

const ErrorMessage = styled.p`
  margin: 12px 0 0;
  color: #b42318;
  font: 300 12px/1.4 var(--font-kopub);
  text-align: center;
`;

const ActionButton = styled(PrimaryButton)`
  margin-top: clamp(48px, 10svh, 96px);

  @media (max-height: 720px) {
    margin-top: 40px;
  }
`;

const CareUpload = () => {
  const navigate = useNavigate();
  const productDropdownRef = useRef(null);
  const [publicImageUrl, setPublicImageUrl] = useState("");
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
    const closeDropdown = (event) => {
      if (!productDropdownRef.current?.contains(event.target)) setIsProductOpen(false);
    };
    document.addEventListener("pointerdown", closeDropdown);
    return () => document.removeEventListener("pointerdown", closeDropdown);
  }, []);

  const selectedProduct = products.find((product) => String(product.id) === productId);
  const publicPreviewUrl = /^https?:\/\//i.test(publicImageUrl.trim()) ? publicImageUrl.trim() : "";

  const handleAction = async () => {
    const normalizedPublicUrl = publicImageUrl.trim();
    if (!normalizedPublicUrl) {
      setError("분석할 이미지 URL을 입력해주세요.");
      return;
    }
    if (!productId) {
      setError("분석할 제품을 선택해주세요.");
      return;
    }

    setError("");
    setIsAnalyzing(true);
    try {
      if (normalizedPublicUrl && !/^https?:\/\//i.test(normalizedPublicUrl)) {
        throw new Error("http:// 또는 https://로 시작하는 공개 이미지 URL을 입력해주세요.");
      }
      console.info("[Care 3/6] 입력한 이미지 URL을 사용합니다.");
      const imageUrl = normalizedPublicUrl;
      console.info("[Care 4/6] AI 케어 분석을 요청합니다. POST /api/care/reports", { productId: Number(productId) });
      const { data, status } = await apiPost("/care/reports", {
        productId: Number(productId),
        imageUrl,
      });
      console.info(`[Care 5/6] 분석 결과를 받았습니다. HTTP ${status}`, { careId: data.careId });
      console.info("[Care 6/6] 분석 결과 화면으로 이동합니다.");
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
        <Title><TbWand aria-hidden="true" />가방 상태 분석</Title>
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

      <UrlField>
        <UrlLabel htmlFor="care-public-image-url">이미지 URL</UrlLabel>
        <UrlInput
          id="care-public-image-url"
          type="url"
          inputMode="url"
          placeholder="https://.../bag.jpg"
          value={publicImageUrl}
          onChange={(event) => {
            setPublicImageUrl(event.target.value);
            setError("");
          }}
        />
      </UrlField>

      {publicPreviewUrl && (
        <Preview
          src={publicPreviewUrl}
          alt="분석할 가방 미리보기"
          onError={() => setError("입력한 이미지 URL을 불러올 수 없습니다.")}
        />
      )}

      <ActionButton icon={<TbWand />} disabled={isAnalyzing} onClick={handleAction}>
        {isAnalyzing ? "AI 분석 중..." : "분석 결과 확인"}
      </ActionButton>
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
    </Page>
  );
};

export default CareUpload;
