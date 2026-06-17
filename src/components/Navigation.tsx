'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, PlusCircle } from 'lucide-react';

const tabs = [
  { href: '/', icon: Home, label: '今日' },
  { href: '/calendar', icon: Calendar, label: 'カレンダー' },
  { href: '/log', icon: PlusCircle, label: '記録する' },
] as const;

export default function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
      <div className="flex">
        {tabs.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center py-2 text-xs gap-1 transition-colors ${
              pathname === href ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <Icon size={22} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
