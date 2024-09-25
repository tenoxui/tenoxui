import { styler } from "@styler";
import { createRGBColors } from "../../../../utils/generate-color";
import { colors } from "@/styles/color";
import { typography } from "@ui/typography";

export const shadowClasses = {
  // create colors for shadow classes
  // e.g. _ shadow-neutral-100, shadow-primary-500
  "--shadow-color": createRGBColors(colors, "shadow"),
  // box shadow classes
  boxShadow: {
    "shadow-sm": "0 1px 2px 0 rgb(var(--shadow-color, 0 0 0) / var(--shadow-opa, 0.05))",
    shadow:
      "0 1px 3px 0 rgb(var(--shadow-color, 0 0 0) / var(--shadow-opa, 0.1)), 0 1px 2px -1px rgb(var(--shadow-color, 0 0 0) / var(--shadow-opa, 0.1))",
    "shadow-md":
      "0 4px 6px -1px rgb(var(--shadow-color, 0 0 0) / var(--shadow-opa, 0.1)), 0 2px 4px -2px rgb(var(--shadow-color, 0 0 0) / var(--shadow-opa, 0.1))",
    "shadow-lg":
      "0 10px 15px -3px rgb(var(--shadow-color, 0 0 0) / var(--shadow-opa, 0.1)), 0 4px 6px -4px rgb(var(--shadow-color, 0 0 0) / var(--shadow-opa, 0.1))",
    "shadow-xl":
      "0 20px 25px -5px rgb(var(--shadow-color, 0 0 0) / var(--shadow-opa, 0.1)), 0 8px 10px -6px rgb(var(--shadow-color, 0 0 0) / var(--shadow-opa, 0.1))",
    "shadow-2xl": "0 25px 50px -12px rgb(var(--shadow-color, 0 0 0) / var(--shadow-opa, 0.25))",
    "shadow-inner": "inset 0 2px 4px 0 rgb(var(--shadow-color, 0 0 0) / var(--shadow-opa, 0.05))",
    "shadow-none": "0 0 #0000",
  },
};

const Shadow = () => {
  // assign shadow classes to the styler
  styler({ classes: shadowClasses });

  const box = "w-100px h-100px bg-slate-100 br-8px center code fs-12px";

  return (
    <>
      <div className={`${box} shadow-2xl`}>shadow-2xl</div>
      <div className={`${box} shadow-xl`}>shadow-xl</div>
      <div className={`${box} shadow-lg`}>shadow-lg</div>
      <div className={`${box} shadow-md`}>shadow-md</div>
      <div className={`${box} shadow`}>shadow</div>
      <div className={`${box} shadow-inner`}>shadow-inner</div>
      <div className={`${box} shadow-lg [--shadow-opa]-0.6 shadow-secondary-500`}>...</div>
    </>
  );
};

export default Shadow;
