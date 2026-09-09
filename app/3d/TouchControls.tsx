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

export default function TouchControls({ onKeysChange }: TouchControlsProps) {
  const keys = React.useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    action: false,
  })

  function press(key: keyof typeof keys.current, active: boolean) {
    keys.current[key] = active
    onKeysChange({ ...keys.current })
  }

  function makeButtonProps(key: keyof typeof keys.current) {
    return {
      onPointerDown: () => press(key, true),
      onPointerUp: () => press(key, false),
      onPointerLeave: () => press(key, false),
      onPointerCancel: () => press(key, false),
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
