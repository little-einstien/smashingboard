'use client'

import React, { useEffect, useState } from 'react'
import { unlockAudio } from '../utils/audioUtils'

interface AudioUnlockerProps {
  onAudioReady?: () => void
}

export default function AudioUnlocker({ onAudioReady }: AudioUnlockerProps): React.JSX.Element | null {
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [audioUnlocked, setAudioUnlocked] = useState(false)

  const handleUnlockAudio = async () => {
    if (isUnlocking || audioUnlocked) return
    
    setIsUnlocking(true)
    try {
      const success = await unlockAudio()
      if (success) {
        setAudioUnlocked(true)
        onAudioReady?.()
        console.log('Audio unlocked successfully!')
      }
    } catch (error) {
      console.error('Failed to unlock audio:', error)
    } finally {
      setIsUnlocking(false)
    }
  }

  useEffect(() => {
    // Try to unlock audio on component mount
    handleUnlockAudio()
  }, [])

  // This component doesn't render anything visible
  // It just handles audio unlocking in the background
  return null
}
