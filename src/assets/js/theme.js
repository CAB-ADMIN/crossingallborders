const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme") || "light";
  changeIcon(theme);
  root.setAttribute("data-theme", theme);
  if (theme === "dark") {
    themeToggle.checked = true;
  }
})

themeToggle.addEventListener("change", () => {
  const newTheme = themeToggle.checked ? "dark" : "light";
  root.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

});

function changeIcon(theme) {
  const icon = document.getElementById("theme-icon");

  if (theme === "dark") {
    icon.classList.remove("fa-sun")
    icon.classList.add("fa-moon")
  } else {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
}

