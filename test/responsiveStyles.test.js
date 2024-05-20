function applyResponsiveStyles() {
  // viewpot size
  const viewportWidth = window.innerWidth;

  if (viewportWidth < 768) {
    // Apply styles for small screens
    document.body.style.backgroundColor = "lightblue";
  } else if (viewportWidth < 1024) {
    // Apply styles for medium screens
    document.body.style.backgroundColor = "lightgreen";
  } else {
    // Apply styles for large screens
    document.body.style.backgroundColor = "lightyellow";
  }
}

applyResponsiveStyles();

// listener to update styles when viewport is resized
window.addEventListener("resize", applyResponsiveStyles);
