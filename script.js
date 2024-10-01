document.querySelectorAll(".block.cursor-pointer").forEach((label) => {
  label.addEventListener("click", () => {
    const content = label.nextElementSibling;
    const icon = label.querySelector(".toggle-icon");
    if (content.classList.contains("hidden")) {
      content.classList.remove("hidden");
      content.classList.add("visible");
      icon.textContent = "×";
    } else {
      content.classList.remove("visible");
      content.classList.add("hidden");
      icon.textContent = "+";
    }
    icon.classList.toggle("rotate-90");
  });
});
