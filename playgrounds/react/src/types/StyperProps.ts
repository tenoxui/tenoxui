import { Property, DefinedValue, Classes, Breakpoint, MakeTenoxUIParams } from "@tenoxui/core/src/js/tenoxui.esm.ts";

export type StylerProps = Omit<MakeTenoxUIParams, "element"> & {
  property?: Partial<Property>;
  values?: Partial<DefinedValue>;
  classes?: Partial<Classes>;
  breakpoints?: Breakpoint[];
};
