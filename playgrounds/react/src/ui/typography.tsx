import { styler } from "@styler";

export const typography = {
  heading1: "fs-2.5rem fw-700 lh-1 ls--0.030em",
  heading2: "fs-2rem fw-600 lh-1 ls--0.030em",
  heading3: "fs-1.5rem fw-500 lh-1 ls--0.025em",
  heading4: "fs-1.2rem fw-500 lh-1.2 ls--0.025em",
  paragraph: "fs-1rem lh-1.2 ls--0.030em w-mx-600px"
};

const Typography = () => {
  styler();
  return (
    <>
      <h1 className={typography.heading1}>Heading One</h1>
      <h2 className={typography.heading2}>Heading Two</h2>
      <h3 className={typography.heading3}>Heading Three</h3>
      <h4 className={typography.heading4}>Heading Four</h4>
      <p className={typography.paragraph}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur, aut.</p>
    </>
  );
};

export default Typography;
