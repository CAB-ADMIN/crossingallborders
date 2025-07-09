document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const ministryGroup = document.querySelector("#ministry");
  const getInvolvedGroup = document.querySelector("#get-involved"); 
  const newsEventsGroup = document.querySelector("#news-events"); 
  const morePagesGroup = document.querySelector("#more-pages");
  const groups = [ministryGroup, getInvolvedGroup, newsEventsGroup, morePagesGroup];



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