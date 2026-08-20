import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    /* Figma color styles */
    --color-walnut: #5c4033;
    --color-soft-taupe: #b6a892;
    --color-ivory-paper: #f3ecdf;
    --color-cream: #F8F2EA;

    /* Figma font families */
    --font-english: "Fraunces 72pt", "Fraunces", serif;
    --font-kopub: "KoPubWorldBatang", "KoPub Batang", serif;

    /* Figma text styles */
    --font-size-english: 20px;
    --font-size-body: 12px;
    --font-size-title: 20px;
    --font-size-button: 18px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: clip;
  }

  body {
    margin: 0;
    font-family: var(--font-kopub);
    color: var(--color-walnut);
    background: var(--color-ivory-paper);
  }

  main,
  header,
  footer,
  section,
  article,
  nav,
  form,
  fieldset,
  div,
  label {
    min-width: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  span,
  strong,
  small,
  label,
  button,
  a,
  li,
  dd,
  dt {
    max-width: 100%;
    overflow-wrap: anywhere;
    word-break: keep-all;
  }

  button,
  input,
  select,
  textarea {
    min-width: 0;
    max-width: 100%;
    font-family: inherit;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    max-width: 100%;
  }

  @media (max-width: 380px) {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    span,
    strong,
    small,
    label,
    button,
    a,
    li,
    dd,
    dt {
      white-space: normal !important;
    }
  }

  /* 영문 20 */
  .text-english {
    font-family: var(--font-english);
    font-size: var(--font-size-english);
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0;
  }

  /* Kopub _본문 */
  .text-body {
    font-family: var(--font-kopub);
    font-size: var(--font-size-body);
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0;
  }

  /* Kopub_제목 */
  .text-title {
    font-family: var(--font-kopub);
    font-size: var(--font-size-title);
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0;
  }

  /* KoPub_버튼 */
  .text-button {
    font-family: var(--font-kopub);
    font-size: var(--font-size-button);
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0;
  }
`;

export default GlobalStyles;
