const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme") || "light";
  root.setAttribute("data-theme", theme);
  if (theme === "dark") {
    themeToggle.checked = true;
  }
})

themeToggle.addEventListener("change", () => {
  const newTheme = themeToggle.checked ? "dark" : "light";
  root.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  console.log(localStorage.getItem("theme"));
});