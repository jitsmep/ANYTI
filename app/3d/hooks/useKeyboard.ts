"use client"

import { useEffect, useRef } from "react"

export interface KeyboardState {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  action: boolean
}

/**
 * Tracks WASD / Arrow key state and returns a stable ref.
 * Using a ref avoids re-renders on every keypress.
 */
export function useKeyboard(): React.MutableRefObject<KeyboardState> {
  const keys = useRef<KeyboardState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    action: false,
  })

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key) ||
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)
      ) {
        e.preventDefault()
      }

      const k = e.key.toLowerCase()
      const c = e.code

      if (k === "arrowup" || k === "w" || c === "KeyW" || c === "ArrowUp") {
        keys.current.forward = true
      }
      if (k === "arrowdown" || k === "s" || c === "KeyS" || c === "ArrowDown") {
        keys.current.backward = true
      }
      if (k === "arrowleft" || k === "a" || c === "KeyA" || c === "ArrowLeft") {
        keys.current.left = true
      }
      if (k === "arrowright" || k === "d" || c === "KeyD" || c === "ArrowRight") {
        keys.current.right = true
      }
      if (k === "enter" || c === "Enter") {
        keys.current.action = true
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      const k = e.key.toLowerCase()
      const c = e.code

      if (k === "arrowup" || k === "w" || c === "KeyW" || c === "ArrowUp") {
        keys.current.forward = false
      }
      if (k === "arrowdown" || k === "s" || c === "KeyS" || c === "ArrowDown") {
        keys.current.backward = false
      }
      if (k === "arrowleft" || k === "a" || c === "KeyA" || c === "ArrowLeft") {
        keys.current.left = false
      }
      if (k === "arrowright" || k === "d" || c === "KeyD" || c === "ArrowRight") {
        keys.current.right = false
      }
      if (k === "enter" || c === "Enter") {
        keys.current.action = false
      }
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  return keys
}
