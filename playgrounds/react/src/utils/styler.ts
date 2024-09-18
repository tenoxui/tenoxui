import { useLayoutEffect } from "react";
import { makeTenoxUI } from "@tenoxui/core";
import { defaultProps as txProps } from "@tenoxui/property/dist/esm/default.js";

// const txProps = { p: "padding" };

export function styler(property?) {
  // Using the `useLayoutEffect` hook to ensure the effect runs immediately after DOM mutations 😜
  useLayoutEffect(() => {
    // Query all elements that have a `class` attribute
    document.querySelectorAll("*[class]").forEach((element) => {
      // Create new instance for every elements
      const tenoxui = new makeTenoxUI({ element, property: { ...txProps, ...property } });

      // Using DOM functionality
      tenoxui.useDOM();
    });

    // Add direct styles for body tag
    document.body.setAttribute("class", "h-mn-100vh bg-#101314 c-#f3f4f4");
  }, []);
}
