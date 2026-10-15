
document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // 1. ANIMACIÓN INICIAL DEL LOGO
  // Se muestra una sola vez por sesión
  // ========================================

  const introScreen = document.getElementById("introScreen");

  if (introScreen) {
    const introYaMostrado = sessionStorage.getItem("introMostrado");

    if (introYaMostrado) {
      // Si ya apareció en esta sesión, eliminarlo inmediatamente
      introScreen.remove();
    } else {
      // Guardar que ya se mostró
      sessionStorage.setItem("introMostrado", "true");

      // Eliminar la pantalla al terminar la animación
      const finishIntro = () => {
        if (introScreen.parentNode) {
          introScreen.remove();
        }
      };

      introScreen.addEventListener("animationend", finishIntro, {
        once: true
      });

      // Respaldo por si la animación no termina
      setTimeout(finishIntro, 3500);
    }
  }

  // ========================================
  // 2. MENÚ DE NAVEGACIÓN PARA MÓVILES
  // ========================================

  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-links");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");

      const menuAbierto = navMenu.classList.contains("active");
      menuToggle.setAttribute("aria-expanded", menuAbierto);
    });

    // Cerrar el menú al seleccionar un enlace
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener("click", (event) => {
      if (
        !navMenu.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ========================================
  // 3. ANIMACIONES AL DESPLAZARSE POR LA PÁGINA
  // ========================================

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    // Mostrar el contenido si el navegador no admite IntersectionObserver
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // ========================================
  // 4. BOTÓN PARA VOLVER ARRIBA
  // ========================================

  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    // Mostrar u ocultar el botón según el desplazamiento
    const updateBackToTop = () => {
      if (window.scrollY > 400) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", updateBackToTop);
    updateBackToTop();

    // Regresar al inicio al pulsar el botón
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});
