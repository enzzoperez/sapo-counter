// theme.ts — Design tokens para Sapo Contador
// Fondo blanco, tipografía generosa, acento verde-teal + coral para warning/ganador

export const colors = {
  // Backgrounds
  bg: "#FFFFFF",
  bgSecondary: "#F7F7F4",
  bgPrimary: "#FFFFFF",

  // Text
  textPrimary: "#1A1A1A",
  textSecondary: "#6B6B6B",
  textTertiary: "#A8A8A8",
  textDisabled: "#D4D4D0",

  // Borders
  border: "#E5E5E0",
  borderStrong: "#1A1A1A",

  // Accent: Verde-teal (jugador/equipo activo, primary actions, links)
  accent: "#0F9B8E",
  accentBg: "#F4FBFA",
  accentBgStrong: "#E6F4F2",
  accentText: "#0A6F66",
  accentBorder: "#B7E0DA",

  // Warning/Highlight: Coral (ganador, acción destructiva, sapo)
  warning: "#E8704A",
  warningBg: "#FBE9E1",
  warningText: "#B84A28",

  // Estado disabled (botones)
  disabled: "#D4D4D0",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 16,
  pill: 999,
} as const;

export const typography = {
  // Display: total grande del numpad
  display: { fontSize: 64, fontWeight: "600" as const, lineHeight: 64 },

  // Score: puntaje principal del jugador/equipo en card de juego
  score: { fontSize: 28, fontWeight: "600" as const, lineHeight: 30 },
  scoreSmall: { fontSize: 20, fontWeight: "600" as const, lineHeight: 22 },

  // Heading: títulos de pantalla ("Sapo Contador", "Ganador")
  heading: { fontSize: 22, fontWeight: "600" as const, lineHeight: 28 },
  title: { fontSize: 18, fontWeight: "600" as const, lineHeight: 24 },
  subtitle: { fontSize: 17, fontWeight: "500" as const, lineHeight: 22 },

  // Body
  body: { fontSize: 15, fontWeight: "400" as const, lineHeight: 22 },
  bodyMedium: { fontSize: 15, fontWeight: "500" as const, lineHeight: 22 },

  // Player/team name en cards
  itemName: { fontSize: 16, fontWeight: "500" as const, lineHeight: 20 },

  // Numpad button label
  numpad: { fontSize: 24, fontWeight: "500" as const, lineHeight: 28 },

  // Captions
  caption: { fontSize: 13, fontWeight: "400" as const, lineHeight: 18 },
  captionMedium: { fontSize: 13, fontWeight: "500" as const, lineHeight: 18 },

  // Micro labels (TURNO 1, GANADOR, etc.) — uppercase con letter-spacing
  micro: {
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 14,
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },
  microLarge: {
    fontSize: 13,
    fontWeight: "500" as const,
    lineHeight: 15,
    letterSpacing: 1.2,
    textTransform: "uppercase" as const,
  },
} as const;

// Colores rotativos para equipos (cuando hay más de 2)
export const teamColors = [
  colors.accent, // Verde-teal (equipo 1)
  colors.warning, // Coral (equipo 2)
  "#7B5CD6", // Violeta (equipo 3)
  "#E8B84A", // Amarillo mostaza (equipo 4)
] as const;

// Sombras (Android elevation + iOS shadowProps)
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
} as const;
