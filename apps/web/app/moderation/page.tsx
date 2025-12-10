// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { Place } from '../types';
import AdminLayout from '../components/AdminLayout';

export default function ModerationPage() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingPlaces();
    }, []);

    const fetchPendingPlaces = async () => {
        try {
            const res = await fetch('http://localhost:3002/places?status=pending');
            const data = await res.json();
            setPlaces(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, status: 'active' | 'rejected') => {
        try {
            await fetch(`http://localhost:3002/places/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            // Remove from list locally
            setPlaces(places.filter(p => p.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Moderation Queue</h1>
                    <p className="text-slate-500 mt-1">Review and approve new places submitted by users.</p>
                </div>
                <div className="text-sm font-medium bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-100">
                    {places.length} pending items
                </div>
            </div>

            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading pending places...</div>
                ) : places.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
                        <span className="text-4xl mb-4 block">🎉</span>
                        <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
                        <p className="text-slate-500 mt-2">No pending places to review.</p>
                    </div>
                ) : (
                    places.map((place) => (
                        <div key={place.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                            <div className="md:w-1/3 bg-slate-100 flex items-center justify-center min-h-[200px]">
                                <span className="text-4xl text-slate-300">
                                    {place.category === 'Park' ? '🌳' : place.category === 'Cafe' ? '☕' : '📍'}
                                </span>
                            </div>
                            <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-bold text-slate-900">{place.name}</h2>
                                        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-600 uppercase tracking-wider">{place.category}</span>
                                    </div>
                                    <p className="text-slate-600 mb-4">{place.description}</p>

                                    <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
                                        <div>
                                            <dt className="text-slate-400 font-medium">Submitted By</dt>
                                            <dd className="text-slate-800">{place.user?.displayName || 'Unknown User'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-slate-400 font-medium">Coordinates</dt>
                                            <dd className="text-slate-800 font-mono text-xs mt-1">{place.lat.toFixed(5)}, {place.lng.toFixed(5)}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => updateStatus(place.id, 'active')}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center gap-2"
                                    >
                                        <span>✅</span> Approve
                                    </button>
                                    <button
                                        onClick={() => updateStatus(place.id, 'rejected')}
                                        className="flex-1 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-medium py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center gap-2"
                                    >
                                        <span>🗑️</span> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AdminLayout>
    );
}
