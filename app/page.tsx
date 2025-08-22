'use client'

import React, { useState, useEffect } from 'react'
import CategorySelector from './components/CategorySelector'
import GameArea from './components/GameArea'
import KidsFrame from './components/KidsFrame'
import { setupAudioOnUserInteraction } from './utils/audioUtils'

export type Category = 'alphabets' | 'animals' | 'fruits' | 'numbers' | 'languages' | 'bearface'

export default function Home(): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Setup audio initialization on user interaction
  useEffect(() => {
    setupAudioOnUserInteraction()
  }, [])

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
  }

  const handleBackToMenu = () => {
    setSelectedCategory(null)
  }

  return (
    <main>
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