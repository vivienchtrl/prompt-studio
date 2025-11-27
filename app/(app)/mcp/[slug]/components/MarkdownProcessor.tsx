'use client'

import React, { type ComponentPropsWithoutRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownProcessorProps {
  content: string
  className?: string
}

export function MarkdownProcessor({ 
  content, 
  className = 'prose dark:prose-invert max-w-none' 
}: MarkdownProcessorProps) {
  return (
    <div className={className}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-4xl font-bold text-primary mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-3xl font-semibold text-primary mb-3 mt-6" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-2xl font-medium text-primary/90 mb-2 mt-4" {...props} />,
          a: ({node, ...props}) => <a className="text-primary hover:underline underline-offset-4" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-foreground" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 text-foreground" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
          pre: ({children}) => <>{children}</>,
          code: ({className, children, ...props}: ComponentPropsWithoutRef<'code'>) => {
            const match = /language-(\w+)/.exec(className || '')
            const isInline = !match && !String(children).includes('\n')
            return !isInline ? (
              <pre className="bg-muted p-4 rounded-md mb-4 border border-border overflow-x-auto">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>
                {children}
              </code>
            )
          },
          table: ({node, ...props}) => (
            <div className="overflow-x-auto mb-6 rounded-md border border-border">
              <table className="min-w-full divide-y divide-border" {...props} />
            </div>
          ),
          thead: ({node, ...props}) => <thead className="bg-muted" {...props} />,
          tbody: ({node, ...props}) => <tbody className="divide-y divide-border bg-card" {...props} />,
          tr: ({node, ...props}) => <tr className="transition-colors hover:bg-muted/50" {...props} />,
          th: ({node, ...props}) => (
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" {...props} />
          ),
          td: ({node, ...props}) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground" {...props} />
          ),
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground" {...props} />
          ),
          img: ({node, ...props}) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="max-w-full h-auto rounded-lg my-4 border border-border" {...props} alt={props.alt || ''} />
          ),
          hr: ({node, ...props}) => <hr className="my-8 border-border" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
