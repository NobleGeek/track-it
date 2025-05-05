'use client'

import { signOut, useSession } from 'next-auth/react'
import { Button } from '../ui/button'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import Image from 'next/image'

export function Navbar() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        
        <div className="flex items-center justify-center flex-1">
          <Image
            src={theme === 'dark' ? '/logo-light.svg' : '/logo-dark.svg'}
            alt="TrackIt Logo"
            width={120}
            height={30}
            priority
          />
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hover:bg-accent"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}