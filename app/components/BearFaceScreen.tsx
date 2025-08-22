'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { getGlobalAudioContext, ensureAudioContextRunning, unlockAudio } from '../utils/audioUtils'
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
    
    const itemIdRef = useRef(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const initAudio = async () => {
        // Use global audio context and ensure it's unlocked
        await unlockAudio()
        return getGlobalAudioContext()
    }

    const playSound = async (frequency = 440, duration = 200) => {
        try {
            const audioContext = getGlobalAudioContext()
            if (!audioContext) return

            // Ensure audio context is running (required for iOS)
            await ensureAudioContextRunning()

            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
            oscillator.type = 'sine'

            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + duration / 1000)
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

    const handleKeyPress = useCallback(async (event: KeyboardEvent) => {
        await initAudio()

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
    }, [onBackToMenu, createFloatingItem])

    const handleTouch = useCallback(async () => {
        await initAudio()

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
    }, [createFloatingItem])

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