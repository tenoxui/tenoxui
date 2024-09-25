import { styler } from "@styler";
import Typography, { typography } from "../../../ui/typography";

import ShowElement from "./_components/style-showcase";
import ShadowElement from "@ui/shadow";

const styles = () => {
  styler();
  return (
    <>
      <header className="tw-balance">
        <h1 className={typography.heading1}>Styling with TenoxUI</h1>
        <p className={`mt-1rem ${typography.paragraph}`}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur, aut.
        </p>
      </header>

      <ShowElement
        title="Typography"
        desc="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur, aut."
        slug="/ui/typography.tsx"
      >
        <Typography />
      </ShowElement>
      <ShowElement
        title="Shadow"
        desc="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur, aut."
        slug="/ui/shadow.tsx"
        className="fx-w-wrap center"
      >
        <ShadowElement />
      </ShowElement>
    </>
  );
};

export default styles;
