document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById("cookie-banner")
    const acceptBtn = document.getElementById("accept-cookies")
    const rejectBtn = document.getElementById("reject-cookies")

    const consent = localStorage.getItem("analyticsConsent")

    function acceptCookies() {
        localStorage.setItem("analyticsConsent", "granted")

        gtag("consent", "update", {
            analytics_storage: "granted"
        })

        banner.style.display = "none"
    }

    function rejectCookies() {
        localStorage.setItem("analyticsConsent", "denied")

        gtag("consent", "update", {
            analytics_storage: "denied"
        });

        banner.style.display = "none"
    }

    if (!consent) {
        banner.style.display = "flex"
    } else if (consent === "granted") {
        gtag("consent", "update", {
            analytics_storage: "granted"
        });

        banner.style.display = "none"
    } else {
        banner.style.display = "none"
    }

    acceptBtn?.addEventListener("click", acceptCookies)
    rejectBtn?.addEventListener("click", rejectCookies)
});