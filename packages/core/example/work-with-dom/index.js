document.addEventListener("DOMContentLoaded", () => {
  const element = document.querySelector(".my-element");

  new makeTenoxUI({
    element,
    property: {
      bg: "background",
      text: "color",
      p: "padding"
    }
  });

  // adding the styles from classList
  element.classList.add("bg-red");
  // or using setAttribute
  element.setAttribute("class", "bg-blue hover:bg-red text-white p-1rem");
});
