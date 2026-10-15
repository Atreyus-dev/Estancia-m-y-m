
/* =========================================
   1. ELEMENTOS PRINCIPALES
========================================= */

const introScreen = document.getElementById("introScreen");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const backToTop = document.getElementById("backToTop");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

/* =========================================
   2. ANIMACIÓN DE BIENVENIDA
========================================= */

if (introScreen) {
  const finishIntro = () => {
    introScreen.classList.add("intro-finished");

    // Retiramos la pantalla después de terminar
    // la transición para no bloquear los clics.
    introScreen.addEventListener(
      "animationend",
      (event) => {
        if (event.animationName === "intro-exit") {
          introScreen.remove();
        }
      },
      { once: true }
    );

    // Respaldo por si el navegador no dispara
    // animationend como se espera.
    window.setTimeout(() => {
      introScreen.remove();
    }, reducedMotion.matches ? 100 : 3200);
  };

  if (reducedMotion.matches) {
    finishIntro();
  } else {
    // La animación CSS controla la duración.
    // Escuchamos el evento para retirar la pantalla.
    introScreen.addEventListener(
      "animationend",
      (event) => {
        if (event.animationName === "intro-exit") {
          introScreen.remove();
        }
      },
      { once: true }
    );
  }
}

/* =========================================
   3. MENÚ MÓVIL
========================================= */

function closeMenu() {
  if (!menuToggle || !mainNav) return;

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");

  mainNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  if (!menuToggle || !mainNav) return;

  const isOpen =
    menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Abrir menú" : "Cerrar menú"
  );

  mainNav.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", toggleMenu);

  // Cerrar el menú al elegir una sección.
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Cerrar con Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Cerrar si se vuelve a una pantalla grande.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 680) {
      closeMenu();
    }
  });
}

/* =========================================
   4. APARICIÓN DE SECCIONES AL DESPLAZARSE
========================================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  // Compatibilidad con navegadores sin IntersectionObserver
  // y dispositivos que solicitan movimiento reducido.
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

/* =========================================
   5. BOTÓN VOLVER ARRIBA
========================================= */

function updateBackToTop() {
  if (!backToTop) return;

  if (window.scrollY > 450) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
}

window.addEventListener("scroll", updateBackToTop, {
  passive: true
});

updateBackToTop();

/* =========================================
   6. CIERRE DEL MENÚ AL TOCAR FUERA
========================================= */

document.addEventListener("click", (event) => {
  if (!menuToggle || !mainNav) return;

  const isOpen =
    menuToggle.getAttribute("aria-expanded") === "true";

  const clickedInsideMenu = mainNav.contains(event.target);
  const clickedToggle = menuToggle.contains(event.target);

  if (isOpen && !clickedInsideMenu && !clickedToggle) {
    closeMenu();
  }
});
