/// <reference types="react" />

// React type declarations for React 19
declare module "react" {
  export import JSX = JSXInternal;
  export {
        Children, cloneElement, Component, createContext,
        createElement,
        createFactory,
        createRef,
        forwardRef, Fragment, isValidElement,
        lazy,
        memo, Profiler,
        PureComponent, startTransition, StrictMode,
        Suspense, useCallback,
        useContext,
        useDebugValue,
        useDeferredValue,
        useEffect,
        useId,
        useImperativeHandle,
        useInsertionEffect,
        useLayoutEffect,
        useMemo,
        useReducer,
        useRef,
        useState,
        useSyncExternalStore,
        useTransition
    } from "react";

  // JSX namespace for React 19
  namespace JSXInternal {
    interface Element extends React.ReactElement {}
    interface ElementClass extends React.Component {}
    interface ElementType extends React.ElementType {}
    interface ElementAttributesProperty {}
    interface ElementChildrenAttribute {}

    interface IntrinsicAttributes extends React.Attributes {}
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}

    type IntrinsicElements = {
      [K in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[K] &
        React.HTMLAttributes<K>;
    } & {
      [K in keyof SVGElementTagNameMap]: SVGElementTagNameMap[K] &
        React.SVGAttributes<K>;
    };
  }
}
