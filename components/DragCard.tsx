"use client"

import { useRef, useState, useEffect } from "react"
import { useDrag, useDrop } from "react-dnd"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface CardProps {
  id: number
  title: string
  description: string
  content: string
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
  width?: number
  height?: number
  onResize: (id: number, width: number, height: number) => void
}

const DragCard = ({ 
  id, 
  title, 
  description, 
  content, 
  index, 
  moveCard,
  width = 256,
  height = 192,
  onResize 
}: CardProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const dialogTriggerRef = useRef<HTMLButtonElement>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [currentWidth, setCurrentWidth] = useState(width)
  const [currentHeight, setCurrentHeight] = useState(height)

  const [{ handlerId }, drop] = useDrop<
    { id: number; index: number },
    unknown,
    { handlerId: string | symbol | null }
  >({
    accept: "card",
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId() as string | symbol | null,
    }),
    hover(item, monitor) {
      if (!ref.current || isResizing) return

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()

      if (!clientOffset) return

      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      moveCard(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isResizing,
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const newWidth = Math.max(200, e.clientX - rect.left)
      const newHeight = Math.max(150, e.clientY - rect.top)

      setCurrentWidth(newWidth)
      setCurrentHeight(newHeight)
      onResize(id, newWidth, newHeight)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, id, onResize])

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
  }

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  return (
    <div 
      ref={ref} 
      style={{ 
        opacity,
        width: `${currentWidth}px`,
        height: `${currentHeight}px`,
        position: 'relative',
        transition: isResizing ? 'none' : 'all 0.2s ease'
      }} 
      data-handler-id={handlerId}
      className="group"
    >
      <Dialog>
        <DialogTrigger ref={dialogTriggerRef}>
          <Card 
            className="w-full h-full cursor-move relative overflow-hidden"
            onClick={(e) => {
              if (isResizing) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
          >
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">{content}</p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <p>{description}</p>
            <h3 className="text-lg font-semibold mt-4">Content</h3>
            <p>{content}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-10"
        onMouseDown={startResize}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
          }}
        />
      </div>
    </div>
  )
}

export default DragCard