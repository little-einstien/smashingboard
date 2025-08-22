'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import FrameMenu from './FrameMenu'

interface BearFaceScreenProps {
    onBackToMenu: () => void
}

interface Position {
    x: number
    y: number
}

interface FloatingItem {
    id: number
    item: string
    x: number
    y: number
    color: string
    size: number
}

const funItems = [
    // Emojis
    '🎉', '⭐', '🌟', '✨', '🎈', '🎊', '🌈', '🦋', '🌸', '🌺',
    '🍭', '🍬', '🎀', '💖', '💝', '🎁', '🌙', '☀️', '🌻', '🌷',
    
    // Letters
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    
    // Numbers
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    
    // Fun symbols
    '♪', '♫', '♬', '♩', '❤️', '💕', '💫', '⚡', '🔥', '💎'
]

const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
    '#fd79a8', '#fdcb6e', '#6c5ce7', '#a29bfe', '#ff7675'
]

export default function BearFaceScreen({ onBackToMenu }: BearFaceScreenProps): React.JSX.Element {
    const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([])
    const [keyPressed, setKeyPressed] = useState('')
    const [bearExpression, setBearExpression] = useState('happy')
    const [isAnimating, setIsAnimating] = useState(false)
    
    const audioContextRef = useRef<AudioContext | null>(null)
    const [isAudioInitialized, setIsAudioInitialized] = useState(false)
    const itemIdRef = useRef(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const initAudio = () => {
        if (!isAudioInitialized && typeof window !== 'undefined') {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
                setIsAudioInitialized(true)
            } catch (error) {
                console.log('Audio not supported')
            }
        }
    }

    const playSound = (frequency = 440, duration = 200) => {
        if (!audioContextRef.current) return

        try {
            const oscillator = audioContextRef.current.createOscillator()
            const gainNode = audioContextRef.current.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContextRef.current.destination)

            oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
            oscillator.type = 'sine'

            gainNode.gain.setValueAtTime(0.2, audioContextRef.current.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000)

            oscillator.start(audioContextRef.current.currentTime)
            oscillator.stop(audioContextRef.current.currentTime + duration / 1000)
        } catch (error) {
            console.log('Error playing sound:', error)
        }
    }

    const createFloatingItem = useCallback(() => {
        const randomItem = funItems[Math.floor(Math.random() * funItems.length)]
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        const size = Math.random() * 40 + 20 // 20-60px
        
        const newItem: FloatingItem = {
            id: itemIdRef.current++,
            item: randomItem,
            x: Math.random() * 80 + 10, // 10-90% of screen width
            y: Math.random() * 60 + 20, // 20-80% of screen height
            color: randomColor,
            size
        }

        setFloatingItems(prev => [...prev, newItem])

        // Remove item after animation
        setTimeout(() => {
            setFloatingItems(prev => prev.filter(item => item.id !== newItem.id))
        }, 3000)
    }, [])

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (!isAudioInitialized) {
            initAudio()
        }

        // Check for Ctrl+K combination
        if (event.ctrlKey && event.key.toLowerCase() === 'k') {
            if (confirm('Exit the bear face?')) {
                onBackToMenu()
            }
            return
        }

        event.preventDefault()

        // Show pressed key
        let displayKey = event.key
        if (displayKey === ' ') displayKey = 'SPACE'
        if (displayKey.length > 1) displayKey = displayKey.toUpperCase()
        setKeyPressed(displayKey)

        // Create multiple floating items
        const numItems = Math.floor(Math.random() * 3) + 2 // 2-4 items
        for (let i = 0; i < numItems; i++) {
            setTimeout(() => createFloatingItem(), i * 100)
        }

        // Animate bear face
        setIsAnimating(true)
        setBearExpression(Math.random() > 0.5 ? 'excited' : 'happy')
        
        setTimeout(() => {
            setIsAnimating(false)
            setBearExpression('happy')
        }, 500)

        // Play sound
        const keyCode = event.code ? event.code.charCodeAt(0) : event.key.charCodeAt(0)
        const frequency = 200 + (keyCode * 2)
        playSound(frequency, 300)

        // Clear key display
        setTimeout(() => setKeyPressed(''), 1000)
    }, [isAudioInitialized, onBackToMenu, createFloatingItem])

    const handleTouch = useCallback(() => {
        if (!isAudioInitialized) {
            initAudio()
        }

        setKeyPressed('TAP!')

        // Create multiple floating items
        const numItems = Math.floor(Math.random() * 3) + 2 // 2-4 items
        for (let i = 0; i < numItems; i++) {
            setTimeout(() => createFloatingItem(), i * 100)
        }

        // Animate bear face
        setIsAnimating(true)
        setBearExpression('excited')
        
        setTimeout(() => {
            setIsAnimating(false)
            setBearExpression('happy')
        }, 500)

        // Play sound
        const frequency = 300 + Math.random() * 200
        playSound(frequency, 300)

        // Clear key display
        setTimeout(() => setKeyPressed(''), 1000)
    }, [isAudioInitialized, createFloatingItem])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)
        document.addEventListener('contextmenu', (e) => e.preventDefault())

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
            document.removeEventListener('contextmenu', (e) => e.preventDefault())
        }
    }, [handleKeyPress])

    const getBearFace = () => {
        switch (bearExpression) {
            case 'excited':
                return '🤩'
            case 'happy':
            default:
                return '🐻'
        }
    }

    return (
        <div 
            className="bear-face-container"
            ref={containerRef}
            onClick={handleTouch}
            onTouchStart={handleTouch}
        >
            {/* Bear Face */}
            <div className={`bear-face ${isAnimating ? 'bear-bounce' : ''}`}>
                <div className="bear-emoji">
                    {getBearFace()}
                </div>
                <div className="bear-cheeks">
                    <div className="cheek left-cheek"></div>
                    <div className="cheek right-cheek"></div>
                </div>
            </div>

            {/* Floating Items */}
            {floatingItems.map((item) => (
                <div
                    key={item.id}
                    className="floating-item"
                    style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        color: item.color,
                        fontSize: `${item.size}px`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    {item.item}
                </div>
            ))}

            {/* Key Display */}
            {keyPressed && (
                <div className="key-display bear-key-display">
                    {keyPressed}
                </div>
            )}

            {/* Instructions */}
            <div className="bear-instructions">
                Press any key or tap to make the bear happy! 🐻✨
                <br />
                <small>Press Ctrl+K to go back</small>
            </div>

            {/* Frame Menu */}
            <FrameMenu
                onBackToMenu={onBackToMenu}
                currentBackground="default"
                onBackgroundChange={() => {}} // Bear face doesn't use background themes
                settings={{
                    showBackgroundObjects: false,
                    randomPositions: true,
                    soundEnabled: true
                }}
                onSettingToggle={() => {}} // Bear face doesn't use these settings
            />
        </div>
    )
}