'use client'

import React from 'react'
import { useGesture } from '@use-gesture/react'

interface KidsFrameProps {
  children: React.ReactNode
  frameMenu?: React.ReactNode
  isGameActive?: boolean
}

export default function KidsFrame({ children, frameMenu, isGameActive = false }: KidsFrameProps): React.JSX.Element {
  return (
    <div className="kids-frame-container">
      {/* Decorative Corner Elements */}
      <div className="frame-corner top-left">
        <div className="corner-decoration">🌟</div>
      </div>
      <div className="frame-corner top-right">
        <div className="corner-decoration">🎈</div>
      </div>
      <div className="frame-corner bottom-left">
        <div className="corner-decoration">🌈</div>
      </div>
      {isGameActive && (
        <div className="frame-corner bottom-right interactive-corner">
          <div 
            className="menu-indicator"
            {...useGesture({
              onPointerDown: () => {
                const event = new CustomEvent('frameMenuToggle');
                window.dispatchEvent(event);
              }
            })()}
            style={{ 
              touchAction: 'manipulation',
              cursor: 'pointer',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}
          >⚙️</div>
        </div>
      )}

      {/* Top Border Decorations */}
      <div className="frame-border top-border">
        <div className="border-decoration">🦋</div>
        <div className="border-decoration">🌸</div>
        <div className="border-decoration">⭐</div>
        <div className="border-decoration">🌺</div>
        <div className="border-decoration">🦋</div>
      </div>

      {/* Bottom Border Decorations */}
      <div className="frame-border bottom-border">
        <div className="border-decoration">🌻</div>
        {isGameActive && (
          <div className="exit-hint">
          💻 Computer : Press any key to play and Ctrl+K to exit 📱 Mobile: Tap anywhere to play
                      </div>
        )}
        <div className="border-decoration">🌻</div>
      </div>

      {/* Left Border Decorations */}
      <div className="frame-border left-border">
        <div className="border-decoration">🎨</div>
        <div className="border-decoration">🎭</div>
        <div className="border-decoration">🎪</div>
      </div>

      {/* Right Border Decorations */}
      <div className="frame-border right-border">
        <div className="border-decoration">🎵</div>
        <div className="border-decoration">🎶</div>
        {isGameActive && (
          <div className="settings-label">
            <div className="settings-char">S</div>
            <div className="settings-char">e</div>
            <div className="settings-char">t</div>
            <div className="settings-char">t</div>
            <div className="settings-char">i</div>
            <div className="settings-char">n</div>
            <div className="settings-char">g</div>
            <div className="settings-char">s</div>
            <div className="settings-char">⬇️</div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="frame-content">
        {children}
      </div>

      {/* Frame Menu (if provided and game is active) */}
      {isGameActive && frameMenu}

      {/* Animated Floating Elements */}
      <div className="floating-elements">
        <div className="floating-element" style={{ animationDelay: '0s' }}>✨</div>
        <div className="floating-element" style={{ animationDelay: '2s' }}>💫</div>
        <div className="floating-element" style={{ animationDelay: '4s' }}>⭐</div>
        <div className="floating-element" style={{ animationDelay: '1s' }}>🌟</div>
        <div className="floating-element" style={{ animationDelay: '3s' }}>✨</div>
      </div>
    </div>
  )
}