import { useLayoutEffect, useMemo } from "react";
import { makeTenoxUI, MakeTenoxUIParams, Property } from "@tenoxui/core/src/js/tenoxui.esm";
import { fullProps as txProps } from "@tenoxui/property/full";
import { classes as txClasses } from "../styles/classes";
import { values as txValues } from "../styles/values";
import { merge } from "../../../../utils/merge";

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
  const config = useMemo<StylerConfig>(
    () => ({
      property: { ...txProps, ...property } as Property,
      values: merge(txValues, values),
      classes: merge(txClasses, classes),
    }),
    [property, values, classes]
  );

  useLayoutEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("*[class]");
    elements.forEach((element) => {
      const tenoxui = new makeTenoxUI({ ...config, element });
      tenoxui.useDOM();
    });

    applyStyles(
      {
        body: "h-mn-100vh bg-slate-100 c-slate-900",
        "p, a": "c-slate-800 ls--0.030em lh-1.4",
      },
      config
    );
  }, [config]);

  return config;
}
