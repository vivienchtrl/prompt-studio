'use client'

import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidRendererProps {
  code: string
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ code }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    })
    
    if (ref.current) {
      mermaid.contentLoaded()
    }
  }, [])

  useEffect(() => {
    const render = async () => {
      if (ref.current && code) {
        try {
          ref.current.innerHTML = ''
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
          const { svg } = await mermaid.render(id, code)
          if (ref.current) {
             ref.current.innerHTML = svg
          }
        } catch (error) {
          console.error('Mermaid rendering failed:', error)
          if (ref.current) {
             ref.current.innerText = 'Invalid Mermaid Code'
          }
        }
      }
    }
    render()
  }, [code])

  return <div ref={ref} className="mermaid my-4 overflow-x-auto" />
}



