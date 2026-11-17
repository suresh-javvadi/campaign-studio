import { useEffect, useRef } from 'react'
import { Canvas } from 'fabric'

/**
 * Owns the Fabric.js canvas instance. The canvas's internal (design) resolution
 * stays fixed at `width`/`height` for the whole session — only its CSS display
 * size changes on resize, via Fabric's `cssOnly` dimension mode, so object
 * coordinates and exported output always match the real design dimensions.
 */
function FabricCanvas({ width, height, onReady }) {
  const canvasElRef = useRef(null)
  const wrapperRef = useRef(null)
  const fabricRef = useRef(null)
  const onReadyRef = useRef(onReady)

  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    const canvas = new Canvas(canvasElRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    })
    fabricRef.current = canvas
    onReadyRef.current(canvas)

    return () => {
      canvas.dispose()
      fabricRef.current = null
    }
    // Design dimensions are fixed for the lifetime of a project and must not
    // re-initialize the canvas; onReady is read from a ref above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const resize = () => {
      const canvas = fabricRef.current
      if (!canvas) return
      const { clientWidth, clientHeight } = wrapper
      const scale = Math.min(clientWidth / width, clientHeight / height, 1)
      canvas.setDimensions(
        { width: width * scale, height: height * scale },
        { cssOnly: true },
      )
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [width, height])

  return (
    <div
      ref={wrapperRef}
      className="flex-1 min-w-0 min-h-0 flex items-center justify-center"
    >
      <canvas
        ref={canvasElRef}
        className="shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_8px_24px_-6px_rgba(0,0,0,0.12)]"
      />
    </div>
  )
}

export default FabricCanvas
