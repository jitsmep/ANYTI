"use client"

import React, { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Sky, Stars } from "@react-three/drei"
import * as THREE from "three"
import VehicleController, { VehicleMode } from "./VehicleController"
import World from "./World"
import Station from "./Station"
import ContentModal from "./ContentModal"
import HUD from "./HUD"
import { STATIONS, StationId, StationDef } from "./data/stations"
import {
  STATION_AIRSTRIPS,
  StationAirstrip,
  getApproachingAirstrip,
} from "./data/flightPath"

function LoadingScreen() {
  return (
    <div className="scene-loading">
      <div className="scene-loading-spinner" />
      <p>Initializing Cyber Roadster…</p>
    </div>
  )
}

interface SceneProps {
  touchOffset?: { x: number; y: number }
  targetStationId?: StationId | null
  onFlightStateChange?: (
    mode: VehicleMode,
    canEnter: boolean,
    stationLabel?: string
  ) => void
  onTriggerLandRef?: React.MutableRefObject<(() => void) | null>
  onTriggerTakeoffRef?: React.MutableRefObject<(() => void) | null>
  onSkipNextRef?: React.MutableRefObject<(() => void) | null>
  onSkipPrevRef?: React.MutableRefObject<(() => void) | null>
}

export default function Scene({
  touchOffset,
  targetStationId,
  onFlightStateChange,
  onTriggerLandRef,
  onTriggerTakeoffRef,
  onSkipNextRef,
  onSkipPrevRef,
}: SceneProps) {
  // Vehicle telemetry state
  const [vehicleMode, setVehicleMode] = useState<VehicleMode>("ENTERING")
  const [activeStation, setActiveStation] = useState<StationAirstrip | null>(null)
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null)
  const [targetHeading, setTargetHeading] = useState<number | null>(null)
  const [vehiclePos, setVehiclePos] = useState({ x: 0, z: 18 })
  const [speed, setSpeed] = useState(0)
  const [progress, setProgress] = useState(0)

  // Driver inputs
  const [throttleInput, setThrottleInput] = useState(0)
  const [steerInput, setSteerInput] = useState(0)

  // Inside exhibition board carousel index (0: Left, 1: Center, 2: Right)
  const [insideBoardIndex, setInsideBoardIndex] = useState(1)

  // Portfolio modal state
  const [openStation, setOpenStation] = useState<StationId | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Keyboard state — steering is keyboard-only (no mouse drift)
  const keysDown = useRef({ up: false, down: false, left: false, right: false })
  // Mirror vehicleMode into a ref so keyboard handlers don't use stale closures
  const vehicleModeRef = useRef<VehicleMode>("ENTERING")
  useEffect(() => { vehicleModeRef.current = vehicleMode }, [vehicleMode])

  // Track latest vehicle pos in ref for synchronous keyboard checks
  const vehiclePosRef = useRef({ x: 0, z: 18 })
  useEffect(() => { vehiclePosRef.current = vehiclePos }, [vehiclePos])

  // Notify parent of vehicle state changes
  useEffect(() => {
    onFlightStateChange?.(
      vehicleMode,
      vehicleMode === "APPROACHING" && Boolean(activeStation),
      activeStation?.label
    )
  }, [vehicleMode, activeStation, onFlightStateChange])

  // ── Station Transitions (Zoom In & Zoom Out) ──────────────────────────────
  const initiateEnterStation = useCallback(() => {
    let target = activeStation
    if (!target) {
      // Find nearest station
      let closest = STATIONS[0]
      let minD = Infinity
      for (const st of STATIONS) {
        const d = Math.hypot(vehiclePosRef.current.x - st.position[0], vehiclePosRef.current.z - st.position[2])
        if (d < minD) { minD = d; closest = st }
      }
      target = STATION_AIRSTRIPS[closest.id]
    }
    if (!target) return
    setActiveStation(target)
    setInsideBoardIndex(1) // Start at center board
    setVehicleMode("ENTERING_STATION")
  }, [activeStation])

  const handleInsideStationReached = useCallback(() => {
    if (activeStation) {
      setVehicleMode("INSIDE_STATION")
      setOpenStation(activeStation.id)
    }
  }, [activeStation])

  const initiateExitStation = useCallback(() => {
    setModalOpen(false)
    setVehicleMode("EXITING_STATION")
  }, [])

  const handleExitStationComplete = useCallback(() => {
    setVehicleMode("CRUISING")
    setActiveStation(null)
    setOpenStation(null)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  // ── Section Direct Driving & Skips ─────────────────────────────────────────
  const driveToSection = useCallback((sectionId: StationId) => {
    const strip = STATION_AIRSTRIPS[sectionId]
    if (!strip) return
    setActiveStation(strip)
    setTargetPosition([strip.touchdown[0], 0, strip.touchdown[2]])
    setTargetHeading(strip.touchdownRotY)
    setVehicleMode("APPROACHING")
  }, [])

  useEffect(() => {
    if (targetStationId) {
      driveToSection(targetStationId)
    }
  }, [targetStationId, driveToSection])

  const stationOrder: StationId[] = ["projects", "contact", "about"]

  const skipToNextStation = useCallback(() => {
    const currentIdx = activeStation ? stationOrder.indexOf(activeStation.id) : -1
    const nextId = stationOrder[(currentIdx + 1) % stationOrder.length]
    driveToSection(nextId)
  }, [activeStation, driveToSection])

  const skipToPrevStation = useCallback(() => {
    const currentIdx = activeStation ? stationOrder.indexOf(activeStation.id) : 0
    const prevId = stationOrder[(currentIdx - 1 + stationOrder.length) % stationOrder.length]
    driveToSection(prevId)
  }, [activeStation, driveToSection])

  // ── Keyboard Controls ───────────────────────────────────────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const k = e.key.toLowerCase()
      const mode = vehicleModeRef.current

      // ── INSIDE STATION: board sliding, open details & exit ────────────────
      if (mode === "INSIDE_STATION") {
        if (modalOpen) {
          if (e.key === "Escape") { e.preventDefault(); setModalOpen(false) }
          return
        }
        if (k === "a" || e.key === "ArrowLeft") {
          e.preventDefault()
          setInsideBoardIndex((prev) => Math.max(0, prev - 1))
          return
        }
        if (k === "d" || e.key === "ArrowRight") {
          e.preventDefault()
          setInsideBoardIndex((prev) => Math.min(2, prev + 1))
          return
        }
        if (e.key === "Escape") { e.preventDefault(); initiateExitStation(); return }
        if (e.key === "Enter") { e.preventDefault(); setModalOpen(true); return }
        return
      }

      // ── ENTER / SPACE: Zoom into nearest station ─────────────────────────
      if (e.key === "Enter" || e.key === " " || k === "e") {
        if (mode === "APPROACHING") {
          e.preventDefault()
          initiateEnterStation()
          return
        }
        if (mode === "CRUISING") {
          // Check if within 16 meters of any station
          let closest = STATIONS[0]
          let minD = Infinity
          for (const st of STATIONS) {
            const d = Math.hypot(vehiclePosRef.current.x - st.position[0], vehiclePosRef.current.z - st.position[2])
            if (d < minD) { minD = d; closest = st }
          }
          if (minD < 16.0) {
            e.preventDefault()
            const strip = STATION_AIRSTRIPS[closest.id]
            setActiveStation(strip)
            setInsideBoardIndex(1)
            setVehicleMode("ENTERING_STATION")
            return
          }
        }
      }

      // If in ENTERING intro, any driving keypress instantly hands over free controls
      if (mode === "ENTERING") {
        if (
          k === "w" || e.key === "ArrowUp" ||
          k === "s" || e.key === "ArrowDown" ||
          k === "a" || e.key === "ArrowLeft" ||
          k === "d" || e.key === "ArrowRight"
        ) {
          vehicleModeRef.current = "CRUISING"
          setVehicleMode("CRUISING")
        }
      }

      // ── DRIVING: Gas, Brake, Steer ────────────────────────────────────────
      if (k === "w" || e.key === "ArrowUp") {
        e.preventDefault()
        keysDown.current.up = true
        setThrottleInput(1)
      }
      if (k === "s" || e.key === "ArrowDown") {
        e.preventDefault()
        keysDown.current.down = true
        setThrottleInput(-1)
      }
      if (k === "a" || e.key === "ArrowLeft") {
        e.preventDefault()
        keysDown.current.left = true
        setSteerInput(-1)
      }
      if (k === "d" || e.key === "ArrowRight") {
        e.preventDefault()
        keysDown.current.right = true
        setSteerInput(1)
      }

      // Fast travel: N / P
      if (k === "n") { e.preventDefault(); skipToNextStation() }
      if (k === "p") { e.preventDefault(); skipToPrevStation() }
    }

    function onKeyUp(e: KeyboardEvent) {
      const k = e.key.toLowerCase()
      if (vehicleModeRef.current === "INSIDE_STATION") return

      if (k === "w" || e.key === "ArrowUp") {
        e.preventDefault()
        keysDown.current.up = false
        setThrottleInput(keysDown.current.down ? -1 : 0)
      }
      if (k === "s" || e.key === "ArrowDown") {
        e.preventDefault()
        keysDown.current.down = false
        setThrottleInput(keysDown.current.up ? 1 : 0)
      }
      if (k === "a" || e.key === "ArrowLeft") {
        e.preventDefault()
        keysDown.current.left = false
        setSteerInput(keysDown.current.right ? 1 : 0)
      }
      if (k === "d" || e.key === "ArrowRight") {
        e.preventDefault()
        keysDown.current.right = false
        setSteerInput(keysDown.current.left ? -1 : 0)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, activeStation, initiateEnterStation, initiateExitStation])

  // ── Touch offset pass-through ──
  const getEffectiveOffset = useCallback(() => {
    if (touchOffset) return touchOffset
    return { x: 0, y: 0 }
  }, [touchOffset])

  // ── Driving Progress & Proximity Updates (Real 3D Euclidean Distance) ───────
  const handleProgressUpdate = useCallback(
    (_prog: number, pos: THREE.Vector3, currentSpeed: number) => {
      setSpeed(currentSpeed)

      // Minimap throttled position updates
      setVehiclePos((prev) => {
        if (Math.abs(prev.x - pos.x) > 0.3 || Math.abs(prev.z - pos.z) > 0.3) {
          return { x: pos.x, z: pos.z }
        }
        return prev
      })

      // Distance-based station detection across the open world!
      const currentMode = vehicleModeRef.current
      if (currentMode === "CRUISING" || currentMode === "APPROACHING") {
        let closestStation: StationDef | null = null
        let minDistance = Infinity

        for (const station of STATIONS) {
          const dist = Math.hypot(pos.x - station.position[0], pos.z - station.position[2])
          if (dist < minDistance) {
            minDistance = dist
            closestStation = station
          }
        }

        // When within 10.5 meters of station, trigger APPROACHING mode!
        if (closestStation && minDistance < 10.5) {
          const strip = STATION_AIRSTRIPS[closestStation.id]
          setActiveStation(strip)
          if (currentMode !== "APPROACHING") {
            setVehicleMode("APPROACHING")
          }
        } else if (currentMode === "APPROACHING" && minDistance > 13.5) {
          setActiveStation(null)
          setVehicleMode("CRUISING")
        }
      }
    },
    []
  )


  // Expose triggers to parent refs for UI / Touch buttons
  if (onTriggerLandRef) onTriggerLandRef.current = initiateEnterStation
  if (onTriggerTakeoffRef) onTriggerTakeoffRef.current = initiateExitStation
  if (onSkipNextRef) onSkipNextRef.current = skipToNextStation
  if (onSkipPrevRef) onSkipPrevRef.current = skipToPrevStation

  return (
    <div className="scene-root">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          shadows
          camera={{ fov: 48, near: 0.2, far: 350 }}
          dpr={[1, 1.75]} // 60 FPS mobile performance clamp
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          className="scene-canvas"
          eventSource={typeof document !== "undefined" ? document.body : undefined}
          eventPrefix="client"
        >
          {/* Lighting */}
          <ambientLight intensity={0.65} color="#e0e7ff" />
          <directionalLight
            position={[25, 45, 20]}
            intensity={1.3}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-28}
            shadow-camera-right={28}
            shadow-camera-top={28}
            shadow-camera-bottom={-28}
            shadow-camera-near={1}
            shadow-camera-far={100}
            color="#fff8e7"
          />
          <directionalLight position={[-15, 25, -15]} intensity={0.35} color="#818cf8" />

          {/* Sky Atmosphere & Distant Stars */}
          <Sky
            sunPosition={[100, 30, 80]}
            inclination={0.38}
            azimuth={0.25}
            turbidity={6}
            rayleigh={0.6}
          />
          <Stars radius={90} depth={45} count={900} factor={3} saturation={0} fade />

          {/* 3D World Ground Landscape & Roadways */}
          <World />

          {/* Cyber Roadster Ground Vehicle Controller */}
          <VehicleController
            mode={vehicleMode}
            activeStation={activeStation}
            activeBoardIndex={insideBoardIndex}
            pointerOffset={getEffectiveOffset()}
            throttleInput={throttleInput}
            steerInput={steerInput}
            targetPosition={targetPosition}
            targetHeading={targetHeading}
            onProgressUpdate={handleProgressUpdate}
            onInsideStationReached={handleInsideStationReached}
            onExitStationComplete={handleExitStationComplete}
            onEnterComplete={() => setVehicleMode("CRUISING")}
          />

          {/* Portfolio Stations with Inside 3D Exhibition Boards */}
          {STATIONS.map((station) => (
            <Station
              key={station.id}
              def={station}
              isNear={
                activeStation?.id === station.id ||
                (vehicleMode === "INSIDE_STATION" && openStation === station.id)
              }
              activeBoardIndex={insideBoardIndex}
              onEnter={() => {
                const strip = STATION_AIRSTRIPS[station.id]
                setActiveStation(strip)
                setVehicleMode("ENTERING_STATION")
              }}
            />
          ))}

          {/* Ground Vehicle HUD, Board Slider & Fixed GPS Radar Minimap */}
          <HUD
            vehicleMode={vehicleMode}
            activeStation={activeStation}
            nearStation={activeStation ? activeStation.id : null}
            activeBoardIndex={insideBoardIndex}
            onBoardChange={setInsideBoardIndex}
            vehiclePos={vehiclePos}
            speed={speed}
            progress={progress}
            onEnterStation={initiateEnterStation}
            onExitStation={initiateExitStation}
            onOpenDetails={() => setModalOpen(true)}
            onSkipNext={skipToNextStation}
            onSkipPrev={skipToPrevStation}
            onDriveToSection={driveToSection}
          />
        </Canvas>
      </Suspense>

      {/* 2D Accessible Project Modal */}
      <ContentModal
        stationId={modalOpen ? openStation : null}
        onClose={closeModal}
      />
    </div>
  )
}
