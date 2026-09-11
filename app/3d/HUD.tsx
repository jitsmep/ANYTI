"use client"

import React from "react"
import { Html } from "@react-three/drei"
import type { StationId } from "./data/stations"
import { STATIONS } from "./data/stations"
import type { VehicleMode } from "./VehicleController"
import { StationAirstrip } from "./data/flightPath"

const STATION_BOARDS_META: Record<StationId, { id: number; title: string; subtitle: string }[]> = {
  projects: [
    { id: 0, title: "Finance Tracker", subtitle: "Automated Budgeting & AI" },
    { id: 1, title: "Trading Journal", subtitle: "Analytics & P/L Metrics" },
    { id: 2, title: "Portfolio Builder", subtitle: "3D Showcase Creator" },
  ],
  about: [
    { id: 0, title: "Education & MCC", subtitle: "BSc Computer Science" },
    { id: 1, title: "Joshuva P", subtitle: "CS Student & Vibe Coder" },
    { id: 2, title: "Tech Stack", subtitle: "Python, Next.js & AI" },
  ],
  contact: [
    { id: 0, title: "Direct Email", subtitle: "pjoshuva31@gmail.com" },
    { id: 1, title: "Let's Connect", subtitle: "Open for Collaborations" },
    { id: 2, title: "GitHub Profile", subtitle: "github.com/jitsmep" },
  ],
}

interface HUDProps {
  vehicleMode: VehicleMode
  activeStation: StationAirstrip | null
  nearStation: StationId | null
  activeBoardIndex?: number
  onBoardChange?: (index: number) => void
  vehiclePos: { x: number; z: number }
  speed: number
  progress: number
  onEnterStation: () => void
  onExitStation: () => void
  onOpenDetails?: () => void
  onSkipNext: () => void
  onSkipPrev: () => void
  onDriveToSection?: (sectionId: StationId) => void
}

export default function HUD({
  vehicleMode,
  activeStation,
  nearStation,
  activeBoardIndex = 1,
  onBoardChange,
  vehiclePos,
  speed,
  progress,
  onEnterStation,
  onExitStation,
  onOpenDetails,
  onSkipNext,
  onSkipPrev,
  onDriveToSection,
}: HUDProps) {
  const displaySpeed = Math.max(0, Math.round(speed))
  const currentBoards = activeStation ? STATION_BOARDS_META[activeStation.id] : null
  const currentBoard = currentBoards ? currentBoards[activeBoardIndex] : null

  return (
    <Html fullscreen>
      <div className="flight-hud-container">
        {/* Cinematic Welcome Title on Entering Joshuva's World */}
        {vehicleMode === "ENTERING" && (
          <div className="hud-welcome-banner">
            <span className="hud-welcome-sub">ENTERING</span>
            <h1 className="hud-welcome-title">JOSHUVA&apos;S WORLD</h1>
            <p className="hud-welcome-hint">✦ Free-Roam Driving Active · W / ↑ Gas · S / ↓ Reverse · A / D Steer Anywhere ✦</p>
          </div>
        )}

        {/* Top Vehicle Telemetry Instruments */}
        <header className="flight-telemetry-bar">
          <div className="flight-badge-group">
            <span className={`flight-status-badge ${vehicleMode.toLowerCase()}`}>
              <span className="status-blinker" />
              {vehicleMode === "ENTERING"
                ? "ENTERING JOSHUVA'S WORLD"
                : vehicleMode === "APPROACHING"
                ? "ENTRANCE NEARBY"
                : vehicleMode === "ENTERING_STATION"
                ? "ZOOMING INSIDE..."
                : vehicleMode === "INSIDE_STATION"
                ? "INSIDE EXHIBITION HALL"
                : vehicleMode === "EXITING_STATION"
                ? "EXITING STATION..."
                : "OPEN-WORLD FREE ROAM"}
            </span>

            {activeStation && (
              <span className="flight-waypoint-badge">
                📍 {activeStation.label}
              </span>
            )}
          </div>

          {/* Direct Section Drive Buttons in Telemetry Bar */}
          <div className="hud-section-dock">
            {STATIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`hud-dock-btn ${activeStation?.id === s.id ? "active" : ""}`}
                onClick={() => onDriveToSection?.(s.id)}
                title={`Drive directly to ${s.label}`}
              >
                <span>{s.icon}</span>
                <span>{s.id.toUpperCase()}</span>
              </button>
            ))}
          </div>

          <div className="flight-metrics-cluster">
            <div className="flight-metric-item">
              <span className="metric-label">SPD</span>
              <span className="metric-val">{displaySpeed} mph</span>
            </div>
            <div className="flight-metric-divider" />
            <div className="flight-metric-item">
              <span className="metric-label">GEAR</span>
              <span className="metric-val">{displaySpeed > 1 ? "D" : "P"}</span>
            </div>
          </div>
        </header>

        {/* Approaching Station Entrance Action Banner */}
        {vehicleMode === "APPROACHING" && activeStation && (
          <div
            className="hud-prompt landing-alert"
            onClick={onEnterStation}
            role="button"
            tabIndex={0}
            aria-label={`Enter ${activeStation.label}`}
          >
            <span className="hud-prompt-icon">🚗</span>
            <div className="hud-prompt-text">
              <p className="hud-prompt-title">Entrance: {activeStation.label}</p>
              <p className="hud-prompt-hint">
                Click or press <kbd>Enter</kbd> / <kbd>Space</kbd> to Zoom Inside Station
              </p>
            </div>
            <span className="landing-cta-pill">ZOOM INSIDE ➔</span>
          </div>
        )}

        {/* Inside Station: Floating Left & Right Board Turn Arrows */}
        {vehicleMode === "INSIDE_STATION" && (
          <>
            <button
              type="button"
              className={`station-slide-side-btn left ${activeBoardIndex === 0 ? "disabled" : ""}`}
              onClick={() => onBoardChange?.(Math.max(0, activeBoardIndex - 1))}
              disabled={activeBoardIndex === 0}
              aria-label="Previous exhibition board (A or Left Arrow)"
              title="Previous Board (A or ←)"
            >
              <span>‹</span>
            </button>

            <button
              type="button"
              className={`station-slide-side-btn right ${activeBoardIndex === 2 ? "disabled" : ""}`}
              onClick={() => onBoardChange?.(Math.min(2, activeBoardIndex + 1))}
              disabled={activeBoardIndex === 2}
              aria-label="Next exhibition board (D or Right Arrow)"
              title="Next Board (D or →)"
            >
              <span>›</span>
            </button>
          </>
        )}

        {/* Inside Station: Interactive 3D Board Carousel Slider Bar */}
        {vehicleMode === "INSIDE_STATION" && activeStation && currentBoards && (
          <div className="station-board-slider-bar" role="region" aria-label="Exhibition Board Selector">
            <div className="slider-header-row">
              <span className="slider-station-tag">🏛️ {activeStation.label}</span>
              <div className="slider-ctrl-actions">
                {onOpenDetails && (
                  <button
                    type="button"
                    className="inside-details-btn"
                    onClick={onOpenDetails}
                    title="View 2D portfolio document modal"
                  >
                    📄 Full Details
                  </button>
                )}
                <button
                  type="button"
                  className="inside-exit-btn"
                  onClick={onExitStation}
                  title="Drive out of station back to highway"
                >
                  🚗 Drive Out (Esc)
                </button>
              </div>
            </div>

            {/* Slider navigation row */}
            <div className="slider-nav-row">
              <button
                type="button"
                className="board-nav-arrow"
                onClick={() => onBoardChange?.(Math.max(0, activeBoardIndex - 1))}
                disabled={activeBoardIndex === 0}
                aria-label="Previous board"
              >
                ‹
              </button>

              <div className="board-pills-cluster">
                {currentBoards.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className={`board-pill-btn ${activeBoardIndex === b.id ? "active" : ""}`}
                    onClick={() => onBoardChange?.(b.id)}
                    title={`Slide to ${b.title}`}
                  >
                    <span className="board-pill-indicator" />
                    <span className="board-pill-text">{b.title}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="board-nav-arrow"
                onClick={() => onBoardChange?.(Math.min(2, activeBoardIndex + 1))}
                disabled={activeBoardIndex === 2}
                aria-label="Next board"
              >
                ›
              </button>
            </div>

            <p className="slider-shortcut-hint">
              Slide boards with <kbd>A</kbd> / <kbd>D</kbd> or <kbd>←</kbd> / <kbd>→</kbd> · Press <kbd>Esc</kbd> to Drive Out
            </p>
          </div>
        )}

        {/* Driving Controls Legend (Desktop) */}
        <div className="hud-controls">
          {vehicleMode === "INSIDE_STATION" ? (
            <>
              <span>A / D or ← / →: Slide Boards</span>
              <span>·</span>
              <span>Esc: Drive Out</span>
              <span>·</span>
              <span>Enter: Full Details</span>
            </>
          ) : (
            <>
              <span>W / ↑: Gas</span>
              <span>·</span>
              <span>S / ↓: Brake / Reverse</span>
              <span>·</span>
              <span>A / D: Free Steer</span>
              <span>·</span>
              <span>Enter: Zoom Inside Station</span>
              <span>·</span>
              <button type="button" className="hud-skip-link" onClick={onSkipPrev}>
                [P] Prev
              </button>
              <span>·</span>
              <button type="button" className="hud-skip-link" onClick={onSkipNext}>
                [N] Next
              </button>
            </>
          )}
        </div>

        {/* Permanently Anchored Cyber GPS Radar Minimap */}
        <div className="hud-minimap" aria-label="Cyber GPS Radar Minimap">
          <div className="hud-minimap-inner">
            {/* Radar scan ring */}
            <div className="radar-sweep" />

            {/* Roadway circuit loop track overlay */}
            <svg className="radar-path-svg" viewBox="0 0 100 100">
              <polygon
                points="50,86 72,78 84,60 92,44 78,16 54,14 28,18 8,32 18,54 14,70 34,84"
                fill="none"
                stroke="rgba(129, 140, 248, 0.45)"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            </svg>

            {/* Station Locations on Minimap */}
            {STATIONS.map((s) => {
              const mx = ((s.position[0] + 25) / 50) * 100
              const mz = ((s.position[2] + 25) / 50) * 100
              const isTarget = activeStation?.id === s.id
              return (
                <div
                  key={s.id}
                  className={`hud-minimap-station ${isTarget ? "radar-target" : ""}`}
                  style={{
                    left: `${mx}%`,
                    top: `${mz}%`,
                    backgroundColor: s.glowColor,
                  }}
                  title={s.label}
                />
              )
            })}

            {/* Vehicle Cyber Blip */}
            <div
              className="hud-minimap-plane"
              style={{
                left: `${Math.max(2, Math.min(98, ((vehiclePos.x + 25) / 50) * 100))}%`,
                top: `${Math.max(2, Math.min(98, ((vehiclePos.z + 25) / 50) * 100))}%`,
              }}
              title="Your Cyber Roadster"
            >
              ▲
            </div>
          </div>
          <p className="hud-minimap-label">GPS RADAR</p>
        </div>
      </div>
    </Html>
  )
}
