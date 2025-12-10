// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Place } from '../types';
import AdminLayout from '../components/AdminLayout';

export default function PlacesPage() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3002/places')
            .then(res => res.json())
            .then(data => {
                setPlaces(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <AdminLayout>
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">All Places</h1>
                    <p className="text-slate-500 mt-1">Manage and view all community contributions.</p>
                </div>
                <div className="text-sm text-slate-400">
                    Total: <span className="font-semibold text-slate-900">{places.length}</span>
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading places...</div>
                ) : (
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Place Details</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Added On</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {places.map((place) => (
                                <tr key={place.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 bg-slate-100 rounded-lg flex items-center justify-center text-lg">
                                                {place.category === 'Park' ? '🌳' : place.category === 'Cafe' ? '☕' : '📍'}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900">{place.name}</div>
                                                <div className="text-sm text-slate-500">{place.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            // @ts-ignore
                                            place.status === 'active' ? 'bg-green-100 text-green-800' :
                                                // @ts-ignore
                                                place.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {/* @ts-ignore */}
                                            {place.status || 'unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        {place.user?.displayName || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                        {new Date().toLocaleDateString()} {/* Placeholder for created_at */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
}
