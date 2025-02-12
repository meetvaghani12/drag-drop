"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import DragCard from "@/components/DragCard"

interface Card {
  id: number
  title: string
  description: string
  content: string
  width?: number
  height?: number
}

const cardsData: Card[] = [
  {
    id: 1,
    title: "Card 1",
    description: "This is card 1",
    content: "Students' presence is recorded in real-time, and parents receive instant notifications in case of absenteeism. The system also generates detailed reports for better tracking and analysis.",
    width: 256,
    height: 192
  },
  {
    id: 2,
    title: "Card 2",
    description: "This is card 2",
    content: "The system calculates grades automatically and provides performance insights to help students improve. Parents and students can access results anytime through the online portal.",
    width: 256,
    height: 192
  },
  {
    id: 3,
    title: "Card 3",
    description: "This is card 3",
    content: "Managing school finances is now effortless with our ERP system. It allows secure online fee payments, generates automated invoices, and tracks pending dues",
    width: 256,
    height: 192
  },
]

export default function Home() {
  const [cards, setCards] = useState(cardsData)

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const newCards = [...cards]
    const dragCard = newCards[dragIndex]
    newCards.splice(dragIndex, 1)
    newCards.splice(hoverIndex, 0, dragCard)
    setCards(newCards)
  }

  const handleResize = (id: number, width: number, height: number) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, width, height } : card
    ))
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Draggable and Resizable Cards</h1>
        <div className="flex flex-wrap gap-6">
          {cards.map((card, index) => (
            <DragCard 
              key={card.id} 
              {...card} 
              index={index} 
              moveCard={moveCard}
              onResize={handleResize}
            />
          ))}
        </div>
      </main>
    </DndProvider>
  )
}