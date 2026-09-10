"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import ClassicView from "./ClassicView"
import TouchControls from "./TouchControls"

// Dynamically import Scene to avoid SSR issues with WebGL + WASM
const Scene = dynamic(() => import("./Scene"), { ssr: false })

export default function PortfolioRoot() {
  const [isClassic, setIsClassic] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [touchKeys, setTouchKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    action: false,
  })

  // Detect touch capability or small screen size on mount & resize
  useEffect(() => {
    function checkTouch() {
      const isCoarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
      const isSmallScreen = typeof window !== "undefined" && window.innerWidth <= 768
      const hasTouch =
        typeof navigator !== "undefined" &&
        (navigator.maxTouchPoints > 0 || "ontouchstart" in window)
      setIsTouchDevice(isCoarse || isSmallScreen || hasTouch)
    }

    checkTouch()
    window.addEventListener("resize", checkTouch)
    return () => window.removeEventListener("resize", checkTouch)
  }, [])

  return (
    <>
      {isClassic ? (
        <ClassicView />
      ) : (
        <div className="portfolio-root-3d">
          <Scene touchKeys={touchKeys} />
          {isTouchDevice && <TouchControls onKeysChange={setTouchKeys} />}
        </div>
      )}

      {/* Persistent toggle button */}
      <button
        id="portfolio-view-toggle"
        className="view-toggle-btn"
        onClick={() => setIsClassic((v) => !v)}
        aria-label={isClassic ? "Switch to 3D World" : "Switch to Classic View"}
        title={isClassic ? "Enter 3D World" : "Classic Portfolio View"}
      >
        {isClassic ? (
          <>
            <span className="view-toggle-icon">🎮</span>
            <span>3D World</span>
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
