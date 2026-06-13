// theme.ts — Design tokens para Sapo Contador (Light)
// Blanco/off-white + verde-teal + coral

export const colors = {
  // Backgrounds (claro: página off-white, cards blancas, celdas hundidas)
  bg: "#F7F7F4",
  bgElevated: "#FFFFFF",
  bgSunken: "#EDEDE8",

  // Text (oscuro sobre claro)
  textPrimary: "#1A1A1A",
  textSecondary: "#5F5F5B",
  textTertiary: "#8A8A86",
  textMuted: "#ABABA6",
  textDisabled: "#C6C6C0",

  // Borders
  border: "#E5E5E0",
  borderSubtle: "#D8D8D1",

  // Accent: Verde-teal (activo, ganadores, CTAs)
  accent: "#0F9B8E",
  accentDark: "#FFFFFF", // texto/íconos SOBRE el accent
  accentBg: "#E6F4F2",
  accentBorder: "#B7E0DA",

  // Secondary: Coral (ganador, torneo, pendientes)
  gold: "#E8704A",
  goldBg: "#FBE9E1",
  goldBorder: "#F2C4B2",

  // Danger / destructivo (salir de partida, eliminados)
  danger: "#D64530",
  dangerBg: "#FBE4DE",

  // Estado disabled
  disabled: "#E2E2DC",
  disabledText: "#ABABA5",
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
  xl: 18,
  pill: 999,
} as const;

export const typography = {
  // Display: total grande del numpad
  display: { fontSize: 64, fontWeight: "600" as const, lineHeight: 64 },

  // Score: puntaje principal del jugador/equipo en card de juego
  score: { fontSize: 30, fontWeight: "600" as const, lineHeight: 32 },
  scoreSmall: { fontSize: 19, fontWeight: "600" as const, lineHeight: 22 },

  // Heading: títulos de pantalla
  heading: { fontSize: 23, fontWeight: "600" as const, lineHeight: 28 },
  title: { fontSize: 19, fontWeight: "600" as const, lineHeight: 24 },
  subtitle: { fontSize: 16, fontWeight: "500" as const, lineHeight: 22 },

  // Body
  body: { fontSize: 15, fontWeight: "400" as const, lineHeight: 22 },
  bodyMedium: { fontSize: 15, fontWeight: "500" as const, lineHeight: 22 },

  // Player/team name en cards
  itemName: { fontSize: 16, fontWeight: "500" as const, lineHeight: 20 },

  // Score input (torneo)
  scoreInput: { fontSize: 19, fontWeight: "600" as const },

  // Numpad button label
  numpad: { fontSize: 24, fontWeight: "500" as const, lineHeight: 28 },

  // Captions
  caption: { fontSize: 13, fontWeight: "400" as const, lineHeight: 18 },
  captionMedium: { fontSize: 13, fontWeight: "500" as const, lineHeight: 18 },

  // Micro labels — uppercase con letter-spacing
  micro: {
    fontSize: 11,
    fontWeight: "600" as const,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase" as const,
  },

  // Tab bar label
  tabLabel: { fontSize: 11, fontWeight: "600" as const, lineHeight: 14 },

  // Chip
  chip: { fontSize: 14, fontWeight: "500" as const, lineHeight: 18 },
} as const;

// Colores rotativos para equipos
export const teamColors = [
  colors.accent,
  colors.gold,
  "#7B8CF8",
  "#E88B6E",
] as const;

// Score input sizing (torneo)
export const scoreInputSize = {
  width: 64,
  height: 42,
} as const;
