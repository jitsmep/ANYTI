"use client"

import React from "react"

interface TouchControlsProps {
  onKeysChange: (keys: {
    forward: boolean
    backward: boolean
    left: boolean
    right: boolean
    action: boolean
  }) => void
}

type KeyType = "forward" | "backward" | "left" | "right" | "action"

export default function TouchControls({ onKeysChange }: TouchControlsProps) {
  const activeKeys = React.useRef<Record<KeyType, boolean>>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    action: false,
  })

  // Track active pointer IDs per key for robust multi-touch support
  const keyPointers = React.useRef<Record<KeyType, number | null>>({
    forward: null,
    backward: null,
    left: null,
    right: null,
    action: null,
  })

  function updateKey(key: KeyType, active: boolean) {
    if (activeKeys.current[key] !== active) {
      activeKeys.current[key] = active
      onKeysChange({ ...activeKeys.current })
    }
  }

  function handlePointerDown(key: KeyType, e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    keyPointers.current[key] = e.pointerId
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Ignore fallback if browser restricts pointer capture
    }
    updateKey(key, true)
  }

  function handlePointerUp(key: KeyType, e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (keyPointers.current[key] === e.pointerId || keyPointers.current[key] === null) {
      keyPointers.current[key] = null
      updateKey(key, false)
    }
  }

  function handlePointerCancel(key: KeyType, e: React.PointerEvent<HTMLButtonElement>) {
    keyPointers.current[key] = null
    updateKey(key, false)
  }

  function makeButtonProps(key: KeyType) {
    return {
      onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => handlePointerDown(key, e),
      onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => handlePointerUp(key, e),
      onPointerCancel: (e: React.PointerEvent<HTMLButtonElement>) => handlePointerCancel(key, e),
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    }
  }

  return (
    <div className="touch-controls" aria-label="Touch driving controls">
      {/* D-Pad */}
      <div className="dpad">
        <button className="dpad-btn dpad-up" aria-label="Forward" {...makeButtonProps("forward")}>▲</button>
        <button className="dpad-btn dpad-left" aria-label="Left" {...makeButtonProps("left")}>◀</button>
        <div className="dpad-center" />
        <button className="dpad-btn dpad-right" aria-label="Right" {...makeButtonProps("right")}>▶</button>
        <button className="dpad-btn dpad-down" aria-label="Backward" {...makeButtonProps("backward")}>▼</button>
      </div>

      {/* Action button */}
      <button className="touch-action-btn" aria-label="Enter station" {...makeButtonProps("action")}>
        ENTER
      </button>
    </div>
  )
}
