import React, { Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { JSX } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { MermaidRenderer } from '@/components/shared/MermaidRenderer'
import { Sparkles } from 'lucide-react'

type RichTextProps = {
  content: any
  className?: string
}

// Lexical format bitmasks
const IS_BOLD = 1
const IS_ITALIC = 1 << 1
const IS_STRIKETHROUGH = 1 << 2
const IS_UNDERLINE = 1 << 3
const IS_CODE = 1 << 4
const IS_SUBSCRIPT = 1 << 5
const IS_SUPERSCRIPT = 1 << 6

export const RichTextParser: React.FC<RichTextProps> = ({ content, className }) => {
  if (!content || !content.root || !content.root.children) {
    return null
  }

  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      {serialize(content.root.children)}
    </div>
  )
}

// Helper to generate IDs for headings
export const generateId = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

const serialize = (children: any[]): React.ReactNode[] => {
  if (!children || !Array.isArray(children)) {
    return []
  }

  return children.map((node, i) => {
    if (node.type === 'text') {
      let text = <>{node.text}</>

      if (node.format & IS_BOLD) {
        text = <strong key={i}>{text}</strong>
      }

      if (node.format & IS_ITALIC) {
        text = <em key={i}>{text}</em>
      }

      if (node.format & IS_STRIKETHROUGH) {
        text = (
          <span style={{ textDecoration: 'line-through' }} key={i}>
            {text}
          </span>
        )
      }

      if (node.format & IS_UNDERLINE) {
        text = (
          <span style={{ textDecoration: 'underline' }} key={i}>
            {text}
          </span>
        )
      }

      if (node.format & IS_CODE) {
        text = <code key={i}>{text}</code>
      }

      if (node.format & IS_SUBSCRIPT) {
        text = <sub key={i}>{text}</sub>
      }

      if (node.format & IS_SUPERSCRIPT) {
        text = <sup key={i}>{text}</sup>
      }

      return <Fragment key={i}>{text}</Fragment>
    }

    if (!node) {
      return null
    }

    switch (node.type) {
      case 'heading':
         // Lexical headings have a tag property like 'h1', 'h2'
         const Tag = node.tag as keyof JSX.IntrinsicElements | 'h1'
         return React.createElement(
             Tag,
             { key: i, id: generateId(getNodeText(node)) },
             serialize(node.children)
         )
      
      // Fallback for direct types if any
      case 'h1':
        return (
          <h1 key={i} id={generateId(getNodeText(node))}>
            {serialize(node.children)}
          </h1>
        )
      case 'h2':
        return (
          <h2 key={i} id={generateId(getNodeText(node))}>
            {serialize(node.children)}
          </h2>
        )
      case 'h3':
        return (
          <h3 key={i} id={generateId(getNodeText(node))}>
            {serialize(node.children)}
          </h3>
        )
      case 'h4':
        return (
          <h4 key={i} id={generateId(getNodeText(node))}>
            {serialize(node.children)}
          </h4>
        )
      case 'h5':
        return (
          <h5 key={i} id={generateId(getNodeText(node))}>
            {serialize(node.children)}
          </h5>
        )
      case 'h6':
        return (
          <h6 key={i} id={generateId(getNodeText(node))}>
            {serialize(node.children)}
          </h6>
        )
        
      case 'quote':
        return <blockquote key={i}>{serialize(node.children)}</blockquote>
        
      case 'list': 
        const ListTag = node.listType === 'number' ? 'ol' : 'ul'
        return <ListTag key={i}>{serialize(node.children)}</ListTag>
        
      case 'listitem':
        return <li key={i}>{serialize(node.children)}</li>
        
      case 'link':
        return (
          <Link
            href={node.url}
            key={i}
            target={node.newTab ? '_blank' : undefined}
            className="text-primary hover:underline"
          >
            {serialize(node.children)}
          </Link>
        )
        
      case 'upload': {
        // Handle upload node (images)
        const value = node.value
        if (!value || !value.url) return null
        
        return (
            <div key={i} className="my-8 relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                 <Image
                    src={value.url}
                    alt={value.alt || ''}
                    fill
                    className="object-cover"
                />
            </div>
        )
      }
      
      case 'block': {
        const fields = node.fields
        
        if (fields?.blockType === 'cta') {
          if (fields.type === 'banner') {
            return (
              <div key={i} className="my-8 not-prose">
                <Card className="bg-gradient-to-br from-muted/50 to-muted border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{fields.title || 'Ready to get started?'}</CardTitle>
                    </div>
                    {fields.description && <CardDescription className="text-base mt-2">{fields.description}</CardDescription>}
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      variant={fields.variant === 'outline' ? 'outline' : (fields.variant === 'secondary' ? 'secondary' : (fields.variant === 'ghost' ? 'ghost' : 'default'))}
                      asChild
                      className="w-full sm:w-auto"
                    >
                      <Link href={fields.url} target="_blank" rel="noopener noreferrer">
                        {fields.text}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )
          }

           return (
             <div key={i} className="my-8 flex justify-center">
               <Button 
                 variant={fields.variant === 'outline' ? 'outline' : (fields.variant === 'secondary' ? 'secondary' : (fields.variant === 'ghost' ? 'ghost' : 'default'))}
                 asChild
               >
                 <Link href={fields.url} target="_blank" rel="noopener noreferrer">
                   {fields.text}
                 </Link>
               </Button>
             </div>
           )
        }
        
        if (fields?.blockType === 'mermaid') {
            return <MermaidRenderer key={i} code={fields.code} />
        }

        return <div key={i}>{serialize(node.children)}</div>
      }

      case 'table':
        return (
          <div key={i} className="my-6 w-full overflow-y-auto">
            <table className="w-full border-collapse border border-border">
              <tbody>
                {serialize(node.children)}
              </tbody>
            </table>
          </div>
        )

      case 'tablerow':
        return (
          <tr key={i} className="m-0 border-t p-0 even:bg-muted/50">
            {serialize(node.children)}
          </tr>
        )

      case 'tablecell':
        // node.header is sometimes used in Lexical for th vs td
        const CellTag = node.header ? 'th' : 'td'
        return (
          <CellTag 
            key={i} 
            className={`border border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right ${
              node.header ? 'font-bold bg-muted' : ''
            }`}
            colSpan={node.colSpan}
            rowSpan={node.rowSpan}
          >
            {serialize(node.children)}
          </CellTag>
        )

      case 'paragraph':
      default:
        return <p key={i}>{serialize(node.children)}</p>
    }
  })
}

// Helper to extract text from a node
const getNodeText = (node: any): string => {
  if (node.type === 'text') {
    return node.text
  }
  if (node.children) {
    return node.children.map((child: any) => getNodeText(child)).join('')
  }
  return ''
}

interface LexicalNode {
  type: string
  tag?: string
  text?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

export const extractHeadings = (content: { root?: { children?: LexicalNode[] } } | null | undefined) => {
  const headings: { id: string; text: string; level: number }[] = []

  if (!content || !content.root || !content.root.children) return headings

  const traverse = (nodes: LexicalNode[]) => {
    nodes.forEach((node) => {
      if (node.type === 'heading' && typeof node.tag === 'string') {
        const text = getNodeText(node)
        const level = parseInt(node.tag.replace('h', ''))
        headings.push({
          id: generateId(text),
          text,
          level,
        })
      }
       // Handle legacy h1-h6 types if they exist
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.type)) {
          const text = getNodeText(node)
          const level = parseInt(node.type.replace('h', ''))
          headings.push({
            id: generateId(text),
            text,
            level,
          })
      }
      
      // Don't traverse children of headings for nested headings (not standard)
      // but do traverse other nodes
      if (node.children && !['heading', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.type)) {
        traverse(node.children)
      }
    })
  }

  traverse(content.root.children)
  return headings
}
