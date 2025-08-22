'use client'

import React, { useState } from 'react'
import CategorySelector from './components/CategorySelector'
import GameArea from './components/GameArea'
import KidsFrame from './components/KidsFrame'

export type Category = 'alphabets' | 'animals' | 'fruits' | 'numbers' | 'languages' | 'bearface'

export default function Home(): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

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