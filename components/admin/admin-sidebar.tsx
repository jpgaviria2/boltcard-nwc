'use client'

import { CreditCard, Palette, Zap, Settings, Home, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: Home },
  { title: 'Cards', url: '/admin/cards', icon: CreditCard },
  { title: 'Designs', url: '/admin/designs', icon: Palette },
  { title: 'Lightning Addresses', url: '/admin/addresses', icon: Zap }
  // { title: 'Settings', url: '/admin/settings', icon: Settings }
]

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isMobile])

  // Always show sidebar on desktop
  const sidebarClass = isMobile
    ? `fixed inset-0 left-0 z-50 w-4/5 max-w-xs lg:w-64 border-r bg-card h-full p-4 transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
    : 'hidden lg:block sticky top-16 z-40 w-64 border-r bg-card h-[calc(100vh-4rem)] p-4'

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* Sidebar */}
      <nav className={sidebarClass}>
        {/* Close button (mobile only) */}
        {isMobile && (
          <div className="flex justify-end mb-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="space-y-1">
          {menuItems.map(item => (
            <Link
              key={item.title}
              href={item.url}
              onClick={() => isMobile && onClose()}
              className={`flex items-center gap-3 px-3 py-3 rounded-md text-lg font-semibold transition-colors hover:bg-accent hover:text-accent-foreground ${
                pathname === item.url
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
