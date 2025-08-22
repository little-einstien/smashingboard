'use client'

import React from 'react'
import { useGesture } from '@use-gesture/react'
import type { Category } from '../page'

interface CategorySelectorProps {
  onCategorySelect: (category: Category) => void
}

const categories = [
  { 
    id: 'alphabets' as Category, 
    name: 'Alphabets', 
    emoji: '🔤',
    description: 'Learn A-Z letters',
    color: '#ff6b6b'
  },
  { 
    id: 'animals' as Category, 
    name: 'Animals', 
    emoji: '🐾',
    description: 'Meet cute creatures',
    color: '#4ecdc4'
  },
  { 
    id: 'fruits' as Category, 
    name: 'Fruits & Veggies', 
    emoji: '🍎',
    description: 'Colorful healthy foods',
    color: '#45b7d1'
  },
  { 
    id: 'numbers' as Category, 
    name: 'Numbers', 
    emoji: '🔢',
    description: 'Count 1-10 and more',
    color: '#96ceb4'
  },
  { 
    id: 'languages' as Category, 
    name: 'Indian Languages', 
    emoji: '🌍',
    description: 'Explore different scripts',
    color: '#feca57'
  },
]

export default function CategorySelector({ onCategorySelect }: CategorySelectorProps): React.JSX.Element {
  const handleCategorySelect = (categoryId: Category) => {
    // Add a small delay to ensure the touch event is properly processed
    setTimeout(() => {
      onCategorySelect(categoryId)
    }, 100)
  }

  return (
    <div className="landing-container">
      {/* Header Section */}
      <div className="landing-header">
        <div className="logo-container">
          <img 
            src="./assets/logo.png" 
            alt="Baby Keyboard Logo" 
            className="landing-logo"
          />
        </div>
        <div className="subtitle">
          Press any key to see magic happen!
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-section">
        <div className="section-title">Choose Your Adventure!</div>
        <div className="categories-grid">
          {categories.map((category) => {
            const bind = useGesture({
              onPointerDown: () => {
                handleCategorySelect(category.id)
              }
            })

            return (
              <button
                key={category.id}
                className="category-card"
                {...bind()}
                style={{ 
                  '--category-color': category.color,
                  touchAction: 'manipulation',
                  cursor: 'pointer',
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent'
                } as React.CSSProperties}
              >
                <div className="category-emoji">{category.emoji}</div>
                <div className="category-name">{category.name}</div>
                <div className="category-description">{category.description}</div>
                <div className="category-glow"></div>
              </button>
            )
          })}
        </div>
      </div>

      
      {/* Footer */}
      <div className="landing-footer">
        <div className="footer-text">
          Made with ❤️ for little learners
        </div>
      </div>
    </div>
  )
}