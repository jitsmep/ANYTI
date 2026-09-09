"use client"

import React from "react"
import { Html } from "@react-three/drei"
import type { StationId } from "./data/stations"
import { STATIONS } from "./data/stations"

interface HUDProps {
  nearStation: StationId | null
  vehiclePos: { x: number; z: number }
  onEnter: () => void
}

export default function HUD({ nearStation, vehiclePos, onEnter }: HUDProps) {
  const station = STATIONS.find((s) => s.id === nearStation)

  return (
    <Html fullscreen>
      {/* Station prompt */}
      {nearStation && station && (
        <div
          className="hud-prompt"
          style={{ borderColor: station.color }}
          onClick={onEnter}
        >
          <span className="hud-prompt-icon">{station.icon}</span>
          <div className="hud-prompt-text">
            <p className="hud-prompt-title">{station.label}</p>
            <p className="hud-prompt-hint">
              Press <kbd>Enter</kbd> to open
            </p>
          </div>
        </div>
      )}

      {/* Controls legend */}
      <div className="hud-controls">
        <span>WASD / ↑↓←→ Drive</span>
        <span>·</span>
        <span>Enter Interact</span>
      </div>

      {/* Minimap */}
      <div className="hud-minimap" aria-label="Minimap">
        <div className="hud-minimap-inner">
          {/* Station dots */}
          {STATIONS.map((s) => {
            // Scale world coords [-25,25] → minimap [0,100]
            const mx = ((s.position[0] + 25) / 50) * 100
            const mz = ((s.position[2] + 25) / 50) * 100
            return (
              <div
                key={s.id}
                className="hud-minimap-station"
                style={{
                  left: `${mx}%`,
                  top: `${mz}%`,
                  backgroundColor: s.glowColor,
                }}
                title={s.label}
              />
            )
          })}
          {/* Vehicle dot */}
          <div
            className="hud-minimap-vehicle"
            style={{
              left: `${Math.max(2, Math.min(98, ((vehiclePos.x + 25) / 50) * 100))}%`,
              top: `${Math.max(2, Math.min(98, ((vehiclePos.z + 25) / 50) * 100))}%`,
            }}
          />
        </div>
        <p className="hud-minimap-label">MAP</p>
      </div>
    </Html>
  )
}
