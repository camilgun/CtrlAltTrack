import { useEffect, useState } from 'react';
import { usePresenceStore } from '../stores/presenceStore';

function Dashboard() {
  const { todayPresences, loading, error, registerPresence, fetchTodayPresences } = usePresenceStore();
  const [presenceType, setPresenceType] = useState<'check_in' | 'check_out'>('check_in');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchTodayPresences();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerPresence({
        type: presenceType,
        notes,
        method: 'manual'
      });
      setNotes('');
    } catch (error) {
      console.error('Failed to register presence:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Register Presence</h3>
            <p className="mt-1 text-sm text-gray-500">
              Record your check-in or check-out time.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={presenceType}
                    onChange={(e) => setPresenceType(e.target.value as 'check_in' | 'check_out')}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="check_in">Check In</option>
                    <option value="check_out">Check Out</option>
                  </select>
                </div>
                <div className="col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Today's Presences
          </h3>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-4 mx-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {todayPresences.map((presence) => (
              <li key={presence.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {presence.User?.firstName} {presence.User?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(presence.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${presence.type === 'check_in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {presence.type === 'check_in' ? 'Check In' : 'Check Out'}
                    </span>
                  </div>
                </div>
                {presence.notes && (
                  <p className="mt-2 text-sm text-gray-500">{presence.notes}</p>
                )}
              </li>
            ))}
            {!loading && todayPresences.length === 0 && (
              <li className="px-4 py-4 text-sm text-gray-500 text-center">
                No presences recorded today
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
