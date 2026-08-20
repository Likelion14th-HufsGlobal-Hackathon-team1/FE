import { useEffect, useRef, useState } from "react";
import {
  TbArrowLeft,
  TbArrowsDiagonal2,
  TbPencil,
  TbRotate2,
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import bagImage from "../assets/bag1.png";
import PrimaryButton from "../components/Button";
import CharmKeyring from "../components/CharmKeyring";
import { apiGet, apiPatch } from "../utils/api";
import { readStoredJson, STORAGE_KEYS, writeStoredJson } from "../utils/storage";

const createInitialLayout = (charms) => {
  const savedLayout = readStoredJson(STORAGE_KEYS.charmLayout);

  return charms.reduce((layout, charm, index) => {
    const key = charm.instanceId ?? `${charm.id}-${index}`;
    const hasServerPosition = Number.isFinite(charm.positionX)
      && Number.isFinite(charm.positionY)
      && Number.isFinite(charm.scale)
      && charm.scale > 0;
    layout[key] = hasServerPosition
      ? {
          x: charm.positionX * 100,
          y: charm.positionY * 100,
          rotation: Number.isFinite(charm.rotation) ? charm.rotation : 0,
          size: charm.scale * 330,
        }
      : savedLayout[key] ?? {
          x: 28 + (index % 4) * 15,
          y: 43 + (index % 2) * 19,
          rotation: index % 2 === 0 ? -6 : 6,
          size: 54,
        };
    return layout;
  }, {});
};

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
    width: 29px;
    height: 29px;
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 3px;
  }
`;

const Intro = styled.section`
  margin-top: 18px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const PencilIcon = styled(TbPencil)`
  width: 24px;
  height: 24px;
`;

const Title = styled.h1`
  margin: 0;
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
  font: 300 12px/1.35 var(--font-kopub);
`;

const BagStage = styled.div`
  position: relative;
  width: min(330px, 88vw);
  aspect-ratio: 198 / 144;
  align-self: center;
  margin-top: clamp(42px, 10vh, 78px);
  touch-action: none;
  user-select: none;
`;

const BagImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
`;

const PlacedCharm = styled.button`
  position: absolute;
  z-index: ${({ $selected }) => ($selected ? 3 : 2)};
  top: ${({ $y }) => $y}%;
  left: ${({ $x }) => $x}%;
  display: grid;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  box-sizing: border-box;
  place-items: center;
  border: ${({ $selected }) => ($selected ? "1px dashed var(--color-walnut)" : "0")};
  border-radius: 50%;
  padding: 3px;
  background: transparent;
  cursor: grab;
  transform: translate(-50%, -50%) rotate(${({ $rotation }) => $rotation}deg);
  touch-action: none;

  &:active {
    cursor: grabbing;
  }

  > span {
    position: absolute;
    inset: 4px;
    display: block;
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    object-fit: contain;
    pointer-events: none;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.16));
  }
`;

const EmptyMessage = styled.p`
  margin: 58px 0 20px;
  color: var(--color-soft-taupe);
  font: 300 14px/1.5 var(--font-kopub);
  text-align: center;
`;

const CharmShelf = styled.div`
  display: flex;
  min-height: 76px;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  overflow-x: auto;
  padding: 5px 2px 8px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CharmThumbnail = styled.button`
  position: relative;
  display: grid;
  width: 62px;
  height: 62px;
  box-sizing: border-box;
  flex: 0 0 62px;
  place-items: center;
  border: 1px solid
    ${({ $selected }) => ($selected ? "var(--color-walnut)" : "transparent")};
  border-radius: 14px;
  padding: 5px;
  overflow: hidden;
  background: ${({ $selected }) =>
    $selected ? "rgba(182, 168, 146, 0.25)" : "transparent"};
  cursor: pointer;

  > span {
    position: absolute;
    inset: 5px;
    display: block;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    object-fit: contain;
  }
`;

const Controls = styled.div`
  display: grid;
  min-height: 74px;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 3px;
  padding: 10px 12px;
  border-radius: 16px;
  background: rgba(182, 168, 146, 0.18);
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
`;

const Control = styled.label`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 7px;
  color: #090a0a;
  font: 300 12px/1 var(--font-kopub);

  svg {
    width: 18px;
    height: 18px;
  }

  input {
    width: 100%;
    accent-color: var(--color-walnut);
  }
`;

const SaveButton = styled(PrimaryButton)`
  margin-top: clamp(48px, 10svh, 96px);

  @media (max-height: 720px) {
    margin-top: 40px;
  }
`;

const SaveError = styled.p`
  margin: 10px 0 0;
  color: #b42318;
  font: 300 12px/1.4 var(--font-kopub);
  text-align: center;
`;

const JourneyDesign = () => {
  const navigate = useNavigate();
  const stageRef = useRef(null);
  const [charms, setCharms] = useState([]);
  const [layout, setLayout] = useState({});
  const [selectedKey, setSelectedKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let active = true;
    const loadCharms = async () => {
      try {
        console.info("[Charm 꾸미기] GET /api/charms 요청을 전송합니다.");
        const { data } = await apiGet("/charms");
        const list = Array.isArray(data?.charms)
          ? data.charms.map((charm) => ({
              ...charm,
              id: charm.charmId,
              imageUrl: charm.aiImageUrl,
            })).filter((charm) => charm.id != null && charm.imageUrl)
          : [];
        if (!active) return;
        setCharms(list);
        setLayout(createInitialLayout(list));
        setSelectedKey(list[0] ? `${list[0].id}-0` : "");
        console.info(`[Charm 꾸미기] 배치할 Charm ${list.length}개를 불러왔습니다.`);
      } catch (loadError) {
        console.error("[Charm 꾸미기 오류] Charm 목록 조회에 실패했습니다.", loadError);
      }
    };
    loadCharms();
    return () => { active = false; };
  }, []);

  const getCharmKey = (charm, index) =>
    charm.instanceId ?? `${charm.id}-${index}`;

  const updateSelectedCharm = (changes) => {
    if (!selectedKey) return;
    setLayout((current) => ({
      ...current,
      [selectedKey]: { ...current[selectedKey], ...changes },
    }));
  };

  const handlePointerDown = (event, key) => {
    event.preventDefault();
    setSelectedKey(key);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event, key) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const x = Math.min(88, Math.max(12, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(82, Math.max(20, ((event.clientY - bounds.top) / bounds.height) * 100));
    setLayout((current) => ({
      ...current,
      [key]: { ...current[key], x, y },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError("");
    try {
      console.info(`[Charm 배치 1/2] Charm ${charms.length}개의 위치 저장을 시작합니다.`);
      await Promise.all(charms.map((charm, index) => {
        const key = getCharmKey(charm, index);
        const itemLayout = layout[key];
        if (!itemLayout) return Promise.resolve();
        return apiPatch(`/charms/${charm.id}/position`, {
          positionX: itemLayout.x / 100,
          positionY: itemLayout.y / 100,
          rotation: itemLayout.rotation,
          scale: itemLayout.size / 330,
        });
      }));
      writeStoredJson(STORAGE_KEYS.charmLayout, layout);
      console.info("[Charm 배치 2/2] 모든 Charm 위치를 서버에 저장했습니다.");
      navigate("/journey/charm", { state: { createdCharms: charms } });
    } catch (error) {
      console.error("[Charm 배치 오류] Charm 위치 저장에 실패했습니다.", error);
      setSaveError(error.message || "Charm 위치를 저장하지 못했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedLayout = layout[selectedKey];

  return (
    <Page>
      <BackButton type="button" aria-label="이전 페이지" onClick={() => navigate(-1)}>
        <TbArrowLeft aria-hidden="true" />
      </BackButton>

      <Intro>
        <TitleRow>
          <PencilIcon aria-hidden="true" />
          <Title>Charm 꾸미기</Title>
        </TitleRow>
        <DescriptionRow>
          <AccentLine aria-hidden="true" />
          <Description>
            완성된 Charm을 자유롭게 배치해,
            <br />
            나만의 스타일로 MCM을 꾸며보세요.
          </Description>
        </DescriptionRow>
      </Intro>

      {charms.length > 0 ? (
        <>
          <BagStage ref={stageRef}>
            <BagImage src={bagImage} alt="MCM 가방" draggable="false" />
            {charms.map((charm, index) => {
              const key = getCharmKey(charm, index);
              const itemLayout = layout[key];
              if (!itemLayout) return null;
              return (
                <PlacedCharm
                  key={key}
                  type="button"
                  aria-label={`Charm ${index + 1} 이동`}
                  $selected={selectedKey === key}
                  $x={itemLayout.x}
                  $y={itemLayout.y}
                  $size={itemLayout.size}
                  $rotation={itemLayout.rotation}
                  onPointerDown={(event) => handlePointerDown(event, key)}
                  onPointerMove={(event) => handlePointerMove(event, key)}
                >
                  <CharmKeyring src={charm.imageUrl} />
                </PlacedCharm>
              );
            })}
          </BagStage>

          <CharmShelf aria-label="생성된 Charm 목록">
            {charms.map((charm, index) => {
              const key = getCharmKey(charm, index);
              return (
                <CharmThumbnail
                  key={key}
                  type="button"
                  $selected={selectedKey === key}
                  aria-label={`Charm ${index + 1} 선택`}
                  onClick={() => setSelectedKey(key)}
                >
                  <CharmKeyring src={charm.imageUrl} />
                </CharmThumbnail>
              );
            })}
          </CharmShelf>
        </>
      ) : (
        <EmptyMessage>생성된 Charm이 없습니다.</EmptyMessage>
      )}

      <Controls $visible={Boolean(selectedLayout)} aria-label="Charm 편집 도구">
        <Control>
          <TbRotate2 aria-hidden="true" />
          <input
            type="range"
            min="-180"
            max="180"
            value={selectedLayout?.rotation ?? 0}
            aria-label="Charm 회전"
            onChange={(event) =>
              updateSelectedCharm({ rotation: Number(event.target.value) })
            }
          />
        </Control>
        <Control>
          <TbArrowsDiagonal2 aria-hidden="true" />
          <input
            type="range"
            min="30"
            max="100"
            value={selectedLayout?.size ?? 54}
            aria-label="Charm 크기"
            onChange={(event) =>
              updateSelectedCharm({ size: Number(event.target.value) })
            }
          />
        </Control>
      </Controls>

      <SaveButton
        disabled={charms.length === 0 || isSaving}
        onClick={handleSave}
      >
        {isSaving ? "저장 중..." : "저장"}
      </SaveButton>
      {saveError && <SaveError role="alert">{saveError}</SaveError>}
    </Page>
  );
};

export default JourneyDesign;
