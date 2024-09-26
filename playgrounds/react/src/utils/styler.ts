import { useLayoutEffect, useMemo } from "react";
import { makeTenoxUI, MakeTenoxUIParams, Property } from "@tenoxui/core";
import { fullProps as txProps } from "@tenoxui/property/full";
import { properties } from "../styles/properties";
import { classes as txClasses } from "../styles/classes";
import { values as txValues } from "../styles/values";
import { merge } from "../../../../utils/merge";
import { useLocation } from "react-router-dom";
type StylerConfig = Omit<MakeTenoxUIParams, "element">;
interface StylesObject {
  [selector: string]: string;
}

function applyStyles(styledElement: StylesObject, txConfig: StylerConfig) {
  Object.entries(styledElement).forEach(([selector, styles]) => {
    document.querySelectorAll(selector).forEach((element) => {
      new makeTenoxUI({ ...txConfig, element: element as HTMLElement }).applyMultiStyles(styles);
    });
  });
}

export function styler({ property = {}, values = {}, classes = {} } = {}) {
  const location = useLocation();
  const config = useMemo<StylerConfig>(
    () => ({
      property: { ...txProps, ...properties, ...property } as Property,
      values: merge(txValues, values),
      classes: merge(txClasses, classes),
      breakpoints: [
        { name: "max-xs", max: 374.9 },
        { name: "xs", min: 375 },
        { name: "max-sm", max: 578.9 },
        { name: "sm", min: 579 },
        { name: "max-md", max: 639.9 },
        { name: "md", min: 640 },
        { name: "max-lg", max: 767.9 },
        { name: "lg", min: 768 },
        { name: "max-xl", max: 991.9 },
        { name: "xl", min: 992 },
        { name: "max-2xl", max: 1279.9 },
        { name: "2xl", min: 1280 },
        { name: "max-3xl", max: 1439.9 },
        { name: "3xl", min: 1440 },
      ],
    }),
    [property, values, classes]
  );

  useLayoutEffect(() => {
    // Apply style resetter on top
    applyStyles(
      {
        body: "h-mn-100vh bg-slate-100 c-slate-900",
        "p, a": "c-slate-800 ls--0.030em lh-1.4",
      },
      config
    );

    // So the other class names can override the reseter styles
    const elements = document.querySelectorAll<HTMLElement>("*[class]");
    elements.forEach((element) => {
      const tenoxui = new makeTenoxUI({ ...config, element: element as HTMLElement });
      tenoxui.useDOM();
    });
  }, [config]);

  return config;
}
