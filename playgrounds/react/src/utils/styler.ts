import { useLayoutEffect, useMemo } from "react";
import { makeTenoxUI, MakeTenoxUIParams } from "@tenoxui/core/src/ts/tenoxui.esm";
import { defaultProps as txProps } from "@tenoxui/property/src/esm/default.js";
import { classes as txClasses } from "../styles/classes";
import { values as txValues } from "../styles/values";
import { merge } from "../../../../utils/merge";

export function styler({ property = {}, values = {}, classes = {} } = {}) {
  const config = useMemo<Omit<MakeTenoxUIParams, "element">>(
    () => ({
      property: { bsize: "boxSizing", ...txProps, ...property },
      values: merge(txValues, values),
      classes: merge(txClasses, classes),
    }),
    [property, values, classes]
  );

  useLayoutEffect(() => {
    // document.querySelectorAll<HTMLElement>("*[class]").forEach(element => { new makeTenoxUI({ element, ...config }).useDOM()});

    // Read all elements's class attribute
    const elements = document.querySelectorAll<HTMLElement>("*[class]");

    // Applying tenoxui instance for every single elements
    elements.forEach((element) => {
      const tenoxui = new makeTenoxUI({ element, ...config });

      // Adding DOM functionality
      tenoxui.useDOM();
    });

    // Adding global styles for body and p tags
    document.body.setAttribute("class", "h-mn-100vh bg-neutral-100 c-neutral-900");
    document.querySelectorAll("p").forEach((p) => {
      p.classList.add("c-neutral-700");
    });
  }, [config]);

  return config;
}
