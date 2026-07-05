const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = [...document.querySelectorAll(".nav a")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Loader ---------- */
const loader = document.querySelector(".loader");
const hideLoader = () => loader && loader.classList.add("done");
window.addEventListener("load", () => setTimeout(hideLoader, 550));
setTimeout(hideLoader, 3500); // safety net

/* ---------- Header / scroll progress ---------- */
const progressBar = document.querySelector(".scroll-progress span");
let ticking = false;
const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 30);
    if (progressBar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    }
    ticking = false;
};
window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

/* ---------- Mobile nav ---------- */
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

/* ---------- Reveal on scroll (with stagger) ---------- */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ---------- Active nav link ---------- */
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
    });
}, { rootMargin: "-40% 0px -52%", threshold: 0 });
document.querySelectorAll("main section[id]").forEach(s => sectionObserver.observe(s));

/* ---------- Animated counters ---------- */
const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
};
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
        }
    });
}, { threshold: .6 });
document.querySelectorAll("[data-count]").forEach(el => countObserver.observe(el));

/* ---------- Lightbox ---------- */
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
document.querySelectorAll(".lightbox-trigger").forEach(button => {
    button.addEventListener("click", () => {
        lightboxImage.src = encodeURI(button.dataset.image);
        lightbox.showModal();
    });
});
document.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", e => { if (e.target === lightbox) lightbox.close(); });

document.querySelector("#year").textContent = new Date().getFullYear();

/* ---------- Certifications: show more / less ---------- */
const certGrid = document.querySelector(".certificate-grid");
const certToggle = document.querySelector(".cert-toggle");
if (certGrid && certToggle) {
    const hiddenCount = certGrid.querySelectorAll(".cert-extra").length;
    certToggle.addEventListener("click", () => {
        const expanded = certGrid.classList.toggle("expanded");
        certToggle.setAttribute("aria-expanded", String(expanded));
        certToggle.innerHTML = expanded
            ? "Show less <span>−</span>"
            : `See all certifications <span>+${hiddenCount}</span>`;
        if (!expanded) certGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

/* ---------- Cursor spotlight + magnetic + tilt (pointer-capable only) ---------- */
if (finePointer && !reduceMotion) {
    const spotlight = document.querySelector(".spotlight");
    window.addEventListener("pointermove", (e) => {
        spotlight.classList.add("active");
        spotlight.style.transform = `translate(${e.clientX - 270}px, ${e.clientY - 270}px)`;
    }, { passive: true });

    // Magnetic buttons
    document.querySelectorAll(".button, .nav-cta").forEach(el => {
        el.addEventListener("pointermove", (e) => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            el.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
        });
        el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });

    // 3D tilt on cards
    document.querySelectorAll(".skill-card, .fact-card, .stat").forEach(card => {
        card.addEventListener("pointermove", (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `perspective(900px) rotateX(${-py * 5}deg) rotateY(${px * 5}deg) translateY(-4px)`;
        });
        card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });

    // Hero parallax
    const profile = document.querySelector(".profile-frame img");
    if (profile) {
        window.addEventListener("pointermove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 14;
            const y = (e.clientY / window.innerHeight - 0.5) * 14;
            profile.style.transform = `scale(1.03) translate(${x}px, ${y}px)`;
        }, { passive: true });
    }
}

/* ---------- Starfield / constellation canvas ---------- */
const canvas = document.getElementById("starfield");
if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let width, height, particles, raf;
    const mouse = { x: -999, y: -999 };

    const setup = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        const count = Math.min(Math.floor((width * height) / 16000), 110);
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            r: Math.random() * 1.4 + 0.4
        }));
    };

    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // mouse repulsion
            const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
            const md = Math.hypot(mdx, mdy);
            if (md < 130) { p.x += (mdx / md) * 1.4; p.y += (mdy / md) * 1.4; }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(64, 223, 139, .55)";
            ctx.fill();
        }
        // connecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = dx * dx + dy * dy;
                if (dist < 13000) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(64, 223, 139, ${0.12 * (1 - dist / 13000)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        raf = requestAnimationFrame(draw);
    };

    window.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener("pointerout", () => { mouse.x = -999; mouse.y = -999; });
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setup, 150);
    });
    // pause when tab hidden
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) { cancelAnimationFrame(raf); }
        else { raf = requestAnimationFrame(draw); }
    });

    setup();
    draw();
}
