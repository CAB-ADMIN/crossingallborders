document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navGroups = document.querySelector(".nav-groups");
  let groups = []
  navGroups.querySelectorAll(".group").forEach(group => {
    groups.push(group);
  })


  groups.forEach(group => {
    group.addEventListener("click", (event) => {
      groups.forEach(g => {
        if (g !== group) {
          try {
            const groupLinks = document.querySelector(`#group-links-${g.id}`);
            groupLinks.classList.remove("open");
          } catch (error) {
            console.error(`Error toggling group links for ${g.id}:`, error);
          }
        }
      });
      const groupLinks = document.querySelector(`#group-links-${group.id}`);
      event.stopPropagation();
      groupLinks.classList.toggle("open");
    });
  });


  hamburger.addEventListener("click", () => {

    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
});


document.addEventListener("click", (event) => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navGroups = document.querySelector(".nav-groups");

  if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  }

  const groups = navGroups.querySelectorAll(".group");
  groups.forEach(group => {
    const groupLinks = document.querySelector(`#group-links-${group.id}`);
    if (groupLinks && groupLinks.classList.contains("open")) {
      groupLinks.classList.remove("open");
    }
  });
});

document.getElementById("theme-toggle").addEventListener("change", function() {
  const icon = document.getElementById("theme-icon");

  if (this.checked) {
    icon.classList.remove("fa-sun")
    icon.classList.add("fa-moon")
  } else {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
})