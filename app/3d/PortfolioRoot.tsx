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

  // Lock document scroll and overscroll-behavior while in 3D mode to prevent scroll borders and flicker
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

  return (
    <>
      {isClassic ? (
        <ClassicView />
      ) : (
        <>
          <div className="portfolio-root-3d">
            <Scene touchKeys={touchKeys} />
          </div>
          {/* TouchControls rendered OUTSIDE the canvas div so R3F Canvas
              cannot intercept touch events meant for the D-pad buttons */}
          {isTouchDevice && !isClassic && (
            <TouchControls onKeysChange={setTouchKeys} />
          )}
        </>
      )}

      {/* Persistent toggle button */}
      <button
        id="portfolio-view-toggle"
        className="view-toggle-btn"
        type="button"
        onClick={() => setIsClassic((v) => !v)}
        onPointerDown={(e) => {
          // Ensure immediate touch response without 300ms delay
          e.stopPropagation()
        }}
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
