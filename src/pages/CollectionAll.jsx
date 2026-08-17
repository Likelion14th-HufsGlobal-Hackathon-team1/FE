import { Link } from "react-router-dom";
import styled from "styled-components";

import bag1 from "../assets/bag1.png";
import bag2 from "../assets/bag2.png";

/* ───────────────────── 더미 데이터 ───────────────────── */
const DUMMY_COLLECTION = [
  {
    id: 1,
    image: bag1,
    name: "Mcm Small Drawstring Backpack",
    openDate: "2036.8.12",
  },
  {
    id: 2,
    image: bag2,
    name: "Mcm Medium Visetos Tote Bag",
    openDate: "2037.3.5",
  },
];

/* ───────────────────── 스타일 ───────────────────── */
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100svh;
  background: var(--color-ivory-paper);
  padding: 32px 20px 40px;
  max-width: 420px;
  margin: 0 auto;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  color: var(--color-walnut);
  text-decoration: none;
`;

const Title = styled.h1`
  font-family: var(--font-kopub);
  font-size: 18px;
  font-weight: 500;
  color: var(--color-walnut);
  margin: 0;
`;

const CollectionGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const ItemCard = styled.div`
  background: var(--color-cream);
  border: 1px solid var(--color-soft-taupe);
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const ItemImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 10px;
  background: var(--color-ivory-paper);
`;

const ItemName = styled.span`
  font-family: var(--font-kopub);
  font-size: 11px;
  font-weight: 400;
  color: var(--color-walnut);
  text-align: center;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ItemOpenRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ItemOpenLabel = styled.span`
  font-family: var(--font-english);
  font-size: 9px;
  font-weight: 400;
  color: var(--color-soft-taupe);
  letter-spacing: 0.5px;
`;

const ItemOpenDate = styled.span`
  font-family: var(--font-kopub);
  font-size: 10px;
  font-weight: 300;
  color: var(--color-soft-taupe);
`;

/* ───────────────────── 아이콘 ───────────────────── */
const ChevronLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/* ───────────────────── 컴포넌트 ───────────────────── */
const CollectionAll = () => {
  return (
    <PageWrapper>
      <Header>
        <BackLink to="/mypage" aria-label="마이페이지로 돌아가기">
          <ChevronLeftIcon />
        </BackLink>
        <Title>나의 컬렉션 ({DUMMY_COLLECTION.length})</Title>
      </Header>

      <CollectionGrid>
        {DUMMY_COLLECTION.map((item) => (
          <ItemCard key={item.id}>
            <ItemImage src={item.image} alt={item.name} />
            <ItemName>{item.name}</ItemName>
            <ItemOpenRow>
              <LockIcon />
              <ItemOpenLabel>OPEN ON</ItemOpenLabel>
              <ItemOpenDate>{item.openDate}</ItemOpenDate>
            </ItemOpenRow>
          </ItemCard>
        ))}
      </CollectionGrid>
    </PageWrapper>
  );
};

export default CollectionAll;
