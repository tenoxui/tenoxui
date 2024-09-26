import { styler } from "@styler";
import { transformClasses } from "../../../../../../utils/classes-converter";

export const buttonStyles = transformClasses({
  btn: {
    // all: "unset",
    border: "unset",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "35px",
    padding: "6px 10px",
    fontSize: "16px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s, color 0.2s",
  },
  "btn-sm": {
    height: "28px",
    padding: "4px 8px",
    fontSize: "14px",
  },
  "btn-lg": {
    padding: "12px 24px",
    fontSize: "18px",
  },
});

const Button = ({ children, size = "default", className = "", ...props }) => {
  const sizeClass = size === "small" ? "btn-sm" : size === "large" ? "btn-lg" : "";

  // Assign button styles to the styler
  styler({ classes: buttonStyles });

  return (
    <button className={`btn ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
