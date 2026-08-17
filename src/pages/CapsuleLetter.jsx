import styled from "styled-components";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100svh;
  background: var(--color-ivory-paper);
  padding: 40px 20px;
  max-width: 420px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: var(--font-english);
  font-size: var(--font-size-title);
  font-weight: 400;
  color: var(--color-walnut);
  margin: 0 0 12px;
`;

const Description = styled.p`
  font-family: var(--font-kopub);
  font-size: var(--font-size-body);
  font-weight: 300;
  color: var(--color-soft-taupe);
  text-align: center;
  margin: 0;
`;

const CapsuleLetter = () => {
  return (
    <PageWrapper>
      <Title>Capsule Letter</Title>
      <Description>타임캡슐 편지가 도착했습니다.</Description>
    </PageWrapper>
  );
};

export default CapsuleLetter;
