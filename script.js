const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = [...document.querySelectorAll(".nav a")];

/* Header border once the page has scrolled past a sentinel, no scroll listener needed */
const sentinel = document.createElement("div");
sentinel.style.cssText = "position:absolute;top:24px;height:1px;width:1px;pointer-events:none;";
document.body.prepend(sentinel);
new IntersectionObserver(([entry]) => {
    header.classList.toggle("scrolled", !entry.isIntersecting);
}).observe(sentinel);

/* Mobile nav */
const setMenu = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
};
menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
navLinks.forEach(link => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* Reveal on enter, once */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
    });
}, { threshold: .15, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* Active nav link */
const sections = [...document.querySelectorAll("main section[id]")];
const setActive = () => {
    const line = window.innerHeight * 0.4;
    const current = sections.find(s => {
        const r = s.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
    }) || sections[0];
    navLinks.forEach(link => link.classList.toggle("active", link.hash === `#${current.id}`));
};
const sectionObserver = new IntersectionObserver(setActive, { rootMargin: "-40% 0px -52%", threshold: 0 });
sections.forEach(s => sectionObserver.observe(s));

/* Lightbox with caption from the thumbnail's alt text */
const lightbox = document.querySelector(".lightbox");
if (lightbox) {
    const lightboxImage = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector("figcaption");
    document.querySelectorAll(".lightbox-trigger").forEach(button => {
        const thumb = button.querySelector("img");
        const caption = thumb ? thumb.alt : "";
        if (!button.hasAttribute("aria-label")) button.setAttribute("aria-label", `View larger: ${caption}`);
        button.addEventListener("click", () => {
            lightboxImage.src = encodeURI(button.dataset.image);
            lightboxImage.alt = caption;
            lightboxCaption.textContent = caption;
            lightbox.showModal();
        });
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", e => { if (e.target === lightbox) lightbox.close(); });
    lightbox.addEventListener("close", () => { lightboxImage.src = ""; });
}

/* Certifications: show all / show fewer */
const certGrid = document.querySelector(".cert-grid");
const certToggle = document.querySelector(".cert-toggle");
if (certGrid && certToggle) {
    const total = certGrid.querySelectorAll(".cert").length;
    const shown = total - certGrid.querySelectorAll(".cert-extra").length;
    certToggle.addEventListener("click", () => {
        const expanded = certGrid.classList.toggle("expanded");
        certToggle.setAttribute("aria-expanded", String(expanded));
        certToggle.textContent = expanded ? `Show fewer` : `Show all ${total} certifications`;
        if (!expanded) certGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    if (shown === total) certToggle.parentElement.hidden = true;
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
