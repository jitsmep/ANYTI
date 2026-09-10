"use client"

import React, { useRef } from "react"

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
  const activeKeys = useRef<Record<KeyType, boolean>>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    action: false,
  })

  function updateKey(key: KeyType, active: boolean) {
    if (activeKeys.current[key] !== active) {
      activeKeys.current[key] = active
      onKeysChange({ ...activeKeys.current })
    }
  }

  function makeButtonProps(key: KeyType) {
    const start = (e: React.SyntheticEvent) => {
      e.stopPropagation()
      updateKey(key, true)
    }

    const stop = (e: React.SyntheticEvent) => {
      e.stopPropagation()
      updateKey(key, false)
    }

    return {
      onPointerDown: start,
      onPointerUp: stop,
      onPointerCancel: stop,
      onTouchStart: start,
      onTouchEnd: stop,
      onTouchCancel: stop,
      onMouseDown: start,
      onMouseUp: stop,
      onMouseLeave: stop,
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    }
  }

  return (
    <div className="touch-controls" aria-label="Touch driving controls">
      {/* D-Pad */}
      <div className="dpad">
        <button
          type="button"
          className="dpad-btn dpad-up"
          aria-label="Forward"
          {...makeButtonProps("forward")}
        >
          ▲
        </button>
        <button
          type="button"
          className="dpad-btn dpad-left"
          aria-label="Left"
          {...makeButtonProps("left")}
        >
          ◀
        </button>
        <div className="dpad-center" />
        <button
          type="button"
          className="dpad-btn dpad-right"
          aria-label="Right"
          {...makeButtonProps("right")}
        >
          ▶
        </button>
        <button
          type="button"
          className="dpad-btn dpad-down"
          aria-label="Backward"
          {...makeButtonProps("backward")}
        >
          ▼
        </button>
      </div>

      {/* Action button */}
      <button
        type="button"
        className="touch-action-btn"
        aria-label="Enter station"
        {...makeButtonProps("action")}
      >
        ENTER
      </button>
    </div>
  )
}
