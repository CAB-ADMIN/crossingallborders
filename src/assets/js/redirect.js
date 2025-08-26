const domains = [
  "crossingallbordersministry.com"
]

const reasons = [
  "The website you attempted to load has been moved."
]



document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search)

  if (params && params.get("redirect") === "true" && localStorage.getItem("hideRedirect") != "true") {
    const from = params.get("from") ? `<strong>From:</strong> ${domains[parseInt(params.get("from"))]}` : "Unknown";
    const page = params.get("page") ? `<strong>Page:</strong> ${params.get("page")}` : "Unknown";
    const reason = params.get("reason") ? `<strong>Reason:</strong> ${reasons[parseInt(params.get("reason"))]}` : "Unknown";
    const pageContainer = document.getElementsByClassName("page-container");
    console.log(pageContainer);
    const redirectDiv = document.createElement("div");
    redirectDiv.className = "redirect-container"
    redirectDiv.innerHTML = `
    <h3>You've Been Redirected!</h3>
    <p id="stats">${from}</p>
    <p id="stats"><strong>To:</strong> crossingallborders.org</p>
    <p id="stats">${page}</p>
    <p id="stats">${reason}</p>

    <p>Welcome to our updated website! Everything should work as expected. Please click below to continue.</p>

    <label id="hideRedirectLabel">
      <input type="checkbox" id="hideRedirect" />
      <i>Don't show this message again</i>
    </label>

    <a id="hideRedirectButton" class="btn"><button id="middle">Continue to crossingallborders.org</button></a>
    `
    pageContainer[0].prepend(redirectDiv);
    const dismissButton = document.getElementById("hideRedirectButton");
    dismissButton.addEventListener("click", () => {
      const cleanURL = window.location.pathname;
      window.history.replaceState({}, "", cleanURL);
      const hideInFuture = document.getElementById("hideRedirect").checked;
      localStorage.setItem("hideRedirect", hideInFuture);
      redirectDiv.remove();
    });
  } else {
    const cleanURL = window.location.pathname;
    window.history.replaceState({}, "", cleanURL); 
    //^ Clean up url anyway for SEO.
  }
})

//http://localhost:8888/volunteer/?redirect=true&from=0&page=about-us&reason=0