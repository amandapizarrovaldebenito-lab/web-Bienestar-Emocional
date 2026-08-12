// Este archivo contiene solo comportamiento. Todo el contenido y los textos
// visibles del sitio se encuentran directamente en los archivos HTML.

// Mantiene las URL limpias cuando el sitio se sirve por HTTP y permite revisar
// las mismas páginas abriendo index.html directamente desde el explorador.
const isLocalFilePreview = window.location.protocol === "file:";
const isNestedPage = /\/(nosotras|jornadas|experiencias|contacto)\/index\.html$/i.test(
  window.location.pathname.replace(/\\/g, "/"),
);
const siteRootUrl = isLocalFilePreview
  ? new URL(isNestedPage ? "../" : "./", window.location.href)
  : new URL("/", window.location.origin);

const resolveSiteAsset = (path) =>
  new URL(path.replace(/^\/+/, ""), siteRootUrl).href;

if (isLocalFilePreview) {
  const localPages = new Map([
    ["/", "index.html"],
    ["/nosotras/", "nosotras/index.html"],
    ["/jornadas/", "jornadas/index.html"],
    ["/experiencias/", "experiencias/index.html"],
    ["/contacto/", "contacto/index.html"],
  ]);

  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    const cleanHref = new URL(link.getAttribute("href"), "https://local.invalid");
    const localPath = localPages.get(cleanHref.pathname);
    if (!localPath) return;

    const localHref = new URL(localPath, siteRootUrl);
    localHref.search = cleanHref.search;
    localHref.hash = cleanHref.hash;
    link.href = localHref.href;
  });
}

const navToggle = document.querySelector(".nav-toggle");
const navList = document.querySelector(".nav-list");

if (navToggle && navList) {
  const navBackdrop = document.createElement("button");
  navBackdrop.type = "button";
  navBackdrop.className = "mobile-nav-backdrop";
  navBackdrop.setAttribute("aria-label", "Cerrar menú");
  navBackdrop.hidden = true;
  document.body.appendChild(navBackdrop);

  const setMobileMenuState = (isOpen) => {
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.textContent = isOpen ? "×" : "☰";
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    navList.classList.toggle("open", isOpen);
    document.body.classList.toggle("mobile-nav-open", isOpen);
    navBackdrop.hidden = !isOpen;
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMobileMenuState(!isOpen);
  });

  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMobileMenuState(false));
  });

  navBackdrop.addEventListener("click", () => setMobileMenuState(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navList.classList.contains("open")) {
      setMobileMenuState(false);
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 770) return;
    setMobileMenuState(false);
  });
}

document.querySelectorAll(".experience-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const detail = document.getElementById(
      button.getAttribute("aria-controls"),
    );
    if (!detail) return;

    const wasOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!wasOpen));
    const label = button.querySelector(".experience-toggle-label");
    const icon = button.querySelector(".experience-toggle-icon");
    if (label)
      label.textContent = wasOpen ? "Ver experiencia" : "Cerrar detalle";
    if (icon) {
      icon.src = wasOpen
        ? resolveSiteAsset(
            "imagenes/iconos/pagina%20experiencias/keyboard_arrow_down_24dp_102A56_FILL0_wght500_GRAD0_opsz24 (1).svg",
          )
        : resolveSiteAsset(
            "imagenes/iconos/pagina%20experiencias/keyboard_arrow_up_24dp_102A56_FILL0_wght500_GRAD0_opsz24.svg",
          );
    }
    detail.hidden = wasOpen;

    if (!wasOpen) {
      detail.querySelector('[tabindex="-1"]')?.focus();
      detail
        .querySelector("[data-gallery]")
        ?.dispatchEvent(new Event("gallery:resize"));
    }
  });
});

const galleryLightbox = document.querySelector("#gallery-lightbox");
const lightboxImage = galleryLightbox?.querySelector(
  ".gallery-lightbox__image",
);
const lightboxCaption = galleryLightbox?.querySelector(
  ".gallery-lightbox__caption",
);
const lightboxCounter = galleryLightbox?.querySelector(
  ".gallery-lightbox__counter",
);
const lightboxTitle = galleryLightbox?.querySelector("#gallery-lightbox-title");
let activeGalleryItems = [];
let activeGalleryIndex = 0;
let lightboxOpener = null;

const updateLightbox = () => {
  const item = activeGalleryItems[activeGalleryIndex];
  const image = item?.querySelector("img");
  if (!image || !lightboxImage || !lightboxCaption || !lightboxCounter) return;

  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = image.alt;
  lightboxCounter.textContent = `${activeGalleryIndex + 1} / ${activeGalleryItems.length}`;
};

const moveLightbox = (direction) => {
  if (!activeGalleryItems.length) return;
  activeGalleryIndex =
    (activeGalleryIndex + direction + activeGalleryItems.length) %
    activeGalleryItems.length;
  updateLightbox();
};

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const viewport = gallery.querySelector(".gallery-viewport");
  const track = gallery.querySelector(".gallery-track");
  const items = [...gallery.querySelectorAll(".gallery-item")];
  const previousButton = gallery.querySelector(".gallery-arrow--prev");
  const nextButton = gallery.querySelector(".gallery-arrow--next");
  let galleryIndex = 0;

  const visibleItems = () => {
    if (!items.length || !viewport) return 1;
    const itemWidth = items[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return Math.max(
      1,
      Math.round((viewport.clientWidth + gap) / (itemWidth + gap)),
    );
  };

  const updateGallery = () => {
    if (!track || !items.length) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = items[0].getBoundingClientRect().width + gap;
    const maxIndex = Math.max(0, items.length - visibleItems());
    galleryIndex = Math.min(galleryIndex, maxIndex);
    track.style.transform = `translateX(-${galleryIndex * step}px)`;
    if (previousButton) previousButton.disabled = galleryIndex === 0;
    if (nextButton) nextButton.disabled = galleryIndex === maxIndex;
  };

  previousButton?.addEventListener("click", () => {
    galleryIndex = Math.max(0, galleryIndex - 1);
    updateGallery();
  });

  nextButton?.addEventListener("click", () => {
    galleryIndex += 1;
    updateGallery();
  });

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (!galleryLightbox) return;
      activeGalleryItems = items;
      activeGalleryIndex = index;
      lightboxOpener = item;
      const experienceTitle = gallery
        .closest(".experience")
        ?.querySelector(".experience-main h2")
        ?.textContent?.trim();
      if (lightboxTitle)
        lightboxTitle.textContent =
          experienceTitle || "Galería de la experiencia";
      updateLightbox();
      galleryLightbox.showModal();
    });
  });

  gallery.addEventListener("gallery:resize", updateGallery);
  window.addEventListener("resize", updateGallery);
  updateGallery();
});

if (galleryLightbox) {
  galleryLightbox
    .querySelector(".gallery-lightbox__close")
    ?.addEventListener("click", () => galleryLightbox.close());
  galleryLightbox
    .querySelector(".gallery-lightbox__arrow--prev")
    ?.addEventListener("click", () => moveLightbox(-1));
  galleryLightbox
    .querySelector(".gallery-lightbox__arrow--next")
    ?.addEventListener("click", () => moveLightbox(1));
  galleryLightbox.addEventListener("click", (event) => {
    if (event.target === galleryLightbox) galleryLightbox.close();
  });
  galleryLightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
  });
  galleryLightbox.addEventListener("close", () => lightboxOpener?.focus());
}

document.querySelectorAll(".journey-programs .program-card").forEach((card) => {
  const cardLink = card.querySelector(".content > a[href]");
  if (!cardLink) return;

  card.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    cardLink.click();
  });
});

const contactForm = document.querySelector("#contact-form");

const showToast = (message, type = "success", title) => {
  const container = document.querySelector("#toast-container");
  if (!container) return;

  container.querySelectorAll(".toast").forEach((currentToast) => {
    currentToast.remove();
  });

  const activeElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const toastId = `toast-${Date.now()}`;
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.setAttribute("role", type === "error" ? "alertdialog" : "dialog");
  toast.setAttribute("aria-modal", "true");
  toast.setAttribute("aria-labelledby", `${toastId}-title`);
  toast.setAttribute("aria-describedby", `${toastId}-message`);

  const icon = document.createElement("span");
  icon.className = "toast-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = type === "error" ? "✕" : "✓";

  const content = document.createElement("div");
  content.className = "toast-content";

  const heading = document.createElement("h2");
  heading.className = "toast-title";
  heading.id = `${toastId}-title`;
  heading.textContent =
    title || (type === "error" ? "No pudimos enviar" : "Consulta enviada");

  const text = document.createElement("p");
  text.className = "toast-message";
  text.id = `${toastId}-message`;
  text.textContent =
    type === "success"
      ? "\u00a1Gracias! Tu consulta fue enviada. Te responderemos pronto."
      : message;

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "toast-close";
  closeButton.setAttribute("aria-label", "Cerrar notificación");
  closeButton.textContent = "×";

  const actionButton = document.createElement("button");
  actionButton.type = "button";
  actionButton.className = "button button--primary toast-action";
  actionButton.textContent = "Entendido";

  content.append(heading, text, actionButton);
  toast.append(closeButton, icon, content);
  container.appendChild(toast);
  container.classList.add("has-toast");
  requestAnimationFrame(() => toast.classList.add("is-visible"));

  let isDismissing = false;
  const dismiss = () => {
    if (isDismissing) return;
    isDismissing = true;
    container.removeEventListener("click", handleContainerClick);
    document.removeEventListener("keydown", handleToastKeydown);
    toast.classList.remove("is-visible");
    const removeToast = () => {
      toast.remove();
      if (!container.querySelector(".toast")) {
        container.classList.remove("has-toast");
      }
      activeElement?.focus();
    };
    toast.addEventListener("transitionend", removeToast, { once: true });
    setTimeout(removeToast, 400);
  };

  const handleContainerClick = (event) => {
    if (event.target === container) dismiss();
  };

  const handleToastKeydown = (event) => {
    if (event.key === "Escape" && container.classList.contains("has-toast")) {
      dismiss();
    }
  };

  closeButton.addEventListener("click", dismiss);
  actionButton.addEventListener("click", dismiss);
  container.addEventListener("click", handleContainerClick);
  document.addEventListener("keydown", handleToastKeydown);
  setTimeout(() => actionButton.focus(), 260);
};

if (contactForm) {
  const status = contactForm.querySelector(".form-status");
  const showValidationMessage = () => {
    if (status) {
      status.textContent =
        "Revisa los campos obligatorios indicados antes de enviar.";
      status.classList.remove("is-success");
      status.classList.add("is-error");
    }
  };

  contactForm
    .querySelector('[type="submit"]')
    ?.addEventListener("click", () => {
      if (contactForm.matches(":invalid")) showValidationMessage();
    });
  contactForm.addEventListener("invalid", showValidationMessage, {
    capture: true,
  });
  contactForm.addEventListener("input", () => {
    if (!contactForm.matches(":invalid") && status) {
      status.textContent = "";
      status.classList.remove("is-success", "is-error");
    }
  });
  const emailJsPublicKey = contactForm.dataset.emailjsPublicKey;
  const emailJsServiceId = contactForm.dataset.emailjsServiceId;
  const emailJsTemplateId = contactForm.dataset.emailjsTemplateId;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('[type="submit"]');

    const notConfigured =
      !emailJsPublicKey || !emailJsServiceId || !emailJsTemplateId;

    if (notConfigured || typeof emailjs === "undefined") {
      if (status) status.textContent = "";
      showToast(
        "El envío aún no está configurado. Verifica las claves de EmailJS.",
        "error",
      );
      return;
    }

    submitButton.disabled = true;
    if (status) status.textContent = "Enviando tu consulta…";

    emailjs
      .sendForm(
        emailJsServiceId,
        emailJsTemplateId,
        contactForm,
        { publicKey: emailJsPublicKey },
      )
      .then(
        () => {
          showToast(
            "¡Gracias! Tu consulta fue enviada correctamente. Te responderemos en un plazo de 24 a 48 horas hábiles.",
            "success",
          );
          contactForm.reset();
        },
        (error) => {
          console.error("EmailJS:", error);
          showToast(
            "No pudimos enviar tu mensaje. Inténtalo nuevamente o escríbenos a contacto@jornadasbienestar.cl",
            "error",
          );
        },
      )
      .finally(() => {
        submitButton.disabled = false;
        if (status) status.textContent = "";
      });
  });
}
