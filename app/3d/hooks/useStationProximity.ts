"use client"

import { useMemo } from "react"
import * as THREE from "three"
import type { StationDef } from "../data/stations"
import type { StationId } from "../data/stations"

/**
 * Returns the nearest station id if the vehicle is within its trigger radius,
 * otherwise null.
 */
export function useStationProximity(
  vehiclePos: THREE.Vector3,
  stations: StationDef[],
): StationId | null {
  return useMemo(() => {
    for (const station of stations) {
      const [sx, , sz] = station.position
      const dx = vehiclePos.x - sx
      const dz = vehiclePos.z - sz
      const dist = Math.sqrt(dx * dx + dz * dz)
      if (dist < station.triggerRadius) return station.id
    }
    return null
  }, [vehiclePos.x, vehiclePos.z, stations])
}
