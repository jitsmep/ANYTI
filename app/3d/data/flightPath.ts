import * as THREE from "three"
import type { StationId } from "./stations"

export interface StationAirstrip {
  id: StationId
  label: string
  approachT: number // Point along curve (0..1) where vehicle is closest
  touchdown: [number, number, number] // Parking spot in front of station doors
  touchdownRotY: number // Vehicle heading when parked
  cameraPos: [number, number, number] // Exterior inspection camera position
  cameraLookAt: [number, number, number] // Exterior look target
  insideCamPos: [number, number, number] // Interior camera position inside exhibition hall
  insideCamLookAt: [number, number, number] // Interior look target facing 3D display boards
  runwayStart: [number, number, number]
  runwayEnd: [number, number, number]
}

// ── Ground Roadway Loop Connecting All Stations ────────────────────────────────
// Elevation Y = 0.00 keeps vehicle tires grounded directly on the road surface.
export const FLIGHT_WAYPOINTS: [number, number, number][] = [
  [0, 0, 18],     // 0: South gate road (Joshuva's World Arch)
  [8, 0, 13],     // 1: East curve
  [14, 0, 6.5],   // 2: Projects Terminal entrance
  [14, 0, -3],    // 3: Northeast road
  [8, 0, -11.5],  // 4: North road
  [2, 0, -11.5],  // 5: Contact Station entrance
  [-6, 0, -11.5], // 6: Northwest turn
  [-14, 0, -4],   // 7: West road
  [-14, 0, 0.5],  // 8: About Station entrance
  [-10, 0, 11],   // 9: Southwest curve
  [-3, 0, 17],    // 10: Return to South gate road through Arch
]

export const FLIGHT_CURVE = new THREE.CatmullRomCurve3(
  FLIGHT_WAYPOINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  true, // Closed loop
  "centripetal", // Smooth, natural curves
  0.5
)

// ── Station Parking & Interior Room Camera Targets ────────────────────────────
export const STATION_AIRSTRIPS: Record<StationId, StationAirstrip> = {
  projects: {
    id: "projects",
    label: "Projects Terminal",
    approachT: 0.18, // Waypoint index ~2
    touchdown: [14, 0, 6.2],
    touchdownRotY: Math.PI, // Facing building doors
    cameraPos: [14, 2.2, 10.5],
    cameraLookAt: [14, 1.6, 2.0],
    insideCamPos: [14, 1.8, 3.8],
    insideCamLookAt: [14, 1.8, 0.2],
    runwayStart: [14, 0.02, 10],
    runwayEnd: [14, 0.02, 4],
  },
  contact: {
    id: "contact",
    label: "Contact Comm-Tower",
    approachT: 0.46, // Waypoint index ~5
    touchdown: [2, 0, -11.5],
    touchdownRotY: Math.PI,
    cameraPos: [2, 2.2, -7.5],
    cameraLookAt: [2, 1.8, -16.0],
    insideCamPos: [2, 1.8, -13.5],
    insideCamLookAt: [2, 1.8, -17.5],
    runwayStart: [2, 0.02, -8],
    runwayEnd: [2, 0.02, -14],
  },
  about: {
    id: "about",
    label: "About HQ Station",
    approachT: 0.77, // Waypoint index ~8
    touchdown: [-14, 0, 0.5],
    touchdownRotY: Math.PI,
    cameraPos: [-14, 2.2, 4.8],
    cameraLookAt: [-14, 1.8, -4.0],
    insideCamPos: [-14, 2.0, -1.6],
    insideCamLookAt: [-14, 2.0, -5.6],
    runwayStart: [-14, 0.02, 4],
    runwayEnd: [-14, 0.02, -2],
  },
}

/**
 * Returns nearest station parking if vehicle progress is near entrance
 */
export function getApproachingAirstrip(
  progress: number,
  threshold = 0.05
): StationAirstrip | null {
  for (const key of Object.keys(STATION_AIRSTRIPS) as StationId[]) {
    const strip = STATION_AIRSTRIPS[key]
    let diff = Math.abs(progress - strip.approachT)
    if (diff > 0.5) diff = 1.0 - diff
    if (diff < threshold) {
      return strip
    }
  }
  return null
}
