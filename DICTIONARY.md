# TenoxUI Definition and Dictionary

Explore tenoxui definition and words definition you need to know.

## Type and Property

In TenoxUI, we define a variable called `property`. This is contains many `types` and `properties` and we defined it as an object. Also, `type` and `property` are key components responsible for managing and applying styles to HTML elements dynamically. Breakdown:

- `type` : This is the key names of the of the object. It used to define the className prefix that will `trigger` the desired class that will applied to the element, such as `m`, `p`, `fs`, `fw`, `gap`, and more.

- `property` : Like it's name, this is what css property that will `triggered` using the `type` we define earlier, such as `padding`, `fontSize`, `justifyContent`, and so on. You can define it by using string or array of string if you has more than one property in one `type`. This is how you can make your type and peroperty :
  ```js
  const sample = {
    type: property,
  };
  ```
  Example:
  ```js
  const property = {
    p: "padding",
    px: ["paddingTop", "paddingBottom"],
    // more keys and values
  };
  ```
  See all tenoxui property on [Docs](https://tenoxui.web.app/docs/extras/all-class) or [GitHub](https://github.com/nousantx/tenoxui/blob/main/src/js/lib/property.js)

## TenoxUI Function

- `makeStyle` : Is a function to give a style to an element by calling the selector. Usage:

  ```js
  makeStyle(selector, styles);
  ```

  Example:

  - js :

  ```js
  makeStyle(".logo", "fs-3rem fw-600 tc-red");
  ```

  - html :

  ```html
  <h1 class="logo">Logo</h1>
  ```

- `makeStyles` : Is a function that allow you to give styles to your elements defined in an `object`. Usage:
  ```js
  makeStyles({ selector, styles });
  ```
  Example:
  - js :
  ```js
  makeStyles({
    body: "bg-black tc-white p-20px",
    section: "p-10vw mt-1rem bg-white",
    "h1.logo": "fs-3rem fw-600 tc-red",
  });
  ```
  - html :
  ```html
  <section>
    <h1 class="logo">Logo</h1>
  </section>
  ```

## TenoxUI Method

There's a few method stored in tenoxui, and its usage for styling. Here's the example usage :

```js
// element you want to select
const element = document.querySelector(".my-box");
// add your element and also the type and property you want to use.
const styler = new makeTenoxUI(element, { bg: "background" });

// finally, apply the styles
styler.applyStyles("bg-red");
```

- `applyStyle`. Is a method inside makeTenoxUI that will give style to your element through its parameter. Usage:

  ```js
  applyStyle(type, value, unit);
  ```

  Example:

  ```js
  applyStyle("p", "20", "px");
  ```

  Code above will give padding 20px to the desired element.

- `applyStyles`. Method to give element using desired classNames. Usage:

  ```js
  applyStyles(className);
  ```

  Note: applyStyles function can only applying **one** class at time. Example:

  ```js
  applyStyles("p-20px");
  ```

  Gave 20px of padding to an element

- `applyMultiStyles`. This method used to give styles using classNames, but you can stacked your className using this method. Usage:
  ```js
  applyMultiStyles(className);
  ```
  Example:
  ```js
  applyMultiStyles("p-20px m-2rem bg-red");
  ```
