// Audio utilities for iOS compatibility
let globalAudioContext: AudioContext | null = null
let isAudioInitialized = false

export const initGlobalAudio = () => {
  if (isAudioInitialized || typeof window === 'undefined') return globalAudioContext

  try {
    globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    isAudioInitialized = true
    
    // For iOS, we need to resume the context on user interaction
    if (globalAudioContext.state === 'suspended') {
      globalAudioContext.resume()
    }
    
    console.log('Global audio context initialized')
  } catch (error) {
    console.log('Audio not supported:', error)
  }

  return globalAudioContext
}

export const getGlobalAudioContext = () => {
  return globalAudioContext
}

export const ensureAudioContextRunning = () => {
  if (globalAudioContext && globalAudioContext.state === 'suspended') {
    return globalAudioContext.resume()
  }
  return Promise.resolve()
}

// Initialize audio on first user interaction
export const setupAudioOnUserInteraction = () => {
  if (typeof window === 'undefined') return

  const initAudioOnInteraction = () => {
    initGlobalAudio()
    // Remove listeners after first interaction
    document.removeEventListener('touchstart', initAudioOnInteraction)
    document.removeEventListener('mousedown', initAudioOnInteraction)
    document.removeEventListener('keydown', initAudioOnInteraction)
  }

  document.addEventListener('touchstart', initAudioOnInteraction, { once: true })
  document.addEventListener('mousedown', initAudioOnInteraction, { once: true })
  document.addEventListener('keydown', initAudioOnInteraction, { once: true })
}
