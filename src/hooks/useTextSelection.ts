import { useState, useEffect, useRef } from 'react'

interface SelectionPosition {
  text: string
  x: number
  top: number
  bottom: number
}

export function useTextSelection() {
  const [selection, setSelection] = useState<SelectionPosition | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (popupRef.current?.contains(e.target as Node)) return

      const sel = window.getSelection()
      if (!sel || sel.isCollapsed || !sel.toString().trim()) return

      const range = sel.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setSelection({
        text: sel.toString().trim(),
        x: rect.left + rect.width / 2,
        top: rect.top,
        bottom: rect.bottom,
      })
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (popupRef.current?.contains(e.target as Node)) return
      setSelection(null)
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousedown', handleMouseDown)
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return { selection, popupRef, clear: () => setSelection(null) }
}
