"use client"

import React, { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import ClassicView from "./ClassicView"
import FlightTouchControls from "./FlightTouchControls"
import type { VehicleMode } from "./VehicleController"

import type { StationId } from "./data/stations"

// Dynamically import Scene to avoid SSR issues with WebGL + Canvas
const Scene = dynamic(() => import("./Scene"), { ssr: false })

export default function PortfolioRoot() {
  const [isClassic, setIsClassic] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [targetSection, setTargetSection] = useState<StationId | null>(null)

  // Touch vehicle driving navigation state
  const [touchOffset, setTouchOffset] = useState({ x: 0, y: 0 })
  const [vehicleMode, setVehicleMode] = useState<VehicleMode>("CRUISING")
  const [canEnter, setCanEnter] = useState(false)
  const [stationLabel, setStationLabel] = useState<string | undefined>(undefined)

  // Refs for triggering actions from touch controls into Scene
  const enterStationTriggerRef = useRef<(() => void) | null>(null)
  const exitStationTriggerRef = useRef<(() => void) | null>(null)
  const skipNextRef = useRef<(() => void) | null>(null)
  const skipPrevRef = useRef<(() => void) | null>(null)

  // Detect touch capability or small screen size on mount & resize
  useEffect(() => {
    function checkTouch() {
      const isCoarse =
        typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
      const isSmallScreen =
        typeof window !== "undefined" && window.innerWidth <= 768
      const hasTouch =
        typeof navigator !== "undefined" &&
        (navigator.maxTouchPoints > 0 || "ontouchstart" in window)
      setIsTouchDevice(isCoarse || isSmallScreen || hasTouch)
    }

    checkTouch()
    window.addEventListener("resize", checkTouch)
    return () => window.removeEventListener("resize", checkTouch)
  }, [])

  // Lock document scroll and overscroll-behavior while in 3D mode
  useEffect(() => {
    if (!isClassic) {
      document.documentElement.style.overflow = "hidden"
      document.body.style.overflow = "hidden"
      document.documentElement.style.overscrollBehavior = "none"
      document.body.style.overscrollBehavior = "none"
    } else {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
      document.documentElement.style.overscrollBehavior = ""
      document.body.style.overscrollBehavior = ""
    }
    return () => {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
      document.documentElement.style.overscrollBehavior = ""
      document.body.style.overscrollBehavior = ""
    }
  }, [isClassic])

  const handleFlightStateChange = React.useCallback(
    (mode: VehicleMode, enterable: boolean, label?: string) => {
      setVehicleMode(mode)
      setCanEnter(enterable)
      setStationLabel(label)
    },
    []
  )

  const handleEnterWorld = React.useCallback((sectionId?: StationId) => {
    setTargetSection(sectionId ?? null)
    setIsClassic(false)
  }, [])

  return (
    <>
      {isClassic ? (
        <ClassicView onEnterWorld={handleEnterWorld} />
      ) : (
        <>
          <div className="portfolio-root-3d">
            <Scene
              touchOffset={isTouchDevice ? touchOffset : undefined}
              targetStationId={targetSection}
              onFlightStateChange={handleFlightStateChange}
              onTriggerLandRef={enterStationTriggerRef}
              onTriggerTakeoffRef={exitStationTriggerRef}
              onSkipNextRef={skipNextRef}
              onSkipPrevRef={skipPrevRef}
            />
          </div>

          {/* Touch navigation controls rendered outside canvas */}
          {isTouchDevice && !isClassic && (
            <FlightTouchControls
              flightMode={vehicleMode}
              canLand={canEnter}
              stationLabel={stationLabel}
              onOffsetChange={setTouchOffset}
              onLandPress={() => enterStationTriggerRef.current?.()}
              onTakeoffPress={() => exitStationTriggerRef.current?.()}
              onNextStation={() => skipNextRef.current?.()}
              onPrevStation={() => skipPrevRef.current?.()}
            />
          )}
        </>
      )}

      {/* Persistent view toggle button */}
      <button
        id="portfolio-view-toggle"
        className="view-toggle-btn"
        type="button"
        onClick={() => {
          setTargetSection(null)
          setIsClassic((v) => !v)
        }}
        onPointerDown={(e) => {
          e.stopPropagation()
        }}
        aria-label={isClassic ? "Enter Joshuva's World" : "Switch to Classic View"}
        title={isClassic ? "Enter Joshuva's World" : "Classic Portfolio View"}
      >
        {isClassic ? (
          <>
            <span className="view-toggle-icon">🏎️</span>
            <span>Joshuva&apos;s World</span>
          </>
        ) : (
          <>
            <span className="view-toggle-icon">📄</span>
            <span>Classic View</span>
          </>
        )}
      </button>
    </>
  )
}
