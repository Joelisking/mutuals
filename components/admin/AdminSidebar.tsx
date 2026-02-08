'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Inbox,
  Settings,
  Image as ImageIcon,
  ChevronDown,
  Star,
} from 'lucide-react';
import { useState } from 'react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Articles',
    href: '/admin/articles',
    icon: FileText,
  },
  {
    title: 'Select+',
    href: '/admin/select',
    icon: Star,
  },
  {
    title: 'Events',
    href: '/admin/events',
    icon: Calendar,
  },
  {
    title: 'Media Library',
    href: '/admin/media',
    icon: ImageIcon,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

const submissionItems = [
  {
    title: 'Artist Submissions',
    href: '/admin/submissions/artist',
  },
  {
    title: 'Contact Submissions',
    href: '/admin/submissions/contact',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const isSubmissionsActive = pathname.startsWith(
    '/admin/submissions'
  );
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(
    isSubmissionsActive
  );

  return (
    <div className="hidden border-r border-white/10 bg-zinc-950/95 lg:block text-white backdrop-blur-xl">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b border-white/10 px-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
              Mutuals+
            </span>
            <span className="text-xs font-normal text-muted-foreground border border-white/10 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium space-y-1">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
                  pathname === item.href ||
                    pathname.startsWith(item.href + '/')
                    ? 'bg-white/10 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                )}>
                <item.icon
                  className={cn(
                    'h-4 w-4',
                    pathname === item.href
                      ? 'text-white'
                      : 'text-zinc-500 group-hover:text-white'
                  )}
                />
                {item.title}
              </Link>
            ))}

            {/* Submissions Dropdown */}
            <div>
              <button
                onClick={() =>
                  setIsSubmissionsOpen(!isSubmissionsOpen)
                }
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
                  isSubmissionsActive
                    ? 'bg-white/10 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                )}>
                <Inbox
                  className={cn(
                    'h-4 w-4',
                    isSubmissionsActive
                      ? 'text-white'
                      : 'text-zinc-500'
                  )}
                />
                <span className="flex-1 text-left">Submissions</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    isSubmissionsOpen ? 'rotate-180' : ''
                  )}
                />
              </button>

              {isSubmissionsOpen && (
                <div className="mt-1 space-y-1 pl-7">
                  {submissionItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 text-sm',
                        pathname.startsWith(item.href)
                          ? 'bg-white/5 text-white font-medium'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      )}>
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-lg bg-linear-to-br from-indigo-500/10 to-purple-500/10 p-4 border border-white/5">
            <p className="text-xs text-zinc-400">Logged in as</p>
            <p className="text-sm font-medium text-white truncate">
              Admin User
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
