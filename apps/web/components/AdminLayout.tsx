'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/', icon: '📊' },
        { name: 'Moderation Queue', href: '/moderation', icon: '🛡️' },
        { name: 'All Places', href: '/places', icon: '📍' },
        { name: 'Users', href: '/users', icon: '👥' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-xl z-10">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold tracking-tight text-white">kamu admin</h1>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Control Panel</p>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin User</p>
                            <p className="text-xs text-slate-400 truncate">admin@kamu.app</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
