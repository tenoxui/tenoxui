document.addEventListener("DOMContentLoaded", () => {
  const selector = document.querySelector(".my-element");
  const styler = new makeTenoxUI({
    element: selector,
    property: { bg: "background", text: "color" }
  });

  styler.applyMultiStyles("bg-blue text-red");
});
