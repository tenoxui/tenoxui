# TenoxUI class and properties

## About

This is a package that contain default property for tenoxui css framework.

## How to Use

Install :

```sh
npm i tenoxui @tenoxui/property --save-dev
```

Usage :

1. Without default property :

You need to defjne your type and property manually inside as parameter for tenoxui :

```jsx
import { useLayoutEffect } from "react";
import tenoxui from "tenoxui";

const App = () => {
  useLayoutEffect(() => {
    // add tenoxui
    tenoxui({
      tc: "color",
    }); // defining types and properties one by one as you desire
  }, []);
  return <h1 className="tc-red">Hello World!</h1>;
};

export default App;
```

2. With `@tenoxui/property` :

Or, just simply use tenoxui default property and you don't need to manually added it inside your project :

```jsx
import { useLayoutEffect } from "react";
import tenoxui from "tenoxui";
import property from "@tenoxui/property";

const App = () => {
  useLayoutEffect(() => {
    // add tenoxui
    tenoxui(property); // use default property
  }, []);
  return <h1 className="tc-red">Hello World!</h1>;
};

export default App;
```

## Breakdown

What's inside `@tenoxui/property`? This package contain all class and property that user can use as default class styler for tenoxui. And this is what's it looks like :

```js
const property = {
  p: "padding",
  m: "margin",
  tc: "color",
  bg: "background",
  // more properties
};
```

And this is basically same as define each types and properties inside of `tenoxui` function as its parameter :

```js
tenoxui({
  p: "padding",
  tc: "color",
  // more properties
});
```

Or, same as `defineProps` function on `v0.8.0` below :

```js
defineProps({
  p: "padding",
  tc: "color",
  // more properties
});
```

But, `defineProps` function is deprecated from `v0.9.0+` and to add new types and properties, you can directly add it inside `tenoxui` function.

## Closing

And that's all, its just a collection of types and properties.
