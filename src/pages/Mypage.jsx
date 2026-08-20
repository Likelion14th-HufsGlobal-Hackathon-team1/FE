import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

import profileImg from "../assets/profile.png";
import userImg from "../assets/user.png";
import { apiGet } from "../utils/api";
import { fillProductImagesFromJourneys } from "../utils/productImages";

/* ───────────────────── 스타일 ───────────────────── */
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  background: var(--color-ivory-paper);
  padding: 48px 20px 32px;
  max-width: 420px;
  margin: 0 auto;
`;

/* ── 상단 헤더 ── */
const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const HeaderIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const HeaderIconImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const HeaderTitle = styled.h1`
  font-family: var(--font-english);
  font-size: var(--font-size-title);
  font-weight: 400;
  color: var(--color-walnut);
  margin: 0;
`;

const SubtitleRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 10px;
  margin-bottom: 24px;
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
`;

/* ── 프로필 카드 ── */
const ProfileCard = styled.div`
  width: 100%;
  background: var(--color-cream);
  border: 1px solid var(--color-soft-taupe);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
`;

const ProfileAvatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1.5px solid var(--color-soft-taupe);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

const ProfileAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const ProfileName = styled.span`
  font-family: var(--font-kopub);
  font-size: 15px;
  font-weight: 400;
  color: var(--color-walnut);
`;

const Badge = styled.span`
  display: inline-block;
  padding: 5px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--color-soft-taupe);
  background: var(--color-walnut);
  color: var(--color-ivory-paper);
  font-family: var(--font-english);
  font-size: 12px;
  font-weight: 400;
  width: fit-content;
`;

/* ── 새 제품 등록 배너 ── */
const RegisterBanner = styled.button`
  width: 100%;
  background: var(--color-walnut);
  border: none;
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  margin-bottom: 28px;
  transition: opacity 200ms ease;
  text-align: left;

  &:hover {
    opacity: 0.9;
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 3px;
  }
`;

const BannerTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BannerTitle = styled.span`
  font-family: var(--font-kopub);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-ivory-paper);
`;

const BannerSub = styled.span`
  font-family: var(--font-kopub);
  font-size: 11px;
  font-weight: 300;
  color: var(--color-ivory-paper);
  opacity: 0.85;
  line-height: 1.5;
`;

const BannerPlusIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-ivory-paper);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 0;
  padding: 0;
  cursor: pointer;
`;

/* ── 나의 컬렉션 섹션 ── */
const SectionHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-kopub);
  font-size: 15px;
  font-weight: 500;
  color: var(--color-walnut);
  margin: 0;
`;

const ViewAllLink = styled(Link)`
  font-family: var(--font-kopub);
  font-size: 12px;
  color: var(--color-soft-taupe);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CollectionGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 28px;
`;

const ItemCard = styled.button`
  position: relative;
  background: var(--color-cream);
  border: 1px solid var(--color-soft-taupe);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0;
  color: inherit;
  cursor: pointer;
  text-align: inherit;

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 2px;
  }
`;

const ItemImageWrapper = styled.div`
  width: 100%;
  height: 160px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ItemImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const ItemInfo = styled.div`
  width: 100%;
  padding: 12px 10px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: var(--color-cream);
  flex: 1;
`;

const ItemName = styled.span`
  font-family: var(--font-kopub);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-walnut);
  text-align: center;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CollectionMessage = styled.p`
  grid-column: 1 / -1;
  margin: 8px 0;
  font-family: var(--font-kopub);
  font-size: 12px;
  color: var(--color-soft-taupe);
  text-align: center;
`;

/* ── 계정 정보 섹션 ── */
const AccountCard = styled.div`
  width: 100%;
  background: var(--color-cream);
  border: 1px solid var(--color-soft-taupe);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const AccountRow = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-soft-taupe);
  }
`;

const AccountLabel = styled.span`
  font-family: var(--font-kopub);
  font-size: 12px;
  font-weight: 300;
  color: var(--color-soft-taupe);
  width: 70px;
  flex-shrink: 0;
  text-align: left;
`;

const AccountValue = styled.span`
  font-family: var(--font-kopub);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-walnut);
  flex: 1;
  text-align: left;
`;

const AccountError = styled.p`
  margin: -14px 0 18px;
  color: #b42318;
  font-family: var(--font-kopub);
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
`;

/* ── 하단 버튼 ── */
const LogoutButton = styled.button`
  width: 100%;
  height: 46px;
  border: 1.5px solid var(--color-soft-taupe);
  border-radius: 23px;
  background: transparent;
  color: var(--color-walnut);
  font-family: var(--font-kopub);
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 200ms ease;
  margin-bottom: 14px;

  &:hover {
    background: rgba(182, 168, 146, 0.1);
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 3px;
  }
`;

/* ───────────────────── 아이콘 컴포넌트 ───────────────────── */
const PlusIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--color-walnut)"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// DEMO ONLY - 해커톤 발표용, 추후 제거 예정
/* ───────────────────── 컴포넌트 ───────────────────── */
const Mypage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [representativeBags, setRepresentativeBags] = useState([]);
  const [accountError, setAccountError] = useState("");
  const [products, setProducts] = useState([]);
  const [collectionError, setCollectionError] = useState("");

  useEffect(() => {
    let active = true;
    const loadAccount = async () => {
      try {
        console.info("[MyPage 1/2] 사용자 정보를 조회합니다. GET /api/users/me");
        const [{ data: userData }, { data: bagData }] = await Promise.all([
          apiGet("/users/me"),
          apiGet("/representative-bags"),
        ]);
        if (!active) return;
        setUser(userData);
        setRepresentativeBags(Array.isArray(bagData?.bags) ? bagData.bags : []);
        console.info("[MyPage 2/2] 사용자 정보와 대표 가방 목록을 불러왔습니다.");
      } catch (loadError) {
        console.error("[MyPage 오류] 계정 정보를 불러오지 못했습니다.", loadError);
        if (active) setAccountError(loadError.message || "계정 정보를 불러오지 못했습니다.");
      }
    };
    loadAccount();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        console.info("[MyPage Collection 1/2] 등록 제품을 조회합니다. GET /api/products");
        const { data } = await apiGet("/products");
        const list = Array.isArray(data?.products) ? data.products : [];
        const productsWithImages = await fillProductImagesFromJourneys(list);
        if (!active) return;
        setProducts(productsWithImages);
        console.info("[MyPage Collection 2/2] 등록 제품 컬렉션을 불러왔습니다.");
      } catch (loadError) {
        console.error("[MyPage Collection 오류] 등록 제품을 불러오지 못했습니다.", loadError);
        if (active) setCollectionError(loadError.message || "등록 제품을 불러오지 못했습니다.");
      }
    };
    loadProducts();
    return () => { active = false; };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("saved_user_id");
    sessionStorage.removeItem("accessToken");
    navigate("/login");
  };

  const representativeBag = representativeBags.find((bag) => String(bag.bagId) === String(user?.representativeBagId));
  const profileImage = user?.profileImage || representativeBag?.imageUrl || profileImg;

  return (
    <PageWrapper>
      {/* 상단 헤더 */}
      <Header>
        <HeaderIcon>
          <HeaderIconImg src={userImg} alt="" />
        </HeaderIcon>
        <HeaderTitle>My page</HeaderTitle>
      </Header>

      <SubtitleRow>
        <AccentBar />
        <SubtitleText>
          가입하신 정보를 확인해보세요.
        </SubtitleText>
      </SubtitleRow>

      {/* 프로필 카드 */}
      <ProfileCard>
        <ProfileAvatar>
          <ProfileAvatarImg src={profileImage} alt="프로필" />
        </ProfileAvatar>
        <ProfileInfo>
          <ProfileName>{user?.nickname ?? "-"} 님</ProfileName>
          <Badge>Journey Member</Badge>
        </ProfileInfo>
      </ProfileCard>

      {/* 새 제품 등록 배너 */}
      <RegisterBanner type="button" onClick={() => navigate("/product-registration")}>
        <BannerTextGroup>
          <BannerTitle>새로운 제품 등록하기</BannerTitle>
          <BannerSub>
            소중한 기억의 첫 페이지를 기록하고
            <br />
            꾸준히 관리해보세요
          </BannerSub>
        </BannerTextGroup>
        <BannerPlusIcon>
          <PlusIcon />
        </BannerPlusIcon>
      </RegisterBanner>

      {/* 나의 컬렉션 */}
      <SectionHeader>
        <SectionTitle>나의 컬렉션 ({products.length})</SectionTitle>
        <ViewAllLink to="/mypage/collection">전체보기 &gt;</ViewAllLink>
      </SectionHeader>

      <CollectionGrid>
        {products.slice(0, 2).map((item) => (
          <ItemCard
            key={item.productId}
            type="button"
            onClick={() => navigate("/capsule-detail", { state: { productId: item.productId } })}
          >
            <ItemImageWrapper>
              <ItemImage src={item.productImage} alt={item.productName} />
            </ItemImageWrapper>
            <ItemInfo>
              <ItemName>{item.productName}</ItemName>
            </ItemInfo>
          </ItemCard>
        ))}
        {!collectionError && products.length === 0 && (
          <CollectionMessage>등록된 제품이 없습니다.</CollectionMessage>
        )}
        {collectionError && <CollectionMessage role="alert">{collectionError}</CollectionMessage>}
      </CollectionGrid>

      {/* 계정 정보 */}
      <SectionHeader>
        <SectionTitle>계정 정보</SectionTitle>
      </SectionHeader>

      <AccountCard>
        <AccountRow>
          <AccountLabel>닉네임</AccountLabel>
          <AccountValue>{user?.nickname ?? "-"}</AccountValue>
        </AccountRow>
        <AccountRow>
          <AccountLabel>성명</AccountLabel>
          <AccountValue>{user?.name ?? "-"}</AccountValue>
        </AccountRow>
        <AccountRow>
          <AccountLabel>아이디</AccountLabel>
          <AccountValue>{user?.loginId ?? "-"}</AccountValue>
        </AccountRow>
        <AccountRow>
          <AccountLabel>비밀번호</AccountLabel>
          <AccountValue>●●●●●●</AccountValue>
        </AccountRow>
      </AccountCard>
      {accountError && <AccountError role="alert">{accountError}</AccountError>}

      {/* 하단 버튼 */}
      <LogoutButton type="button" onClick={handleLogout}>
        로그아웃
      </LogoutButton>
    </PageWrapper>
  );
};

export default Mypage;
