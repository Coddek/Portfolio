(function () {
  "use strict";
  window.__BRAND__ = {
    name: "Agustín Novarese",
    handle: "Coddek",
    tagline: "AI Backend Developer",
    subtitle: "Construyo sistemas de IA aplicada que funcionan en producción.",
    email: "agustinfnovarese@gmail.com",
    github: "https://github.com/Coddek",
    linkedin: "https://www.linkedin.com/in/agustinnovarese/",
    location: "Buenos Aires, Argentina",

    stack: [
      "Python", "FastAPI", "Claude API", "Groq", "RAG / pgvector",
      "Supabase", "React", "TypeScript", "PostgreSQL", "Git",
      "Playwright", "LangChain", "MCP", "Slack API"
    ],

    projects: [
      {
        id: "archichat",
        title: "ArchiChat",
        tagline: "Chat inteligente con tus documentos usando RAG",
        description: "Sistema RAG que permite consultar documentos en lenguaje natural. Implementa pgvector para búsqueda semántica, Llama 3.1 70B via Groq como LLM principal con fallback a Gemini Flash, y autenticación completa con Supabase.",
        stack: ["TypeScript", "Next.js", "Supabase", "pgvector", "Groq", "RAG"],
        github: "https://github.com/Coddek/archiChat",
        live: null,
        highlight: true
      },
      {
        id: "bot-mtc",
        title: "Bot MTC — Slack + IA",
        tagline: "Asistente de onboarding para ITSchool vía Slack",
        description: "Bot de Slack con arquitectura de tools que integra Groq (Llama 3.1) y Google Sheets como base de datos dinámica. Maneja onboarding automatizado, consultas en lenguaje natural y respuestas contextuales para nuevos estudiantes.",
        stack: ["Python", "Groq", "Slack API", "Google Sheets API", "Tools Architecture"],
        github: null,
        live: null,
        highlight: true
      },
      {
        id: "plataforma-kelsoft",
        title: "Plataforma de Auditoría Kelsoft",
        tagline: "Sistema interno de auditoría con IA integrada",
        description: "Plataforma web desarrollada en producción para Kelsoft S.A. que automatiza procesos de auditoría de catálogo usando la Claude API para análisis y clasificación, con React en el frontend y Supabase como backend.",
        stack: ["React", "Supabase", "Claude API", "Python", "PostgreSQL"],
        github: null,
        live: null,
        highlight: true
      },
      {
        id: "scraper-competitivo",
        title: "Scraper Competitivo E-commerce",
        tagline: "Extracción y matching de precios en Mercado Libre",
        description: "Sistema de scraping con evasión anti-bots que extrae precios competitivos de Mercado Libre y otras plataformas. Incluye matching de productos usando similitud semántica y scoring de confianza.",
        stack: ["Python", "Playwright", "Requests", "OCR", "Fuzzy Matching"],
        github: null,
        live: null,
        highlight: false
      },
      {
        id: "analisis-nfl",
        title: "Análisis NFL Concussions 2012–2014",
        tagline: "Análisis de datos sobre lesiones en la NFL",
        description: "Análisis exploratorio y visualización de datos sobre contusiones en jugadores de la NFL. Limpieza, exploración y visualización con Python y pandas.",
        stack: ["Python", "Pandas", "Matplotlib", "Data Analysis"],
        github: "https://github.com/Coddek/analisis-contusiones-nfl-2012-2014",
        live: null,
        highlight: false
      },
      {
        id: "crud-pastas",
        title: "Tienda de Pastas CRUD",
        tagline: "Aplicación CRUD en Python",
        description: "Aplicación de gestión para una tienda de pastas construida en Python con operaciones CRUD completas.",
        stack: ["Python", "CRUD", "MySQL"],
        github: "https://github.com/Coddek/tienda-pastas-crud",
        live: null,
        highlight: false
      }
    ],

    certifications: [
      { title: "Python Developer", issuer: "ITSchool", year: 2025 },
      { title: "Python — Codo a Codo", issuer: "Buenos Aires Ciudad", year: 2024 },
      { title: "Python para Análisis de Datos", issuer: "Udemy", year: 2024 },
      { title: "Bases de Datos MySQL + MongoDB", issuer: "Udemy", year: 2024 },
      { title: "Alteryx Designer Core", issuer: "Alteryx", year: 2025 },
      { title: "Power BI", issuer: "Udemy", year: 2025 },
      { title: "Data Visualization", issuer: "Coursera", year: 2024 },
      { title: "Fundamentos de Ciberseguridad", issuer: "Google", year: 2024 },
      { title: "Gestión de Riesgos de Seguridad", issuer: "Google", year: 2024 },
      { title: "Enterprise Design Thinking Practitioner", issuer: "IBM", year: 2024 },
      { title: "Enterprise Design Thinking Co-Creator", issuer: "IBM", year: 2024 }
    ],

    about: "Soy desarrollador backend con foco en IA aplicada. Estudié de forma autodidacta — videos, Udemy, Codo a Codo — y hoy curso Ingeniería en Sistemas en UTN FRBA. Lo que más me gusta del proceso es diseñar la arquitectura, ver que el sistema funciona en producción y que el usuario final lo use. Trabajo en Kelsoft como Analista de Catálogo y Desarrollador Backend desde 2024, donde construí herramientas reales con Claude API, scrapers y sistemas de auditoría.",

    education: [
      { title: "Ingeniería en Sistemas de Información", institution: "UTN FRBA", year: "2023 → cursando" }
    ]
  };
})();
