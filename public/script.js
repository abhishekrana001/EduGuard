// WAIT UNTIL DOM LOAD
document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // MENU TOGGLE
    // =========================
    window.toggleMenu = function () {
        const nav = document.getElementById("navLinks");
        if (nav) nav.classList.toggle("show");
    };

    // =========================
    // SCROLL TO SECTION
    // =========================
    window.scrollToSection = function (id) {
        const section = document.getElementById(id);

        if (section) {
            const yOffset = -70; // navbar offset
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({
                top: y,
                behavior: "smooth"
            });
        }
    };

    // =========================
    // PAGE NAVIGATION (IMPORTANT 🔥)
    // =========================
    window.goToChat = function () {
        window.location.href = "chat.html"; // public folder
    };

    window.goToChecker = function () {
        window.location.href = "checker.html";
    };

    // =========================
    // SCROLL REVEAL ANIMATION
    // =========================
    function revealOnScroll() {
        const reveals = document.querySelectorAll(".reveal");

        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;

            if (elementTop < windowHeight - 100) {
                el.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // run on load

    // =========================
    // AUTO CLOSE MOBILE MENU
    // =========================
    document.querySelectorAll("#navLinks li").forEach(item => {
        item.addEventListener("click", () => {
            const nav = document.getElementById("navLinks");
            if (nav) nav.classList.remove("show");
        });
    });

    // =========================
    // PARTICLES EFFECT
    // =========================
    const container = document.querySelector(".particles");

    if (container) {
        const count = 25; // optimized

        for (let i = 0; i < count; i++) {
            let dot = document.createElement("div");
            dot.classList.add("dot");

            dot.style.left = Math.random() * 100 + "vw";
            dot.style.top = Math.random() * 100 + "vh";
            dot.style.animationDuration = (Math.random() * 5 + 3) + "s";
            dot.style.opacity = Math.random();

            container.appendChild(dot);
        }
    }

});