"use client"

import { cn } from "@/lib/utils"

const items = [
  { label: "Poli", icon: "🏥" },
  { label: "Pasien", icon: "👤", active: true },
  { label: "Ubah Status", icon: "🔧" },
]

export default function Sidebar() {
  return (
    <aside className="h-full w-56 rounded-2xl bg-card p-4">
      <h3 className="px-2 pb-3 text-sm font-semibold">Dashboard</h3>
      <nav className="grid gap-1">
        {items.map((i) => (
          <button
            key={i.label}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted",
              i.active && "bg-muted",
            )}
          >
            <span aria-hidden>{i.icon}</span>
            {i.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
