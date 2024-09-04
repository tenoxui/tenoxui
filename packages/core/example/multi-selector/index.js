document.addEventListener("DOMContentLoaded", () => {
  const selectors = document.querySelectorAll(".my-element");

  selectors.forEach(selector => {
    const styler = new makeTenoxUI({
      element: selector,
      property: { bg: "background", text: "color" }
    });

    styler.applyMultiStyles("bg-blue text-red");
  });
});
