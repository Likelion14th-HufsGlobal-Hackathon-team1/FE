import { useEffect, useState } from "react";
import { TbArrowLeft, TbSparkles } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import PrimaryButton from "../components/Button";
import { apiPost } from "../utils/api";

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

const SparklesIcon = styled(TbSparkles)`
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
  font: 300 12px/1.45 var(--font-kopub);
  white-space: nowrap;

  @media (max-width: 340px) {
    font-size: 11px;
  }
`;

const GeneratedSection = styled.section`
  margin-top: 35px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #090a0a;
  font: 300 14px/1 var(--font-kopub);
`;

const SectionDescription = styled.p`
  margin: 11px 0 0;
  color: var(--color-soft-taupe);
  font: 300 12px/1.45 var(--font-kopub);
`;

const CharmOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(8px, 3vw, 16px);
  margin-top: 20px;
`;

const CharmOption = styled.button`
  display: grid;
  width: 100%;
  height: 115px;
  place-items: center;
  border: 1px solid
    ${({ $selected }) => ($selected ? "var(--color-soft-taupe)" : "transparent")};
  border-radius: 15px;
  padding: 8px;
  background: ${({ $selected }) =>
    $selected ? "rgba(182, 168, 146, 0.3)" : "transparent"};
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    transform 160ms ease;

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 3px;
  }
`;

const CharmImage = styled.img`
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 99px;
  object-fit: contain;
  object-fit: contain;
`;

const shimmer = keyframes`
  from { background-position: 120% 0; }
  to { background-position: -120% 0; }
`;

const ImagePlaceholder = styled.span`
  display: block;
  width: 68%;
  height: 78%;
  border-radius: 14px;
  background: linear-gradient(
    100deg,
    rgba(182, 168, 146, 0.2) 20%,
    rgba(182, 168, 146, 0.45) 45%,
    rgba(182, 168, 146, 0.2) 70%
  );
  background-size: 220% 100%;
  animation: ${shimmer} 1.5s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const MemoSection = styled.section`
  margin-top: 23px;
`;

const Memo = styled.textarea`
  display: block;
  width: 100%;
  height: 162px;
  margin-top: 11px;
  resize: vertical;
  border: 1px solid var(--color-walnut);
  border-radius: 15px;
  padding: 14px;
  background: transparent;
  color: #090a0a;
  font: 300 14px/1.5 var(--font-kopub);

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 2px;
  }
`;

const CompleteButton = styled(PrimaryButton)`
  margin-top: clamp(48px, 10svh, 96px);

  @media (max-height: 720px) {
    margin-top: 40px;
  }
`;

const SubmitError = styled.p`
  margin: 12px 0 0;
  color: #b42318;
  font: 300 12px/1.45 var(--font-kopub);
  text-align: center;
`;

const JourneyMake = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const candidates = Array.isArray(state?.candidates) ? state.candidates : [];
  const journeyData = state?.journeyData;
  const [selectedCharmId, setSelectedCharmId] = useState(
    candidates[0]?.candidateId ?? "",
  );
  const [memo, setMemo] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.info(`[Journey Make] 전달받은 AI Charm 후보: ${candidates.length}개`);
  }, [candidates.length]);

  const handleComplete = async () => {
    const selectedCharm = candidates.find(
      (charm) => charm.candidateId === selectedCharmId,
    );
    if (!selectedCharm || !journeyData) {
      setError("여정 또는 Charm 후보 정보가 없습니다. 여정 인증부터 다시 진행해주세요.");
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      console.info("[Charm 저장 1/2] POST /api/charms 요청을 전송합니다.", { candidateId: selectedCharm.candidateId });
      const { data, status } = await apiPost("/charms", {
        productId: journeyData.productId,
        country: journeyData.country,
        city: journeyData.city,
        memo: memo.trim(),
        travelDate: journeyData.travelDate,
        selectedImageUrl: selectedCharm.imageUrl,
        imageUrls: journeyData.imageUrls,
      });
      console.info(`[Charm 저장 2/2] Charm 저장이 완료되었습니다. HTTP ${status}`, { charmId: data.charmId });
      navigate("/journey/charm");
    } catch (saveError) {
      console.error("[Charm 저장 오류] Charm 저장에 실패했습니다.", saveError);
      setError(saveError.message || "Charm 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Page>
      <BackButton type="button" aria-label="이전 페이지" onClick={() => navigate(-1)}>
        <TbArrowLeft aria-hidden="true" />
      </BackButton>

      <Intro>
        <TitleRow>
          <SparklesIcon aria-hidden="true" />
          <Title>Charm 생성</Title>
        </TitleRow>
        <DescriptionRow>
          <AccentLine aria-hidden="true" />
          <Description>
            여행의 순간과 MCM의 감성을 담아,
            <br />
            세상에 하나뿐인 Charm을 만나보세요.
          </Description>
        </DescriptionRow>
      </Intro>

      <GeneratedSection>
        <SectionTitle>AI 생성 Charm</SectionTitle>
        <SectionDescription>
          인증한 여행지를 바탕으로 AI가 생성한 Charm이에요.
          <br />
          마음에 드는 Charm을 하나 선택해주세요.
        </SectionDescription>

        <CharmOptions role="radiogroup" aria-label="AI 생성 Charm 선택">
          {candidates.map((charm, index) => {
            const selected = selectedCharmId === charm.candidateId;
            return (
              <CharmOption
                key={charm.candidateId}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`AI 생성 Charm ${index + 1}`}
                $selected={selected}
                onClick={() => setSelectedCharmId(charm.candidateId)}
              >
                {charm.imageUrl ? (
                  <CharmImage src={charm.imageUrl} alt="" />
                ) : (
                  <ImagePlaceholder aria-hidden="true" />
                )}
              </CharmOption>
            );
          })}
        </CharmOptions>
      </GeneratedSection>

      <MemoSection>
        <SectionTitle as="label" htmlFor="charm-memo">
          Charm 메모
        </SectionTitle>
        <Memo
          id="charm-memo"
          value={memo}
          maxLength={500}
          onChange={(event) => setMemo(event.target.value)}
        />
      </MemoSection>

      <CompleteButton
        icon={<TbSparkles />}
        disabled={!selectedCharmId || isSaving}
        onClick={handleComplete}
      >
        {isSaving ? "Charm 저장 중..." : "Charm 생성 완료"}
      </CompleteButton>
      {error && <SubmitError role="alert">{error}</SubmitError>}
    </Page>
  );
};

export default JourneyMake;
