'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TableOfContentsProps {
  headings: { id: string; text: string; level: number }[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  // Filter to only include h2 headings
  const h2Headings = headings.filter((heading) => heading.level === 2)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0px 0px -80% 0px' }
    )

    h2Headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      h2Headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [h2Headings])

  if (h2Headings.length === 0) return null

  return (
    <div className="hidden xl:block">
      <div className="sticky top-24">
        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
          On This Page
        </h4>
        <nav className="flex flex-col space-y-2">
          {h2Headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={cn(
                'text-sm transition-colors hover:text-foreground block py-1',
                activeId === heading.id
                  ? 'text-foreground font-medium border-l-2 border-primary -ml-[2px] pl-[calc(1rem-2px)]' // Adjust padding for border
                  : 'text-muted-foreground'
              )}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth',
                })
                setActiveId(heading.id)
              }}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
