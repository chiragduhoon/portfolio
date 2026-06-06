const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = [...document.querySelectorAll(".nav a")];

window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
}, { passive: true });

menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
    document.body.classList.toggle("menu-open", !open);
});

navLinks.forEach(link => link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
}));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
    });
}, { rootMargin: "-40% 0px -52%", threshold: 0 });
document.querySelectorAll("main section[id]").forEach(section => sectionObserver.observe(section));

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
document.querySelectorAll(".lightbox-trigger").forEach(button => {
    button.addEventListener("click", () => {
        lightboxImage.src = encodeURI(button.dataset.image);
        lightbox.showModal();
    });
});
document.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) lightbox.close();
});

document.querySelector("#year").textContent = new Date().getFullYear();
