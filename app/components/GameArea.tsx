'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { Category } from '../page'
import FrameMenu from './FrameMenu'

interface GameAreaProps {
    category: Category
    onBackToMenu: () => void
}

interface Position {
    x: number
    y: number
}

interface Settings {
    showBackgroundObjects: boolean
    randomPositions: boolean
    soundEnabled: boolean
}

type BackgroundTheme = 'default' | 'stars' | 'ocean' | 'forest' | 'sunset' | 'rainbow'
type Language = 'hindi' | 'punjabi' | 'tamil' | 'kannada' | 'marathi'

const categoryData = {
    alphabets: {
        items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#fd79a8', '#fdcb6e', '#6c5ce7']
    },
    animals: {
        items: ['🐻', '🐱', '🐶', '🦁', '🐸', '🐰', '🐼', '🦊', '🐯', '🐨', '🐵', '🐷', '🐮', '🐔', '🦆', '🐧', '🦋', '🐝', '🐞', '🦀'],
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#fd79a8']
    },
    fruits: {
        items: ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍒', '🥭', '🍍', '🥕', '🥒', '🍅', '🥬', '🥦', '🌽', '🍆', '🥔', '🧄', '🧅'],
        colors: ['#ff6b6b', '#feca57', '#fd79a8', '#96ceb4', '#4ecdc4', '#fdcb6e']
    },
    numbers: {
        items: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '0️⃣'],
        colors: ['#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e', '#4ecdc4', '#45b7d1']
    },
    languages: {
        items: [], // Will be populated based on selected language
        colors: {
            hindi: ['#ff9a56', '#ff6b9d', '#c44569', '#fd79a8', '#ff7675'],
            punjabi: ['#f39c12', '#e74c3c', '#9b59b6', '#fd79a8', '#fdcb6e'],
            tamil: ['#e67e22', '#e74c3c', '#f39c12', '#fd79a8', '#ff7675'],
            kannada: ['#2ecc71', '#27ae60', '#16a085', '#00b894', '#55a3ff'],
            marathi: ['#3498db', '#2980b9', '#8e44ad', '#6c5ce7', '#a29bfe']
        }
    }
}

const languageData = {
    hindi: {
        name: 'हिंदी',
        items: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ', 'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ', 'ड', 'ढ', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह']
    },
    punjabi: {
        name: 'ਪੰਜਾਬੀ',
        items: ['ਅ', 'ਆ', 'ਇ', 'ਈ', 'ਉ', 'ਊ', 'ਏ', 'ਐ', 'ਓ', 'ਔ', 'ਕ', 'ਖ', 'ਗ', 'ਘ', 'ਚ', 'ਛ', 'ਜ', 'ਝ', 'ਟ', 'ਠ', 'ਡ', 'ਢ', 'ਤ', 'ਥ', 'ਦ', 'ਧ', 'ਨ', 'ਪ', 'ਫ', 'ਬ', 'ਭ', 'ਮ', 'ਯ', 'ਰ', 'ਲ', 'ਵ', 'ਸ਼', 'ਸ', 'ਹ']
    },
    tamil: {
        name: 'தமிழ்',
        items: ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ', 'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன', 'ஜ', 'ஷ', 'ஸ', 'ஹ']
    },
    kannada: {
        name: 'ಕನ್ನಡ',
        items: ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ೠ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ', 'ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ', 'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ', 'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ', 'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ', 'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ', 'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ', 'ಸ', 'ಹ']
    },
    marathi: {
        name: 'मराठी',
        items: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह', 'ळ']
    }
}

export default function GameArea({ category, onBackToMenu }: GameAreaProps): React.JSX.Element {
    const [currentItem, setCurrentItem] = useState('')
    const [keyPressed, setKeyPressed] = useState('')
    const [isAnimating, setIsAnimating] = useState(false)
    const [currentPosition, setCurrentPosition] = useState<Position>({ x: 50, y: 50 })
    const [characterInstances, setCharacterInstances] = useState<Array<{ 
        item: string; 
        x: number; 
        y: number; 
        id: number; 
        className: string;
        isSecondary: boolean;
    }>>([])
    const [backgroundObjects, setBackgroundObjects] = useState<Array<{ item: string; x: number; y: number; id: number }>>([])
    const [showSettings, setShowSettings] = useState(false)
    const [showBackgrounds, setShowBackgrounds] = useState(false)
    const [showLanguages, setShowLanguages] = useState(false)
    const [currentBackground, setCurrentBackground] = useState<BackgroundTheme>('default')
    const [selectedLanguage, setSelectedLanguage] = useState<Language>('hindi')
    const [settings, setSettings] = useState<Settings>({
        showBackgroundObjects: true,
        randomPositions: true,
        soundEnabled: true
    })

    const animationAreaRef = useRef<HTMLDivElement>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const [isAudioInitialized, setIsAudioInitialized] = useState(false)
    const backgroundObjectIdRef = useRef(0)
    const characterInstanceIdRef = useRef(0)

    const data = category === 'languages'
        ? { ...categoryData[category], items: languageData[selectedLanguage].items }
        : category === 'bearface' 
        ? { items: ['🐻'], colors: ['#ff6b6b'] } // Fallback for bearface, though it shouldn't reach here
        : categoryData[category]

    useEffect(() => {
        // Set initial item
        setCurrentItem(data.items[0])
        // Generate background objects
        generateBackgroundObjects()
    }, [category, data.items])

    const generateBackgroundObjects = useCallback(() => {
        if (!settings.showBackgroundObjects) return

        const objects = []
        // Reduce from 12 to 6 background objects for better performance
        for (let i = 0; i < 6; i++) {
            const randomItem = data.items[Math.floor(Math.random() * data.items.length)]
            objects.push({
                item: randomItem,
                x: Math.random() * 90 + 5, // 5% to 95% to avoid edges
                y: Math.random() * 90 + 5,
                id: backgroundObjectIdRef.current++
            })
        }
        setBackgroundObjects(objects)
    }, [settings.showBackgroundObjects, data.items])

    const getRandomPosition = (isSecondary = false): Position => {
        // Define safe zones to avoid UI elements
        const safeZones = [
            { x: 10, y: 85, width: 80, height: 10 }, // Bottom area for key display
            { x: 0, y: 0, width: 15, height: 15 },   // Top left for back button
            { x: 85, y: 0, width: 15, height: 15 },  // Top right for settings
            { x: 20, y: 5, width: 60, height: 15 }   // Top center for title
        ]

        let position: Position
        let attempts = 0

        do {
            if (isSecondary) {
                // Secondary characters appear further from center
                const angle = Math.random() * 2 * Math.PI
                const distance = 25 + Math.random() * 30 // 25-55% distance from center
                position = {
                    x: 50 + Math.cos(angle) * distance,
                    y: 50 + Math.sin(angle) * distance
                }
                // Clamp to screen bounds
                position.x = Math.max(10, Math.min(90, position.x))
                position.y = Math.max(15, Math.min(85, position.y))
            } else {
                // Main character appears in center area
                position = {
                    x: Math.random() * 40 + 30, // 30% to 70% of screen width (center area)
                    y: Math.random() * 30 + 35   // 35% to 65% of screen height (center area)
                }
            }
            attempts++
        } while (attempts < 10 && safeZones.some(zone =>
            position.x >= zone.x && position.x <= zone.x + zone.width &&
            position.y >= zone.y && position.y <= zone.y + zone.height
        ))

        return position
    }

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

    const playSound = (frequency = 220, duration = 400) => {
        if (!audioContextRef.current || !settings.soundEnabled) return

        try {
            // Create a melodious sequence of 3 harmonious notes
            const baseFreq = frequency
            const melody = [
                { freq: baseFreq, start: 0, duration: 0.15 },           // Root note
                { freq: baseFreq * 1.25, start: 0.15, duration: 0.15 }, // Perfect fourth
                { freq: baseFreq * 1.5, start: 0.3, duration: 0.1 }     // Perfect fifth
            ]

            melody.forEach((note, index) => {
                const oscillator = audioContextRef.current!.createOscillator()
                const gainNode = audioContextRef.current!.createGain()

                oscillator.connect(gainNode)
                gainNode.connect(audioContextRef.current!.destination)

                // Use triangle wave for softer, more musical tone
                oscillator.type = 'triangle'
                
                // Set frequency with gentle glide
                oscillator.frequency.setValueAtTime(note.freq, audioContextRef.current!.currentTime + note.start)
                oscillator.frequency.linearRampToValueAtTime(note.freq * 1.02, audioContextRef.current!.currentTime + note.start + note.duration)

                // Create gentle volume envelope for each note
                const noteStart = audioContextRef.current!.currentTime + note.start
                const noteEnd = noteStart + note.duration
                
                gainNode.gain.setValueAtTime(0, noteStart)
                gainNode.gain.linearRampToValueAtTime(0.08, noteStart + 0.02)
                gainNode.gain.linearRampToValueAtTime(0.06, noteStart + note.duration * 0.6)
                gainNode.gain.linearRampToValueAtTime(0, noteEnd)

                oscillator.start(noteStart)
                oscillator.stop(noteEnd)
            })

        } catch (error) {
            console.log('Error playing sound:', error)
        }
    }

    const createSparkles = useCallback((position: Position) => {
        if (!animationAreaRef.current) return

        // Reduce sparkles from 8 to 4 for better performance
        for (let i = 0; i < 4; i++) {
            const sparkle = document.createElement('div')
            sparkle.className = 'sparkle'

            const angle = (i / 4) * 360
            const distance = 80 + Math.random() * 30
            const x = Math.cos(angle * Math.PI / 180) * distance
            const y = Math.sin(angle * Math.PI / 180) * distance

            sparkle.style.left = `calc(${position.x}% + ${x}px)`
            sparkle.style.top = `calc(${position.y}% + ${y}px)`

            animationAreaRef.current.appendChild(sparkle)

            // Reduce cleanup time from 1000ms to 600ms
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle)
                }
            }, 600)
        }
    }, [])

    const changeBackgroundColor = useCallback(() => {
        // Removed background color changing to prevent overlay effects
        // The frame now handles all background styling
    }, [])

    const setBackgroundTheme = (theme: BackgroundTheme) => {
        setCurrentBackground(theme)
        document.body.className = theme === 'default' ? '' : `bg-${theme}`
    }

    const getCharacterClass = () => {
        if (category === 'alphabets') return 'character alphabet'
        if (category === 'numbers') return 'character number'
        if (category === 'languages') return `character ${selectedLanguage}`
        return 'character'
    }

    const languages = [
        { id: 'hindi' as Language, name: languageData.hindi.name },
        { id: 'punjabi' as Language, name: languageData.punjabi.name },
        { id: 'tamil' as Language, name: languageData.tamil.name },
        { id: 'kannada' as Language, name: languageData.kannada.name },
        { id: 'marathi' as Language, name: languageData.marathi.name }
    ]

    const createCharacterInstance = useCallback((item: string, position: Position, className: string, isSecondary = false) => {
        const instanceId = characterInstanceIdRef.current++
        const newInstance = {
            item,
            x: position.x,
            y: position.y,
            id: instanceId,
            className: isSecondary ? `${className} secondary` : className,
            isSecondary
        }
        
        setCharacterInstances(prev => [...prev, newInstance])
        
        // Remove instance after animation completes
        setTimeout(() => {
            setCharacterInstances(prev => prev.filter(instance => instance.id !== instanceId))
        }, 3000)
    }, [])

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        // Initialize audio on first interaction
        if (!isAudioInitialized) {
            initAudio()
        }

        // Check for Ctrl+K combination
        if (event.ctrlKey && event.key.toLowerCase() === 'k') {
            if (confirm('Exit the app?')) {
                onBackToMenu()
            }
            return
        }

        // Prevent default behavior
        event.preventDefault()

        // Get random item from current category
        const randomIndex = Math.floor(Math.random() * data.items.length)
        const selectedItem = data.items[randomIndex]
        setCurrentItem(selectedItem)

        // Main character position (center area)
        const mainPosition = settings.randomPositions ? getRandomPosition(false) : { x: 50, y: 50 }
        setCurrentPosition(mainPosition)

        // Create secondary character instances only if random positions is enabled
        if (settings.randomPositions) {
            const numSecondaryInstances = Math.floor(Math.random() * 2) + 2 // 2-3 secondary instances
            
            for (let i = 0; i < numSecondaryInstances; i++) {
                const secondaryPosition = getRandomPosition(true)
                
                setTimeout(() => {
                    createCharacterInstance(selectedItem, secondaryPosition, getCharacterClass(), true)
                }, i * 150) // Stagger secondary appearances
            }
        }

        // Show pressed key
        let displayKey = event.key
        if (displayKey === ' ') displayKey = 'SPACE'
        if (displayKey.length > 1) displayKey = displayKey.toUpperCase()

        setKeyPressed(displayKey)

        // Trigger animation - optimized timing
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 400)

        // Create effects
        createSparkles(mainPosition)
        changeBackgroundColor()

        // Play sound
        const keyCode = event.code ? event.code.charCodeAt(0) : event.key.charCodeAt(0)
        const frequency = 200 + (keyCode * 3)
        playSound(frequency, 300)

        // Clear key display - optimized timing
        setTimeout(() => setKeyPressed(''), 1000)
    }, [isAudioInitialized, data.items.length, onBackToMenu, settings, createCharacterInstance, getCharacterClass])

    const handleTouch = useCallback(() => {
        // Initialize audio on first interaction
        if (!isAudioInitialized) {
            initAudio()
        }

        // Get random item from current category
        const randomIndex = Math.floor(Math.random() * data.items.length)
        const selectedItem = data.items[randomIndex]
        setCurrentItem(selectedItem)

        // Main character position (center area)
        const mainPosition = settings.randomPositions ? getRandomPosition(false) : { x: 50, y: 50 }
        setCurrentPosition(mainPosition)

        // Create secondary character instances only if random positions is enabled
        if (settings.randomPositions) {
            const numSecondaryInstances = Math.floor(Math.random() * 2) + 2 // 2-3 secondary instances
            
            for (let i = 0; i < numSecondaryInstances; i++) {
                const secondaryPosition = getRandomPosition(true)
                
                setTimeout(() => {
                    createCharacterInstance(selectedItem, secondaryPosition, getCharacterClass(), true)
                }, i * 150) // Stagger secondary appearances
            }
        }

        setKeyPressed('TAP!')

        // Trigger animation - optimized timing
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 400)

        // Create effects
        createSparkles(mainPosition)
        changeBackgroundColor()

        // Play sound
        const frequency = 300 + Math.random() * 200
        playSound(frequency, 300)

        // Clear key display - optimized timing
        setTimeout(() => setKeyPressed(''), 1000)
    }, [isAudioInitialized, data.items.length, settings, createCharacterInstance, getCharacterClass])

    const toggleSetting = (key: keyof Settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    // Handle background objects when setting changes
    useEffect(() => {
        if (settings.showBackgroundObjects) {
            generateBackgroundObjects()
        } else {
            setBackgroundObjects([])
        }
    }, [settings.showBackgroundObjects, generateBackgroundObjects])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)
        document.addEventListener('contextmenu', (e) => e.preventDefault())

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
            document.removeEventListener('contextmenu', (e) => e.preventDefault())
        }
    }, [handleKeyPress])

    const backgroundThemes = [
        { id: 'default' as BackgroundTheme, name: 'Default' },
        { id: 'stars' as BackgroundTheme, name: 'Starry Night' },
        { id: 'ocean' as BackgroundTheme, name: 'Ocean Blue' },
        { id: 'forest' as BackgroundTheme, name: 'Forest Green' },
        { id: 'sunset' as BackgroundTheme, name: 'Sunset Orange' },
        { id: 'rainbow' as BackgroundTheme, name: 'Rainbow' }
    ]

    return (
        <>
            {/* Background Objects */}
            {settings.showBackgroundObjects && (
                <div className="background-objects">
                    {backgroundObjects.map((obj) => (
                        <div
                            key={obj.id}
                            className="background-object"
                            style={{
                                left: `${obj.x}%`,
                                top: `${obj.y}%`,
                            }}
                        >
                            {obj.item}
                        </div>
                    ))}
                </div>
            )}

            {/* Main Animation Area */}
            <div
                className="animation-area"
                ref={animationAreaRef}
                onClick={handleTouch}
                onTouchStart={handleTouch}
            >
                {/* Main Character with Backdrop */}
                <div
                    className={`${getCharacterClass()} ${isAnimating ? 'key-animation' : ''}`}
                    style={{
                        left: `${currentPosition.x}%`,
                        top: `${currentPosition.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div 
                        className="character-backdrop"
                        style={{
                            width: 'clamp(6rem, 20vw, 12rem)',
                            height: 'clamp(6rem, 20vw, 12rem)',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                    {currentItem}
                </div>

                {/* Fading Character Instances */}
                {characterInstances.map((instance) => (
                    <div
                        key={instance.id}
                        className={`character-instance ${instance.className}`}
                        style={{
                            left: `${instance.x}%`,
                            top: `${instance.y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <div 
                            className={`character-backdrop ${instance.isSecondary ? 'secondary' : ''}`}
                            style={{
                                width: instance.isSecondary ? 'clamp(3rem, 10vw, 6rem)' : 'clamp(6rem, 20vw, 12rem)',
                                height: instance.isSecondary ? 'clamp(3rem, 10vw, 6rem)' : 'clamp(6rem, 20vw, 12rem)',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                        {instance.item}
                    </div>
                ))}
            </div>

            {/* Game Content */}
            <div className="game-content game-area">
                <div className="container">
                    {/* Key display */}
                    {keyPressed && (
                        <div className="key-display">
                            {keyPressed}
                        </div>
                    )}
                </div>
            </div>

            {/* Frame Menu */}
            <FrameMenu
                onBackToMenu={onBackToMenu}
                currentBackground={currentBackground}
                onBackgroundChange={setBackgroundTheme}
                settings={settings}
                onSettingToggle={toggleSetting}
                showLanguages={category === 'languages'}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                languages={languages}
            />
        </>
    )
}