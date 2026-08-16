import styled from "styled-components";

const Button = styled.button`
  display: flex;
  width: 100%;
  min-height: 51px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-inline: auto;
  border: 0;
  border-radius: 30px;
  padding: 11px 20px;
  overflow: hidden;
  background: var(--color-walnut);
  color: #fff;
  font: 300 18px/1 var(--font-kopub);
  white-space: nowrap;
  cursor: pointer;
  transition:
    filter 160ms ease,
    transform 160ms ease;

  &:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid var(--color-walnut);
    outline-offset: 3px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (max-width: 360px) {
    min-height: 48px;
    padding-inline: 16px;
    font-size: 16px;
  }
`;

const IconSlot = styled.span`
  display: grid;
  width: 25px;
  height: 25px;
  flex: 0 0 25px;
  place-items: center;

  svg,
  img {
    display: block;
    width: 25px;
    height: 25px;
  }
`;

const PrimaryButton = ({ children, icon, type = "button", ...buttonProps }) => {
  return (
    <Button type={type} {...buttonProps}>
      {icon && <IconSlot aria-hidden="true">{icon}</IconSlot>}
      <span>{children}</span>
    </Button>
  );
};

export default PrimaryButton;
