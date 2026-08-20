import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { apiGet } from "../utils/api";

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

const PageTitle = styled.h1`
  font-family: var(--font-kopub);
  font-size: var(--font-size-title);
  font-weight: 500;
  color: var(--color-walnut);
  margin: 0 0 24px;
  text-align: left;
`;

/* ── 카드 리스트 ── */
const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  margin-bottom: 28px;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  background: var(--color-cream);
  border: 1px solid var(--color-soft-taupe);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const CardImageWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 10px;
  background: var(--color-soft-taupe);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  flex-shrink: 0;
`;

const CardImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
`;

const CardName = styled.span`
  font-family: var(--font-kopub);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-walnut);
  line-height: 1.4;
  text-align: center;
  word-break: keep-all;
`;

const CollectionMessage = styled.p`
  margin: 20px 0;
  font-family: var(--font-kopub);
  font-size: 13px;
  color: var(--color-soft-taupe);
  text-align: center;
`;

/* ── 하단 버튼 ── */
const RegisterButton = styled.button`
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 200ms ease;

  &:hover {
    opacity: 0.9;
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
const CollectionAll = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [collectionError, setCollectionError] = useState("");

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        console.info("[Collection 1/2] 등록 제품 전체 목록을 조회합니다. GET /api/products");
        const { data } = await apiGet("/products");
        if (!active) return;
        setProducts(Array.isArray(data?.products) ? data.products : []);
        console.info("[Collection 2/2] 등록 제품 전체 목록을 불러왔습니다.");
      } catch (loadError) {
        console.error("[Collection 오류] 등록 제품 전체 목록을 불러오지 못했습니다.", loadError);
        if (active) setCollectionError(loadError.message || "등록 제품을 불러오지 못했습니다.");
      }
    };
    loadProducts();
    return () => { active = false; };
  }, []);

  return (
    <PageWrapper>
      {/* 뒤로가기 */}
      <BackButton
        type="button"
        onClick={() => navigate("/mypage")}
        aria-label="마이페이지로 돌아가기"
      >
        <ArrowLeftIcon />
      </BackButton>

      {/* 타이틀 */}
      <PageTitle>나의 컬렉션 ({products.length})</PageTitle>

      {/* 카드 리스트 */}
      <CardList>
        {products.map((item) => (
          <Card key={item.productId}>
            <CardImageWrapper>
              <CardImage src={item.productImage} alt={item.productName} />
            </CardImageWrapper>

            <CardInfo>
              <CardName>{item.productName}</CardName>
            </CardInfo>
          </Card>
        ))}
        {!collectionError && products.length === 0 && (
          <CollectionMessage>등록된 제품이 없습니다.</CollectionMessage>
        )}
        {collectionError && <CollectionMessage role="alert">{collectionError}</CollectionMessage>}
      </CardList>

      {/* 새로운 제품 등록 버튼 */}
      <RegisterButton
        type="button"
        onClick={() => navigate("/product-registration")}
      >
        + 새로운 제품 등록하기
      </RegisterButton>
    </PageWrapper>
  );
};

export default CollectionAll;
