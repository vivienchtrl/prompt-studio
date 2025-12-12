'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Star, Copy, Check, Github, Clock } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { McpServerType } from '@/lib/backend/validators/mcp-server.schemas'
import { ShareButtons } from './share-buttons'

interface GithubInfo {
  owner: {
    avatar_url: string
    login?: string
  }
  repository: {
    name: string
    full_name?: string
    urls: {
      git: string
      ssh: string
      clone: string
    }
    stars_count: number
    description?: string
  }
}

interface McpServerHeaderProps {
  server: Partial<McpServerType> & {
    name: string
    description?: string | null
    githubUrl?: string | null
    readme?: string | null
    githubInfo?: GithubInfo | string | unknown
    tags?: string[] | null
    category?: string
  }
  url: string
}

export function McpServerHeader({ server, url }: McpServerHeaderProps) {
  const [copied, setCopied] = useState(false)

  // Parse githubInfo if it's a string
  let githubInfo: GithubInfo | null = null
  try {
    if (typeof server.githubInfo === 'string') {
      githubInfo = JSON.parse(server.githubInfo)
    } else if (typeof server.githubInfo === 'object' && server.githubInfo !== null) {
      githubInfo = server.githubInfo as GithubInfo
    }
  } catch (e) {
    console.error('Failed to parse githubInfo', e)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Command copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const calculateReadingTime = (text: string | undefined) => {
    if (!text) return 1
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const readingTime = calculateReadingTime(server.readme || '')

  // Fallback values if githubInfo is missing
  const starsCount = githubInfo?.repository?.stars_count ?? 0
  const ownerAvatar = githubInfo?.owner?.avatar_url
  const repoName = githubInfo?.repository?.name || server.name
  const fullRepoName = githubInfo?.repository?.full_name || repoName
  
  // Construct copy commands
  const httpsUrl = githubInfo?.repository?.urls?.clone || server.githubUrl || ''
  const sshUrl = githubInfo?.repository?.urls?.ssh || (server.githubUrl ? `git@github.com:${fullRepoName}.git` : '')
  const cliCommand = `gh repo clone ${fullRepoName}`

  return (
    <div className="relative w-full border-b bg-background overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="container relative mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb / Back Navigation */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/mcp">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to MCP Servers
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Server Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border shadow-sm">
                <AvatarImage src={ownerAvatar} alt={server.name} />
                <AvatarFallback className="text-lg font-bold">
                  {server.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  {server.name}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                  {server.category && (
                    <Badge variant="secondary" className="font-normal capitalize">
                      {server.category.replace('_', ' ')}
                    </Badge>
                  )}
                  {(githubInfo || starsCount > 0) && (
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span>{starsCount.toLocaleString()}</span>
                      <span className="text-muted-foreground/60 font-normal">stars</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {server.description && (
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {server.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {server.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border">
                <Clock className="h-4 w-4 mr-2" />
                {readingTime} min read
              </div>
              
              <ShareButtons 
                url={url} 
                title={server.name} 
                description={server.description || undefined} 
              />
              
              {server.githubUrl && (
                <Button variant="outline" size="sm" asChild className="gap-2">
                  <a href={server.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    View Repository
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Copy Commands Card */}
          <div className="space-y-6">
             <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden z-10 relative">
               <div className="bg-muted/50 border-b">
                 <Tabs defaultValue="clone" className="w-full">
                    <div className="flex items-center justify-between px-4 py-3">
                       <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                         Get Code
                       </span>
                       <TabsList className="h-7 bg-background/50">
                         <TabsTrigger value="clone" className="h-5 text-xs">HTTPS</TabsTrigger>
                         <TabsTrigger value="ssh" className="h-5 text-xs">SSH</TabsTrigger>
                         <TabsTrigger value="cli" className="h-5 text-xs">GitHub CLI</TabsTrigger>
                       </TabsList>
                    </div>
                    
                    <div className="p-4 bg-background">
                       <TabsContent value="clone" className="mt-0 space-y-2">
                          <div className="relative">
                            <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3 font-mono text-sm text-muted-foreground">
                              <span className="truncate mr-8">{httpsUrl || 'No HTTPS URL'}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 absolute right-1 top-1/2 -translate-y-1/2"
                                onClick={() => copyToClipboard(httpsUrl)}
                                disabled={!httpsUrl}
                              >
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                       </TabsContent>
                       
                       <TabsContent value="ssh" className="mt-0 space-y-2">
                          <div className="relative">
                            <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3 font-mono text-sm text-muted-foreground">
                              <span className="truncate mr-8">{sshUrl || 'No SSH URL'}</span>
                               <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 absolute right-1 top-1/2 -translate-y-1/2"
                                onClick={() => copyToClipboard(sshUrl)}
                                disabled={!sshUrl}
                              >
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                       </TabsContent>

                       <TabsContent value="cli" className="mt-0 space-y-2">
                          <div className="relative">
                            <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3 font-mono text-sm text-muted-foreground">
                              <div className="flex items-center truncate mr-8">
                                <span className="mr-2 select-none text-muted-foreground/50">$</span>
                                <span>{cliCommand}</span>
                              </div>
                               <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 absolute right-1 top-1/2 -translate-y-1/2"
                                onClick={() => copyToClipboard(cliCommand)}
                              >
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                       </TabsContent>
                    </div>
                 </Tabs>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}
