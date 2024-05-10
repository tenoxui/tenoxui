<p align="center">
<a href="https://tenoxui.web.app/">
<img src="https://tenoxui.web.app/img/tenoxui.svg" alt="TenoxUI Logo" width='300' height='300'
 >
</a>
</p>
<h1 align="center">TenoxUI v0.9</h1>
<p align="center">
A CSS Framework without css file :D
<br>
<a href="https://tenoxui.web.app/docs/start">Full Documentation</a>
</p>

<h2>About</h2>
<p>
TenoxUI stands as a nimble Utility-First CSS framework meticulously crafted to elevate web development by enhancing speed and efficiency. It delivers a curated collection of customizable styles and embraces a utility-first approach, simplifying and expediting the styling process for developers.
</p>

<h2>Feature</h2>

<ul>
  <li>
    <strong> Fast and Efficient: </strong> The majority of classes are managed
    through JavaScript, ensuring a lightweight and fast user experience.
  </li>
  <br />
  <li>
    <strong> No CSS: </strong> No more generated CSS files. Elevate your design
    journey as styles are seamlessly applied directly to each element,
    unleashing simplicity and efficiency.
  </li>
  <br />
  <li>
    <strong> Utility-First Approach: </strong> Seamlessly apply pre-defined
    utility classes to elements by simply invoking their associated classes,
    fostering a utility-first approach to styling.
  </li>
  <br />
  <li>
    <strong> Tailored to Your Taste: </strong> Easily customize your unique
    style with user-friendly configuration options, providing a personalized and
    bespoke design experience.
  </li>
</ul>

<h2>Getting Started</h2>

<h3>Installation</h3>

Using npm:

```bash
npm i tenoxui --save-dev
```

Using CDN :

```html
<script src="https://cdn.jsdelivr.net/npm/tenoxui@latest/dist/js/tui.min.js"></script>
```

<h3>Documentation</h3>

Here's a simple usage of tenoxui css :

<h4>Using Class</h4>

```html
<div class="box-200px flex-parent-center br-8px bg-#0d0d0d p-2rem">
  <h1 class="fs-1.5rem fw-500 tc-lightgreen">Hello World!</h1>
</div>
```

<h4>Using Function</h4>

1. `makeStyle` function

Using selector and the class names as parameter, you can change the style of the element :

```js
makeStyle("body", "bg-#0d0d0d tc-white p-20px");
```

Note: `makeStyle` only give styles to one selector

2. `makeStyles` function

Using object as parameter to give styles into element :

```js
makeStyles({
  body: "bg-#0d0d0d tc-white p-20px",
  nav: "position-fixed top-0 p-10px",
  "h1.logo": "fs-1rem fw-600",
  // Try re-usable class
  ".card": "display-flex flex-parent-center",
  ".flex": "display-flex",
  ".center": "flex-parent-center",
});
```

Using re-usable class:

```html
<div class="flex center">...</div>
```

The `div` above will have same style as :

```css
div {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

3. Nested Style

`makeStyles` also support nested styles because it's defined as an object.

HTML:

```html
<div class="container">
  <div class="card">
    <h2 class="title">Hello</h2>
    <p class="desc">Lorem ipsum dolor sit amet consectetur.</p>
  </div>
  <div class="card">
    <h2 class="title">World</h2>
    <p class="desc">Lorem ipsum dolor sit amet consectetur.</p>
  </div>
</div>
```

JavaScript :

```js
makeStyles({
  body: "bg-#0d0d0d tc-white p-20px",
  ".container": {
    "": "display-flex gap-20px jc-center", // Empty string will treated as parent's style
    // Card class will only applied when its inside container class, outside it will not styled
    ".card": {
      "": "p-20px br-8px bg-lightblue",
      ".title": "fs-1.4rem fw-600",
      ".desc": "fs-14px fw-500 lh-1.4 ta-justify",
    },
  },
});
```

The css style will be like this :

```css
.container {
  display: flex;
  gap: 20px;
  justify-content: center;

  .card {
    padding: 20px;
    border-radius: 8px;
    background: lightblue;

    .title {
      font-size: 1.4rem;
      font-weight: 600;
    }

    .desc {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
      text-align: justify;
    }
  }
}
```

<h4>More</h4>

Full documentation on [TenoxUI Documentation](https://tenoxui.web.app).
