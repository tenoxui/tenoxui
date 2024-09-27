# TenoxUI Framework

It's a CSS framework, trust me. 😉

## Overview

TenoxUI makes styling as easy as pie; and who doesn't like pie? It's super easy to add styles with very minimal configuration. Let's dive in!

### ReactJS

Here’s how you can use TenoxUI in React in just a few lines of code:

```jsx
import { useLayoutEffect } from "react";
import tenoxui from "tenoxui";

const App = () => {
  useLayoutEffect(() => {
    tenoxui({
      // shorthand: cssProperty
      bg: "background",
      text: "text",
    });
  }, []);

  return <h1 className="bg-green text-white">Hello World!</h1>;
};

export default App;
```

That’s all it takes to use TenoxUI in your ReactJS app.

### HTML

Plain HTML? No problem! 🤨🙌

```html
<html>
  <head>
    <title>TenoxUI</title>
    <script src="/path/to/tenoxui"></script>
  </head>
  <body class="bg-yellow">
    <div class="bg-red hover:bg-blue">Hello World!</div>
    <script>
      tenoxui({
        // shorthand: cssProperty
        bg: "background",
        text: "color",
      });
    </script>
  </body>
</html>
```

Just a few classes and you’re set to go!

## Installation

### Using NPM

```bash
npm i tenoxui
```

Or, use its core instead:

```bash
npm i @tenoxui/core
```

Done! ✨

### CDN

Prefer a CDN for quick setup? Easy peasy:

```html
<script src="https://cdn.jsdelivr.net/npm/tenoxui"></script>
```

Or, if you just want the core:

```html
<script src="https://cdn.jsdelivr.net/npm/@tenoxui/core"></script>
```

Boom! You’re ready to build your awesome apps! 💥

## Explore Further

### `@tenoxui/core` Overview

Want to explore the core features? Here’s how to use the `@tenoxui/core` package in React:

```jsx
import { useLayoutEffect } from "react";
import { makeTenoxUI } from "@tenoxui/core";

const App = () => {
  useLayoutEffect(() => {
    document.querySelectorAll("*[class]").forEach((element) => {
      new makeTenoxUI({
        element,
        property: {
          bg: "background",
          text: "color",
        },
      }).useDOM();
    });
  }, []);

  return <h1 className="bg-red text-white">Hello World!</h1>;
};

export default App;
```

A bit _uhh_ but it works!

### `@tenoxui/property` Overview

Don’t have time to create your own properties library? Try `@tenoxui/property`; Our `pre-built` properties library.

#### Installation

Install with NPM:

```bash
npm i @tenoxui/property
```

Or, grab it via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@tenoxui/property"></script>
```

#### Usage

There are two variants you can get, if you prefer smaller and on-demand/commonly used, use `default` variant. You want to use more rich properties, like `filter`, `transform`, and so on; try `full` variant instead.

`esmodule` usage:

```js
import { property } from "@tenoxui/property";

// full properties
import { property } from "@tenoxui/property/full";
```

For `commonjs`, try:

```js
const { property } = require("@tenoxui/property");

// full properties
const { property } = require("@tenoxui/property/full");
```

#### React Example

Still React? Here's a quick setup:

```jsx
import { useLayoutEffect } from "react";
import { makeTenoxUI } from "@tenoxui/core";
import { property } from "@tenoxui/property";

const App = () => {
  useLayoutEffect(() => {
    document.querySelectorAll("*[class]").forEach((element) => {
      const tenoxui = new makeTenoxUI({ element, property });
      tenoxui.useDOM();
    });
  }, []);

  return <h1 className="bg-red text-white">Hello World!</h1>;
};

export default App;
```

#### Plain HTML

You can use the property library in plain HTML too:

```html
<html>
  <head>
    <title>TenoxUI</title>
    <script src="/path/to/tenoxui"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tenoxui/property/dist/umd/full.min.js"></script>
  </head>
  <body class="bg-yellow">
    <div class="bg-red hover:bg-blue">Hello World!</div>
    <script>
      use({ property });
      // or
      tenoxui(property);
    </script>
  </body>
</html>
```

That's it! With TenoxUI and its extended libraries, you're now equipped to build stylish and responsive UIs effortlessly. Ready to level up your web game? Let’s go! 🎉
