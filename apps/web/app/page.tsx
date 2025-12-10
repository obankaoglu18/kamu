import Link from 'next/link';
import { Place } from './types';
import AdminLayout from '../components/AdminLayout';

// ... (keep getPlaces, getUsers, getPendingPlaces functions SAME as before)
// I will rewrite them briefly to ensure file integrity

async function getPlaces(): Promise<Place[]> {
  try {
    const res = await fetch('http://localhost:3002/places', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  } catch (error) { return []; }
}

async function getUsers(): Promise<any[]> {
  try {
    const res = await fetch('http://localhost:3002/users', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  } catch (error) { return []; }
}

async function getPendingPlaces(): Promise<Place[]> {
  try {
    const res = await fetch('http://localhost:3002/places?status=pending', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  } catch (error) { return []; }
}

export default async function Home() {
  const places = await getPlaces();
  const users = await getUsers();
  const pendingPlaces = await getPendingPlaces();
  const pendingPlacesCount = pendingPlaces.length;

  return (
    <AdminLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome back! Here is what's happening in Kamu today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Pending Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Pending Review</h2>
            <span className="text-2xl">🛡️</span>
          </div>
          <p className="text-4xl font-extrabold text-slate-900">{pendingPlacesCount}</p>
          <div className="mt-4">
            <Link href="/moderation" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center">
              Go to Queue &rarr;
            </Link>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Users</h2>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-4xl font-extrabold text-slate-900">{users.length}</p>
          <div className="mt-4">
            <Link href="/users" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
              View Directory &rarr;
            </Link>
          </div>
        </div>

        {/* Places Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Places</h2>
            <span className="text-2xl">📍</span>
          </div>
          <p className="text-4xl font-extrabold text-slate-900">{places.length}</p>
          <div className="mt-4">
            <Link href="/places" className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center">
              Explore Map &rarr;
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Recent Activity</h3>
          <Link href="/places" className="text-xs font-medium text-slate-500 hover:text-slate-800">View All</Link>
        </div>
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created By</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Coordinates</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {places.slice(0, 5).map((place) => (
              <tr key={place.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{place.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {place.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{place.user?.displayName || 'Unknown'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono text-xs">{place.lat.toFixed(4)}, {place.lng.toFixed(4)}</td>
              </tr>
            ))}
            {places.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">No activity yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
