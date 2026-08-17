import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import bag1 from "../assets/bag1.png";
import bag2 from "../assets/bag2.png";
import profileImg from "../assets/profile.png";
import userImg from "../assets/user.png";
import lockImg from "../assets/lock.png";

/* ───────────────────── 더미 데이터 ───────────────────── */
const DUMMY_USER = {
  nickname: "쫀냐미",
  name: "김OO",
  userId: "journey0811",
  password: "●●●●●●",
};

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
    name: "Mcm Small Drawstring Backpack",
    openDate: "2035.7.12",
  },
];

/* ───────────────────── 애니메이션 ───────────────────── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

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

const ItemCard = styled.div`
  position: relative;
  background: var(--color-cream);
  border: 1px solid var(--color-soft-taupe);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ItemImageWrapper = styled.div`
  width: 100%;
  height: 160px;
  background: var(--color-soft-taupe);
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

const ItemOpenRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: opacity 0.4s ease, transform 0.4s ease;
`;

const LockImg = styled.img`
  width: 14px;
  height: 14px;
  object-fit: contain;
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
  font-size: 11px;
  font-weight: 300;
  color: var(--color-walnut);
`;

/* ── DEMO ONLY - 해커톤 발표용, 추후 제거 예정 ── */
const DemoPreviewButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: transform 200ms ease;

  &:hover {
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 2px;
  }
`;

const OpenedState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: ${fadeIn} 0.4s ease;
`;

const DDayText = styled.span`
  font-family: var(--font-kopub);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-walnut);
`;

const OpenButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 18px;
  border-radius: 14px;
  background: var(--color-walnut);
  color: var(--color-ivory-paper);
  font-family: var(--font-english);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.5px;
  cursor: pointer;
`;
/* ── END DEMO ONLY ── */

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

const EditButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--color-soft-taupe);
  display: flex;
  align-items: center;
  margin-left: auto;

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 2px;
    border-radius: 4px;
  }
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

const WithdrawLink = styled.button`
  background: none;
  border: none;
  font-family: var(--font-kopub);
  font-size: 12px;
  color: var(--color-soft-taupe);
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
  padding: 0;
  align-self: center;
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

const PencilIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// DEMO ONLY - 해커톤 발표용, 추후 제거 예정
const ClockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--color-walnut)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/* ───────────────────── 컴포넌트 ───────────────────── */
const Mypage = () => {
  const navigate = useNavigate();

  // DEMO ONLY - 해커톤 발표용, 추후 제거 예정
  // 각 카드별 오픈 상태를 독립적으로 관리
  const [openedItems, setOpenedItems] = useState({});

  const handleDemoOpen = (itemId) => {
    setOpenedItems((prev) => ({ ...prev, [itemId]: true }));
  };
  // END DEMO ONLY

  const handleLogout = () => {
    localStorage.removeItem("saved_user_id");
    navigate("/login");
  };

  const handleWithdraw = () => {
    if (window.confirm("정말 탈퇴하시겠습니까?")) {
      navigate("/login");
    }
  };

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
          가입하신 정보를 확인하고,
          <br />
          언제든 새롭게 바꿔보세요.
        </SubtitleText>
      </SubtitleRow>

      {/* 프로필 카드 */}
      <ProfileCard>
        <ProfileAvatar>
          <ProfileAvatarImg src={profileImg} alt="프로필" />
        </ProfileAvatar>
        <ProfileInfo>
          <ProfileName>{DUMMY_USER.nickname} 님</ProfileName>
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
        <SectionTitle>나의 컬렉션 ({DUMMY_COLLECTION.length})</SectionTitle>
        <ViewAllLink to="/mypage/collection">전체보기 &gt;</ViewAllLink>
      </SectionHeader>

      <CollectionGrid>
        {DUMMY_COLLECTION.map((item) => (
          <ItemCard key={item.id}>
            {/* DEMO ONLY - 해커톤 발표용, 추후 제거 예정 */}
            {!openedItems[item.id] && (
              <DemoPreviewButton
                type="button"
                onClick={() => handleDemoOpen(item.id)}
                aria-label="미리보기 (데모)"
                title="시간 빨리감기 데모"
              >
                <ClockIcon />
              </DemoPreviewButton>
            )}
            {/* END DEMO ONLY */}

            <ItemImageWrapper>
              <ItemImage src={item.image} alt={item.name} />
            </ItemImageWrapper>
            <ItemInfo>
              <ItemName>{item.name}</ItemName>

              {openedItems[item.id] ? (
                // DEMO ONLY - 오픈된 상태 UI
                <OpenedState>
                  <DDayText>D-Day</DDayText>
                  <OpenButton onClick={() => navigate("/capsule-letter")}>
                    open
                  </OpenButton>
                </OpenedState>
              ) : (
                <ItemOpenRow>
                  <LockImg src={lockImg} alt="" aria-hidden="true" />
                  <ItemOpenLabel>OPEN ON</ItemOpenLabel>
                  <ItemOpenDate>{item.openDate}</ItemOpenDate>
                </ItemOpenRow>
              )}
            </ItemInfo>
          </ItemCard>
        ))}
      </CollectionGrid>

      {/* 계정 정보 */}
      <SectionHeader>
        <SectionTitle>계정 정보</SectionTitle>
      </SectionHeader>

      <AccountCard>
        <AccountRow>
          <AccountLabel>닉네임</AccountLabel>
          <AccountValue>{DUMMY_USER.nickname}</AccountValue>
          <EditButton aria-label="닉네임 수정">
            <PencilIcon />
          </EditButton>
        </AccountRow>
        <AccountRow>
          <AccountLabel>성명</AccountLabel>
          <AccountValue>{DUMMY_USER.name}</AccountValue>
          <EditButton aria-label="성명 수정">
            <PencilIcon />
          </EditButton>
        </AccountRow>
        <AccountRow>
          <AccountLabel>아이디</AccountLabel>
          <AccountValue>{DUMMY_USER.userId}</AccountValue>
          <EditButton aria-label="아이디 수정">
            <PencilIcon />
          </EditButton>
        </AccountRow>
        <AccountRow>
          <AccountLabel>비밀번호</AccountLabel>
          <AccountValue>{DUMMY_USER.password}</AccountValue>
          <EditButton aria-label="비밀번호 수정">
            <PencilIcon />
          </EditButton>
        </AccountRow>
      </AccountCard>

      {/* 하단 버튼 */}
      <LogoutButton type="button" onClick={handleLogout}>
        로그아웃
      </LogoutButton>
      <WithdrawLink type="button" onClick={handleWithdraw}>
        회원 탈퇴
      </WithdrawLink>
    </PageWrapper>
  );
};

export default Mypage;
