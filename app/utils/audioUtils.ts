// Audio utilities for iOS compatibility
let globalAudioContext: AudioContext | null = null
let isAudioInitialized = false
let audioUnlocked = false

// Detect iOS
const isIOS = () => {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export const initGlobalAudio = () => {
  if (isAudioInitialized || typeof window === 'undefined') return globalAudioContext

  try {
    globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    isAudioInitialized = true
    
    console.log('Global audio context initialized, state:', globalAudioContext.state)
  } catch (error) {
    console.log('Audio not supported:', error)
  }

  return globalAudioContext
}

export const getGlobalAudioContext = () => {
  return globalAudioContext
}

export const unlockAudio = async () => {
  if (!globalAudioContext) {
    initGlobalAudio()
  }
  
  if (!globalAudioContext) return false

  try {
    // iOS requires user interaction to unlock audio
    if (globalAudioContext.state === 'suspended') {
      await globalAudioContext.resume()
      console.log('Audio context resumed, state:', globalAudioContext.state)
    }
    
    // Create a silent buffer to unlock audio on iOS
    const buffer = globalAudioContext.createBuffer(1, 1, 22050)
    const source = globalAudioContext.createBufferSource()
    source.buffer = buffer
    source.connect(globalAudioContext.destination)
    source.start(0)
    source.stop(0)
    
    // Also try playing a very short oscillator to ensure audio is unlocked
    const oscillator = globalAudioContext.createOscillator()
    const gainNode = globalAudioContext.createGain()
    gainNode.gain.setValueAtTime(0, globalAudioContext.currentTime) // Silent
    oscillator.connect(gainNode)
    gainNode.connect(globalAudioContext.destination)
    oscillator.start(globalAudioContext.currentTime)
    oscillator.stop(globalAudioContext.currentTime + 0.001) // Very short
    
    // For iOS, try multiple approaches
    if (isIOS()) {
      console.log('iOS detected, using additional audio unlock methods...')
      
      // Try playing a very quiet sound
      const iosOscillator = globalAudioContext.createOscillator()
      const iosGain = globalAudioContext.createGain()
      iosGain.gain.setValueAtTime(0.001, globalAudioContext.currentTime) // Very quiet
      iosOscillator.frequency.setValueAtTime(440, globalAudioContext.currentTime)
      iosOscillator.connect(iosGain)
      iosGain.connect(globalAudioContext.destination)
      iosOscillator.start(globalAudioContext.currentTime)
      iosOscillator.stop(globalAudioContext.currentTime + 0.1)
    }
    
    audioUnlocked = true
    console.log('Audio unlocked successfully')
    return true
  } catch (error) {
    console.log('Error unlocking audio:', error)
    return false
  }
}

export const ensureAudioContextRunning = async () => {
  if (!globalAudioContext) {
    await unlockAudio()
    return
  }

  if (globalAudioContext.state === 'suspended') {
    try {
      await globalAudioContext.resume()
      console.log('Audio context resumed, state:', globalAudioContext.state)
    } catch (error) {
      console.log('Error resuming audio context:', error)
    }
  }
}

// Initialize audio on first user interaction
export const setupAudioOnUserInteraction = () => {
  if (typeof window === 'undefined') return

  const unlockAudioOnInteraction = async () => {
    console.log('User interaction detected, unlocking audio...')
    await unlockAudio()
    
    // Remove listeners after first interaction
    document.removeEventListener('touchstart', unlockAudioOnInteraction)
    document.removeEventListener('mousedown', unlockAudioOnInteraction)
    document.removeEventListener('keydown', unlockAudioOnInteraction)
    document.removeEventListener('click', unlockAudioOnInteraction)
    document.removeEventListener('touchend', unlockAudioOnInteraction)
    document.removeEventListener('pointerdown', unlockAudioOnInteraction)
  }

  // Add multiple event listeners for better iOS compatibility
  document.addEventListener('touchstart', unlockAudioOnInteraction, { once: true, passive: false })
  document.addEventListener('mousedown', unlockAudioOnInteraction, { once: true, passive: false })
  document.addEventListener('keydown', unlockAudioOnInteraction, { once: true, passive: false })
  document.addEventListener('click', unlockAudioOnInteraction, { once: true, passive: false })
  document.addEventListener('touchend', unlockAudioOnInteraction, { once: true, passive: false })
  document.addEventListener('pointerdown', unlockAudioOnInteraction, { once: true, passive: false })
  
  // For iOS, also try on window focus
  if (isIOS()) {
    window.addEventListener('focus', unlockAudioOnInteraction, { once: true })
    window.addEventListener('blur', unlockAudioOnInteraction, { once: true })
  }
  
  // Also try to unlock on page load for some browsers
  if (document.readyState === 'complete') {
    unlockAudioOnInteraction()
  } else {
    window.addEventListener('load', unlockAudioOnInteraction, { once: true })
  }
}
