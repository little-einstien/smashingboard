"use client";

import React from "react";
import { useGesture } from "@use-gesture/react";
import type { Category } from "../page";

interface CategorySelectorProps {
  onCategorySelect: (category: Category) => void;
}

const categories = [
  {
    id: "alphabets" as Category,
    name: "Alphabets",
    emoji: "🔤",
    description: "Learn A-Z letters",
    color: "#ff6b6b",
  },
  {
    id: "animals" as Category,
    name: "Animals",
    emoji: "🐶",
    description: "Meet cute creatures",
    color: "#4ecdc4",
  },
  {
    id: "fruits" as Category,
    name: "Fruits & Veggies",
    emoji: "🍎",
    description: "Colorful healthy foods",
    color: "#45b7d1",
  },
  {
    id: "numbers" as Category,
    name: "Numbers",
    emoji: "🔢",
    description: "Count 1-10 and more",
    color: "#96ceb4",
  },
  {
    id: "languages" as Category,
    name: "Indian Languages",
    emoji: "🌍",
    description: "Explore different scripts",
    color: "#feca57",
  },
];

export default function CategorySelector({
  onCategorySelect,
}: CategorySelectorProps): React.JSX.Element {
  const handleCategorySelect = (categoryId: Category) => {
    // Add a small delay to ensure the touch event is properly processed
    setTimeout(() => {
      onCategorySelect(categoryId);
    }, 100);
  };

  return (
    <div className="landing-container">
      {/* Row 1: Logo */}
      <div className="landing-header">
        <div className="logo-container">
          <img
            src="./assets/logo.png"
            alt="Baby Keyboard Logo"
            className="landing-logo"
          />
        </div>
      </div>

      {/* Row 2: Main Content */}
      <div className="landing-main-content">
        {/* Left Section: Categories */}
        <div className="landing-left-section">
          <div className="categories-section">
                                <div className="subtitle">Click on any category below to start learning!</div>
                    <div className="section-title">Choose Your Adventure!</div>
            <div className="categories-grid">
              {categories.map((category) => {
                const bind = useGesture({
                  onPointerDown: () => {
                    handleCategorySelect(category.id);
                  },
                });

                return (
                                     <button
                     key={category.id}
                     className="category-card"
                     {...bind()}
                     title={`${category.name} - ${category.description}`}
                     style={
                       {
                         "--category-color": category.color,
                         touchAction: "manipulation",
                         cursor: "pointer",
                         userSelect: "none",
                         WebkitTapHighlightColor: "transparent",
                       } as React.CSSProperties
                     }
                   >
                     <div className="category-emoji">{category.emoji}</div>
                   </button>
                );
              })}
            </div>
          </div>
        </div>

                 {/* Right Section: Points */}
         <div className="landing-right-section">
           <div className="points-section">
             <div className="section-title">Why Parents Love It!</div>
             <div className="points-list">
               <div className="point-item">
                 <span className="point-bullet">🎯</span>
                 <span className="point-text">
                   <span className="point-highlight">Tap & Learn</span> - Instant visual magic with every touch
                 </span>
               </div>
               <div className="point-item">
                 <span className="point-bullet">🎵</span>
                 <span className="point-text">
                   <span className="point-highlight">Baby-Safe Sounds</span> - Gentle melodies with mute option
                 </span>
               </div>
               <div className="point-item">
                 <span className="point-bullet">🌍</span>
                 <span className="point-text">
                   <span className="point-highlight">5 Learning Categories</span> - Letters, Numbers, Animals, Fruits & Languages
                 </span>
               </div>
               <div className="point-item">
                 <span className="point-bullet">📱</span>
                 <span className="point-text">
                   <span className="point-highlight">Mobile-Friendly</span> - Perfect for little fingers
                 </span>
               </div>
             </div>
           </div>
         </div>
      </div>

           </div>
   );
 }
