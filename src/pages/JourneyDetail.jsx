import { TbArrowLeft } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const MOCK_DETAIL = {
  location: "Seoul, Korea",
  date: "2026. 08. 11 (TUE)",
  memo: "",
};

const Page = styled.main`
  width: min(100%, 480px);
  min-height: calc(100svh - 105px - env(safe-area-inset-bottom));
  margin: 0 auto;
  padding: 18px clamp(20px, 7.7vw, 37px) 90px;
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

const Hero = styled.section`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 27px;
  text-align: center;
`;

const CharmSpace = styled.div`
  width: min(135px, 35vw);
  height: min(135px, 35vw);
`;

const CharmImage = styled.img`
  display: block;
  width: min(135px, 35vw);
  height: min(135px, 35vw);
  object-fit: contain;
  filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.12));
`;

const Location = styled.p`
  margin: 9px 0 0;
  font: 300 14px/1.2 var(--font-kopub);
`;

const DateText = styled.p`
  margin: 2px 0 0;
  font: 300 13px/1.2 var(--font-kopub);
`;

const Divider = styled.hr`
  width: 100%;
  margin: 16px 0 10px;
  border: 0;
  border-top: 1px solid var(--color-soft-taupe);
`;

const Section = styled.section`
  margin-top: 29px;
`;

const MemoSection = styled(Section)`
  margin-top: 0;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font: 300 14px/1 var(--font-kopub);
`;

const Memo = styled.div`
  min-height: 48px;
  margin-top: 11px;
  border: 1px solid var(--color-walnut);
  border-radius: 9px;
  padding: 11px 13px;
  font: 300 14px/1.5 var(--font-kopub);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const JourneyDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedCharm = state?.selectedCharm;

  return (
    <Page>
      <BackButton type="button" aria-label="이전 페이지" onClick={() => navigate(-1)}>
        <TbArrowLeft aria-hidden="true" />
      </BackButton>

      <Hero>
        {selectedCharm?.imageUrl ? (
          <CharmImage src={selectedCharm.imageUrl} alt="선택한 Charm" />
        ) : (
          <CharmSpace aria-hidden="true" />
        )}
        <Location>{MOCK_DETAIL.location}</Location>
        <DateText>{MOCK_DETAIL.date}</DateText>
      </Hero>

      <Divider />

      <MemoSection>
        <SectionTitle>Charm 메모</SectionTitle>
        <Memo>{MOCK_DETAIL.memo}</Memo>
      </MemoSection>

      <Section>
        <SectionTitle>MCM과 함께한 여행 사진</SectionTitle>
      </Section>
    </Page>
  );
};

export default JourneyDetail;
