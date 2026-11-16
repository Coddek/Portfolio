/* Arquitectura de cada proyecto, en grilla: col = etapa del flujo, row = carril.
   kind: in (entrada) | ai (modelo) | data (datos/infra) | out (resultado). */
(function () {
  "use strict";
  window.__SYSTEMS__ = {
    archichat: {
      name: "ArchiChat",
      caption: "Tu pregunta busca en tus documentos con pgvector y el modelo responde con lo que encontró, citando de dónde sale cada dato. También escucha clases y reuniones en vivo. Si Groq no contesta, responde Gemini.",
      nodes: [
        { id: "audio",   label: "Clase o reunión",      sub: "Zoom, Meet, YouTube",  col: 0, row: 0, kind: "in" },
        { id: "q",       label: "Tu pregunta",          sub: "en el chat",           col: 0, row: 1, kind: "in" },
        { id: "whisper", label: "Whisper",              sub: "transcribe cada 10 s", col: 1, row: 0, kind: "ai" },
        { id: "pg",      label: "Búsqueda en pgvector", sub: "en tus documentos",    col: 1, row: 1, kind: "data" },
        { id: "groq",    label: "LLM en Groq",          sub: "modelo principal",     col: 2, row: 0, kind: "ai" },
        { id: "gemini",  label: "Gemini",               sub: "respaldo automático",  col: 2, row: 1, kind: "ai" },
        { id: "answer",  label: "Respuesta citada",     sub: "con sus fuentes",      col: 3, row: 1, kind: "out" }
      ],
      edges: [
        ["audio", "whisper"], ["whisper", "groq"], ["q", "pg"], ["pg", "groq"],
        ["groq", "answer"], ["groq", "gemini", "fallback"], ["gemini", "answer", "fallback"]
      ],
      route: ["q", "pg", "groq", "answer"]
    },
    "cierre-caja": {
      name: "Cierre de Caja",
      caption: "Cada venta cargada en un celular aparece al instante en los otros. El cierre lo calcula Postgres con la misma cuenta que el cuaderno.",
      nodes: [
        { id: "phone", label: "Celular del local",  sub: "ventas y gastos",         col: 0, row: 0, kind: "in" },
        { id: "rls",   label: "Auth + RLS",         sub: "solo usuarios del local", col: 1, row: 0, kind: "data" },
        { id: "db",    label: "Postgres",           sub: "ventas, gastos, cierres", col: 2, row: 0, kind: "data" },
        { id: "rt",    label: "Realtime",           sub: "sincroniza dispositivos", col: 3, row: 0, kind: "out" },
        { id: "fn",    label: "Función de arqueo",  sub: "la cuenta del papel",     col: 2, row: 1, kind: "data" },
        { id: "panel", label: "Panel de métricas",  sub: "contra el año anterior",  col: 3, row: 1, kind: "out" }
      ],
      edges: [["phone", "rls"], ["rls", "db"], ["db", "rt"], ["db", "fn"], ["fn", "panel"]],
      route: ["phone", "rls", "db", "fn", "panel"]
    },
    "bot-mtc": {
      name: "Bot MTC",
      caption: "El modelo decide qué herramienta usar para cada pregunta, lee el resultado y contesta en el mismo hilo de Slack, a cualquier hora.",
      nodes: [
        { id: "slack",  label: "Mensaje en Slack",    sub: "estudiante nuevo",     col: 0, row: 0, kind: "in" },
        { id: "pick",   label: "LLM en Groq",         sub: "elige la herramienta", col: 1, row: 0, kind: "ai" },
        { id: "sheets", label: "Google Sheets",       sub: "datos del curso",      col: 2, row: 0, kind: "data" },
        { id: "steps",  label: "Pasos de onboarding", sub: "tool del bot",         col: 2, row: 1, kind: "data" },
        { id: "write",  label: "LLM en Groq",         sub: "redacta con el dato",  col: 3, row: 0, kind: "ai" },
        { id: "reply",  label: "Responde en el hilo", sub: "a cualquier hora",     col: 4, row: 0, kind: "out" }
      ],
      edges: [["slack", "pick"], ["pick", "sheets"], ["pick", "steps"], ["sheets", "write"], ["steps", "write"], ["write", "reply"]],
      route: ["slack", "pick", "sheets", "write", "reply"]
    },
    "asiento-contable": {
      name: "Asiento Contable",
      nodes: [
        { id: "user",  label: "Vendedor",          sub: "su propia cartera",      col: 0, row: 0, kind: "in" },
        { id: "auth",  label: "Auth + RLS",        sub: "aislado por owner_id",   col: 1, row: 0, kind: "data" },
        { id: "mov",   label: "Movimientos",       sub: "debe y haber",           col: 2, row: 0, kind: "data" },
        { id: "saldo", label: "Saldo al instante", sub: "SUM(debe) − SUM(haber)", col: 3, row: 0, kind: "out" }
      ],
      edges: [["user", "auth"], ["auth", "mov"], ["mov", "saldo"]]
    },
    auditoria: {
      name: "Plataforma de Auditoría",
      nodes: [
        { id: "team", label: "Equipo de auditoría", sub: "carga y revisa",        col: 0, row: 0, kind: "in" },
        { id: "q",    label: "Consulta",            sub: "en lenguaje natural",   col: 0, row: 1, kind: "in" },
        { id: "auth", label: "Auth y permisos",     sub: "por rol",               col: 1, row: 0, kind: "data" },
        { id: "sb",   label: "Supabase",            sub: "datos en tiempo real",  col: 2, row: 0, kind: "data" },
        { id: "llm",  label: "Asistente con LLM",   sub: "consulta los datos",    col: 2, row: 1, kind: "ai" },
        { id: "out",  label: "Respuesta",           sub: "información operativa", col: 3, row: 1, kind: "out" }
      ],
      edges: [["team", "auth"], ["auth", "sb"], ["sb", "llm"], ["q", "llm"], ["llm", "out"]]
    }
  };
})();
