document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".tenox");

  elements.forEach(element => {
    new makeTenoxUI({
      element,
      property: {
        // regular type and property
        bg: "background",
        text: "color",
        p: "padding",
        mt: "marginTop",
        tr: "transition",

        /*
         * Property with custom value.
         * The inputted value will replace the `{value}`. And you can add more than one `value` .
         */
        gradient: {
          property: "background-image",
          value: "linear-gradient(to right, {value}, blue)"
        },
        padd: {
          property: "padding",
          value: "10px {value} 20px {value}"
        },
        // or you can just apply the styles directly
        "my-bg": {
          property: "background",
          value: "red"
        },
        // and of course it work with something like this :
        // 1. multiple properties
        size: {
          property: ["width", "height"],
          value: "{value}px"
          // example: `size-10` same as `size-10px`
        },

        // 2. single variable
        "set-bg": {
          property: "--my-bg",
          value: "{value}"
          // example: `set-bg-red`, `set-bg-[rgb(255,0,0)]`, `set-bg-blue hover:set-bg-red`
        },
        // 3. multiple propeties
        bgHehe: {
          property: ["--my-bg", "--maybe-bg"],
          value: "{value}"
        }
      },

      // you can also define custom value with `values` parameter
      values: {
        // this is accessible for global types and properties
        primary: "#ccf654",
        thing: "blue",
        // if you define the exact type from property field, you can add custom value for that exact type. And the code below, it will accessible only for `text` type or color property
        text: {
          // you can pass other value within exact types, and it will override the global values
          primary: "red",
          thing: "yellow",
          amber: "orange"
        }
      }
    });
  });
});
