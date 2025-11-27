import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export function PromptLabSkeleton() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <section className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-20 border-b bg-background px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex gap-2">
               <Skeleton className="h-10 w-10" />
               <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 px-6 pb-10 pt-6">
           <div className="grid items-stretch gap-4 xl:grid-cols-[2fr,1fr]">
             {/* Models Section Skeleton */}
             <div className="rounded-lg p-4 shadow-sm border">
               <Skeleton className="h-6 w-24 mb-4" />
               <Separator className="mb-4" />
               <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="space-y-3">
                     <Skeleton className="h-4 w-24" />
                     <Skeleton className="h-10 w-full" />
                   </div>
                 ))}
               </div>
             </div>

             {/* Prompt Editor Skeleton */}
             <div className="rounded-lg p-4 shadow-sm border flex flex-col h-[300px]">
               <Skeleton className="h-6 w-24 mb-4" />
               <Separator className="mb-4" />
               <Skeleton className="flex-1 w-full" />
             </div>
           </div>
        </div>
      </section>
    </div>
  )
}
