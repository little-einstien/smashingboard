'use client'

import React, { useState, useEffect } from 'react'
import CategorySelector from './components/CategorySelector'
import GameArea from './components/GameArea'
import KidsFrame from './components/KidsFrame'
import AudioUnlocker from './components/AudioUnlocker'
import { setupAudioOnUserInteraction } from './utils/audioUtils'

export type Category = 'alphabets' | 'animals' | 'fruits' | 'numbers' | 'languages' | 'bearface'

export default function Home(): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [audioReady, setAudioReady] = useState(false)

  // Setup audio initialization on user interaction
  useEffect(() => {
    const setupAudio = async () => {
      setupAudioOnUserInteraction()
      
      // Check if audio is already available
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      if (audioContext.state === 'running') {
        setAudioReady(true)
      }
    }
    
    setupAudio()
  }, [])

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
  }

  const handleBackToMenu = () => {
    setSelectedCategory(null)
  }

  return (
    <main>
      <AudioUnlocker onAudioReady={() => setAudioReady(true)} />
      <KidsFrame isGameActive={!!selectedCategory}>
        {!selectedCategory ? (
          <CategorySelector onCategorySelect={handleCategorySelect} />
        ) : (
          <GameArea 
            category={selectedCategory} 
            onBackToMenu={handleBackToMenu}
          />
        )}
      </KidsFrame>
    </main>
  )
}