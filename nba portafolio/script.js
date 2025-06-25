// Smooth scrolling para los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Efecto de aparición al hacer scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observar elementos para animaciones
document.querySelectorAll(".api-card, .step, .tool-category").forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(20px)"
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(el)
})

// Efecto hover para las tarjetas API
document.querySelectorAll(".api-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.boxShadow = "0 20px 50px rgba(242, 102, 2, 0.4)"
  })

  card.addEventListener("mouseleave", function () {
    this.style.boxShadow = "none"
  })
})

// Efecto parallax suave para el video de fondo
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset

  // Parallax para video del hero
  const heroVideo = document.querySelector(".hero-video")
  if (heroVideo && scrolled < window.innerHeight) {
    heroVideo.style.transform = `translateY(${scrolled * 0.5}px)`
  }

  // Parallax para la sección de datos
  const dataSection = document.querySelector(".data-section")
  if (dataSection) {
    const rect = dataSection.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const yPos = -(scrolled - dataSection.offsetTop) * 0.3
      dataSection.style.backgroundPosition = `center ${yPos}px`
    }
  }
})

// Funcionalidad de tabs
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab")

      // Remover clase active de todos los botones y contenidos
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Agregar clase active al botón clickeado y su contenido correspondiente
      button.classList.add("active")
      document.getElementById(targetTab).classList.add("active")
    })
  })
})

// Animación de la barra de probabilidad
document.addEventListener("DOMContentLoaded", () => {
  const probabilityBars = document.querySelectorAll(".probability-fill")

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target
        const width = bar.style.width
        bar.style.width = "0%"
        setTimeout(() => {
          bar.style.width = width
        }, 500)
      }
    })
  })

  probabilityBars.forEach((bar) => barObserver.observe(bar))
})

// Contador animado para estadísticas
function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)

  const timer = setInterval(() => {
    start += increment
    element.textContent = Math.floor(start)

    if (start >= target) {
      element.textContent = target
      clearInterval(timer)
    }
  }, 16)
}

// Activar contadores cuando sean visibles
document.addEventListener("DOMContentLoaded", () => {
  const statNumbers = document.querySelectorAll(".stat-number")

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target
        const text = element.textContent
        const number = Number.parseInt(text.replace(/\D/g, ""))

        if (number) {
          animateCounter(element, number)
        }

        statsObserver.unobserve(element)
      }
    })
  })

  statNumbers.forEach((stat) => statsObserver.observe(stat))
})
