import styled from "styled-components";

const Keyring = styled.span`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 19% 4% 4%;
  pointer-events: none;
  filter: drop-shadow(0 2px 2px rgba(71, 45, 20, 0.2));
`;

const Ring = styled.span`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 50%;
  width: 19%;
  height: 24%;
  box-sizing: border-box;
  border: clamp(1px, 0.06em, 3px) solid #b87820;
  border-radius: 50%;
  background: transparent;
  box-shadow:
    inset 1px 0 rgba(255, 238, 172, 0.9),
    1px 0 #76501d;
  transform: translateX(-50%);
`;

const Connector = styled.span`
  position: absolute;
  z-index: 3;
  top: 15%;
  left: 50%;
  width: 11%;
  height: 11%;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0cf67 0%, #ad6b18 62%, #744719 100%);
  box-shadow: inset 1px 1px rgba(255, 244, 190, 0.8);
  transform: translateX(-50%);
`;

const Frame = styled.span`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  border: clamp(2px, 0.09em, 4px) solid #b87820;
  border-radius: 18%;
  padding: 5%;
  background: #fffaf0;
  box-shadow:
    inset 0 0 0 1px rgba(255, 235, 166, 0.95),
    0 0 0 1px #704515;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 13%;
  object-fit: cover;
`;

export default function CharmKeyring({ src, alt = "", className }) {
  return (
    <Keyring className={className} aria-hidden={alt ? undefined : "true"}>
      <Ring />
      <Connector />
      <Frame>
        <Image src={src} alt={alt} draggable="false" />
      </Frame>
    </Keyring>
  );
}
