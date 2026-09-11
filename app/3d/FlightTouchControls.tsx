"use client"

import React, { useRef, useState } from "react"
import type { VehicleMode } from "./VehicleController"

interface FlightTouchProps {
  flightMode: VehicleMode | string
  canLand: boolean
  stationLabel?: string
  onOffsetChange: (offset: { x: number; y: number }) => void
  onLandPress: () => void
  onTakeoffPress: () => void
  onNextStation?: () => void
  onPrevStation?: () => void
}

export default function FlightTouchControls({
  flightMode,
  canLand,
  stationLabel,
  onOffsetChange,
  onLandPress,
  onTakeoffPress,
  onNextStation,
  onPrevStation,
}: FlightTouchProps) {
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const pointerIdRef = useRef<number | null>(null)
  const originRef = useRef({ x: 0, y: 0 })
  const MAX_RADIUS = 48

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const target = e.currentTarget
    target.setPointerCapture(e.pointerId)
    pointerIdRef.current = e.pointerId
    originRef.current = { x: e.clientX, y: e.clientY }
    setIsDragging(true)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || e.pointerId !== pointerIdRef.current) return
    e.preventDefault()

    const dx = e.clientX - originRef.current.x
    const dy = e.clientY - originRef.current.y
    const distance = Math.hypot(dx, dy)
    const angle = Math.atan2(dy, dx)

    const clampedDist = Math.min(distance, MAX_RADIUS)
    const clampedX = Math.cos(angle) * clampedDist
    const clampedY = Math.sin(angle) * clampedDist

    setKnobPos({ x: clampedX, y: clampedY })

    // Gentle deadzone and power curve so micro touches don't jerk the car
    const DEADZONE = 8
    let normDist = 0
    if (clampedDist > DEADZONE) {
      const activeRange = MAX_RADIUS - DEADZONE
      const rawNorm = (clampedDist - DEADZONE) / activeRange
      normDist = Math.pow(rawNorm, 1.25)
    }

    const normX = Math.cos(angle) * normDist
    const normY = Math.sin(angle) * normDist

    onOffsetChange({
      x: normX * 0.85,
      y: -normY * 0.85,
    })
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== pointerIdRef.current) return
    setIsDragging(false)
    pointerIdRef.current = null
    setKnobPos({ x: 0, y: 0 })
    onOffsetChange({ x: 0, y: 0 })
  }

  return (
    <div className="flight-touch-root" aria-label="Vehicle driving touch controls">
      {/* Steering Joystick (Bottom Left) */}
      <div
        className="flight-stick-boundary"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="flight-stick-ring">
          <div
            className={`flight-stick-knob ${isDragging ? "active" : ""}`}
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            }}
          >
            <span className="flight-stick-arrow">✦</span>
          </div>
        </div>
        <span className="flight-stick-label">STEER LANE</span>
      </div>

      {/* Quick Station Navigation (Bottom Center) */}
      <div className="flight-quick-nav">
        {onPrevStation && (
          <button
            type="button"
            className="flight-nav-btn"
            onClick={onPrevStation}
            aria-label="Previous station"
          >
            ‹ Prev
          </button>
        )}
        {onNextStation && (
          <button
            type="button"
            className="flight-nav-btn"
            onClick={onNextStation}
            aria-label="Next station"
          >
            Next ›
          </button>
        )}
      </div>

      {/* Contextual Action Button (Bottom Right) */}
      <div className="flight-action-cluster">
        {(flightMode === "APPROACHING" || canLand) && (
          <button
            type="button"
            className="flight-action-btn land-pulse"
            onClick={onLandPress}
            aria-label="Zoom inside station"
          >
            <span className="flight-btn-icon">🚗</span>
            <div className="flight-btn-text">
              <span className="flight-btn-title">ENTER</span>
              <span className="flight-btn-sub">{stationLabel ?? "Station"}</span>
            </div>
          </button>
        )}

        {flightMode === "INSIDE_STATION" && (
          <button
            type="button"
            className="flight-action-btn takeoff-btn"
            onClick={onTakeoffPress}
            aria-label="Drive out of station"
          >
            <span className="flight-btn-icon">🚪</span>
            <div className="flight-btn-text">
              <span className="flight-btn-title">DRIVE OUT</span>
              <span className="flight-btn-sub">Resume Cruise</span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
