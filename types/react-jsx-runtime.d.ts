/// <reference types="react" />

declare module "react/jsx-runtime" {
  import { ReactElement, ReactNode } from "react";

  export function jsx(type: any, props: object, key?: string): ReactElement;
  export function jsxs(type: any, props: object, key?: string): ReactElement;
  export function jsxDEV(
    type: any,
    props: object,
    key?: string,
    isStatic?: boolean,
    source?: { fileName: string; lineNumber: number; columnNumber: number },
    self?: any,
  ): ReactElement;
  export function fragment(children: ReactNode): ReactElement;
}
