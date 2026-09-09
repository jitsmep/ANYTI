// ── Station definitions ────────────────────────────────────────────────────
// Each station maps to a 3D position in the world and a content type.

export type StationId = "projects" | "about" | "contact"

export interface StationDef {
  id: StationId
  label: string
  position: [number, number, number]
  color: string
  glowColor: string
  icon: string
  triggerRadius: number
}

export const STATIONS: StationDef[] = [
  {
    id: "projects",
    label: "Projects Station",
    position: [14, 0, 2],
    color: "#7c3aed",
    glowColor: "#a78bfa",
    icon: "🏗️",
    triggerRadius: 5,
  },
  {
    id: "about",
    label: "About Station",
    position: [-14, 0, -4],
    color: "#4f46e5",
    glowColor: "#818cf8",
    icon: "🏢",
    triggerRadius: 5,
  },
  {
    id: "contact",
    label: "Contact Station",
    position: [2, 0, -16],
    color: "#0d9488",
    glowColor: "#2dd4bf",
    icon: "📡",
    triggerRadius: 5,
  },
]
