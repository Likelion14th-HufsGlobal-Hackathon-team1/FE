import { useState } from "react";
import { TbArrowLeft, TbSparkles } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import generatedCharm1 from "../assets/generated-charm-1.svg";
import generatedCharm2 from "../assets/generated-charm-2.png";
import generatedCharm3 from "../assets/generated-charm-3.png";
import PrimaryButton from "../components/Button";

// TODO: 백엔드의 AI Charm 생성 응답인 { id, imageUrl }[]로 교체합니다.
const GENERATED_CHARMS = [
  { id: "generated-charm-1", imageUrl: generatedCharm1 },
  { id: "generated-charm-2", imageUrl: generatedCharm2 },
  { id: "generated-charm-3", imageUrl: generatedCharm3 },
];

const CREATED_CHARMS_STORAGE_KEY = "onepick-created-charms";

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
  margin-top: 37px;
`;

const JourneyMake = () => {
  const navigate = useNavigate();
  const [selectedCharmId, setSelectedCharmId] = useState(
    GENERATED_CHARMS[1]?.id ?? "",
  );
  const [memo, setMemo] = useState("");

  const handleComplete = () => {
    const selectedCharm = GENERATED_CHARMS.find(
      (charm) => charm.id === selectedCharmId,
    );
    if (!selectedCharm) return;

    const createdCharm = {
      instanceId: `${selectedCharm.id}-${Date.now()}`,
      id: selectedCharm.id,
      imageUrl: selectedCharm.imageUrl,
      memo,
    };

    let createdCharms = [];
    try {
      const savedCharms = JSON.parse(
        localStorage.getItem(CREATED_CHARMS_STORAGE_KEY) ?? "[]",
      );
      if (Array.isArray(savedCharms)) createdCharms = savedCharms;
    } catch {
      createdCharms = [];
    }

    const nextCreatedCharms = [...createdCharms, createdCharm];
    localStorage.setItem(
      CREATED_CHARMS_STORAGE_KEY,
      JSON.stringify(nextCreatedCharms),
    );

    // TODO: selectedCharmId와 memo를 백엔드에 저장한 뒤 이동합니다.
    navigate("/journey/charm", {
      state: {
        createdCharms: nextCreatedCharms,
      },
    });
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
          {GENERATED_CHARMS.map((charm, index) => {
            const selected = selectedCharmId === charm.id;
            return (
              <CharmOption
                key={charm.id}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`AI 생성 Charm ${index + 1}`}
                $selected={selected}
                onClick={() => setSelectedCharmId(charm.id)}
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
        disabled={!selectedCharmId}
        onClick={handleComplete}
      >
        Charm 생성 완료
      </CompleteButton>
    </Page>
  );
};

export default JourneyMake;
