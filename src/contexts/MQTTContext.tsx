'use client'

import { createContext, useContext, useEffect } from 'react'
import { initializeMQTT } from '@/lib/mqtt'

const MQTTContext = createContext({})

export function MQTTProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const init = async () => {
      try {
        await initializeMQTT()
      } catch (error) {
        console.error('Failed to initialize MQTT:', error)
      }
    }
    init()
  }, [])

  return <MQTTContext.Provider value={{}}>{children}</MQTTContext.Provider>
}

export const useMQTT = () => useContext(MQTTContext)
