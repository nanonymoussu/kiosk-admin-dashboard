'use client'

import { useEffect, useState } from 'react'

export function useClientOnly() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}
