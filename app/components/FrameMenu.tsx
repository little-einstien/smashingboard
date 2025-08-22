'use client'

import React, { useState } from 'react'

type BackgroundTheme = 'default' | 'stars' | 'ocean' | 'forest' | 'sunset' | 'rainbow'
type Language = 'hindi' | 'punjabi' | 'tamil' | 'kannada' | 'marathi'

interface FrameMenuProps {
    onBackToMenu: () => void
    currentBackground: string
    onBackgroundChange: (theme: BackgroundTheme) => void
    settings: {
        showBackgroundObjects: boolean
        randomPositions: boolean
        soundEnabled: boolean
    }
    onSettingToggle: (key: keyof { showBackgroundObjects: boolean; randomPositions: boolean; soundEnabled: boolean }) => void
    showLanguages?: boolean
    selectedLanguage?: Language
    onLanguageChange?: (language: Language) => void
    languages?: Array<{ id: Language; name: string }>
}

export default function FrameMenu({
    onBackToMenu,
    currentBackground,
    onBackgroundChange,
    settings,
    onSettingToggle,
    showLanguages = false,
    selectedLanguage,
    onLanguageChange,
    languages = []
}: FrameMenuProps): React.JSX.Element {
    const [isOpen, setIsOpen] = useState(false)

    // Listen for frame menu toggle event
    React.useEffect(() => {
        const handleToggle = () => {
            setIsOpen(prev => !prev)
        }

        window.addEventListener('frameMenuToggle', handleToggle)
        return () => window.removeEventListener('frameMenuToggle', handleToggle)
    }, [])

    const backgroundThemes = [
        { id: 'default' as BackgroundTheme, name: 'Default' },
        { id: 'stars' as BackgroundTheme, name: 'Stars' },
        { id: 'ocean' as BackgroundTheme, name: 'Ocean' },
        { id: 'forest' as BackgroundTheme, name: 'Forest' },
        { id: 'sunset' as BackgroundTheme, name: 'Sunset' },
        { id: 'rainbow' as BackgroundTheme, name: 'Rainbow' }
    ]

    const handleBackgroundChange = (themeId: BackgroundTheme) => {
        onBackgroundChange(themeId)
    }

    return (
        <div
            className={`frame-menu-container ${isOpen ? 'active' : ''}`}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div
                className="frame-menu-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Button is invisible - the corner itself is the clickable area */}
            </div>

            <div className="frame-menu-options">
                {/* Back Button */}
                <div className="menu-section">
                    <button
                        className="menu-option-button back-btn"
                        onClick={onBackToMenu}
                    >
                        ← Back to Menu
                    </button>
                </div>

                {/* Language Selection (if applicable) */}
                {showLanguages && languages.length > 0 && (
                    <div className="menu-section">
                        <div className="menu-section-title">Language</div>
                        <div className="menu-buttons">
                            {languages.map((lang) => (
                                <button
                                    key={lang.id}
                                    className={`menu-option-button ${selectedLanguage === lang.id ? 'active' : ''}`}
                                    onClick={() => onLanguageChange?.(lang.id)}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Background Themes */}
                <div className="menu-section">
                    <div className="menu-section-title">Background</div>
                    <div className="background-options">
                        {backgroundThemes.map((theme) => (
                            <div
                                key={theme.id}
                                className={`bg-option bg-option-${theme.id} ${currentBackground === theme.id ? 'active' : ''}`}
                                onClick={() => handleBackgroundChange(theme.id)}
                                title={theme.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Settings */}
                <div className="menu-section">
                    <div className="menu-section-title">Settings</div>
                    <div className="settings-toggles">
                        <div className="setting-item">
                            <span>Background Objects</span>
                            <button
                                className={`setting-toggle ${settings.showBackgroundObjects ? 'active' : ''}`}
                                onClick={() => onSettingToggle('showBackgroundObjects' as keyof typeof settings)}
                            />
                        </div>
                        <div className="setting-item">
                            <span>Random Positions</span>
                            <button
                                className={`setting-toggle ${settings.randomPositions ? 'active' : ''}`}
                                onClick={() => onSettingToggle('randomPositions' as keyof typeof settings)}
                            />
                        </div>
                        <div className="setting-item">
                            <span>{settings.soundEnabled ? 'Sound On' : 'Sound Off'}</span>
                            <button
                                className={`setting-toggle ${settings.soundEnabled ? 'active' : ''}`}
                                onClick={() => onSettingToggle('soundEnabled' as keyof typeof settings)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}