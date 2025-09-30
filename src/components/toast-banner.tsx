"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  open: boolean
  title?: string
  description?: string
  primaryAction?: { label: string; onClick: () => void }
  className?: string
}

export default function ToastBanner({ open, title, description, primaryAction, className }: Props) {
  if (!open) return null
  return (
    <div aria-live="polite" className={cn("fixed inset-0 z-50 grid place-items-center bg-black/10 p-4", className)}>
      <div className="w-full max-w-lg rounded-xl bg-muted p-6 shadow-lg">
        {title && <h3 className="mb-2 text-center text-lg font-semibold">{title}</h3>}
        {description && <p className="mb-4 text-center text-foreground/80">{description}</p>}
        {primaryAction && (
          <div className="flex justify-center">
            <Button onClick={primaryAction.onClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {primaryAction.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
