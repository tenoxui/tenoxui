# TenoxUI Definition and Dictionary

Explore tenoxui definition and words definition you need to know.

## Type and Property

In TenoxUI, we define a variable called `property`. This is contains many `types` and `properties` and we defined it as an object. Also, `type` and `property` are key components responsible for managing and applying styles to HTML elements dynamically. Breakdown:

- `type` : This is the key names of the of the object. It used to define the className prefix that will trigger the desired class that will applied to the element. The examples is like:
  ```js
  let property = {
    p: "padding",
    px: ["paddingTop", "paddingBottom"],
    // more keys and values
  };
  ```

## TenoxUI Method

Differences between applyStyle, applyStyles, and applyMultiStyles

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
