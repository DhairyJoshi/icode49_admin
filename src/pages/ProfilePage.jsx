import React from 'react';
import { useAuth } from '../AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-8 text-center text-gray-500">No user information available.</div>;
  }

  return (
    <div className="mx-auto mt-10 bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-4 text-pink-600">Profile</h2>
      <div className="mb-4">
        <div className="text-lg font-semibold">{user.firstname} {user.lastname}</div>
        <div className="text-gray-600">{user.email}</div>
        <div className="text-sm text-gray-400">{user.position}</div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">User Rights</h3>
        {user.user_rights && user.user_rights.length > 0 ? (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-1 px-2 border">Module</th>
                <th className="py-1 px-2 border">View</th>
                <th className="py-1 px-2 border">Edit</th>
                <th className="py-1 px-2 border">Create</th>
                <th className="py-1 px-2 border">Delete</th>
              </tr>
            </thead>
            <tbody>
              {user.user_rights.map((right) => (
                <tr key={right.id}>
                  <td className="py-1 px-2 border">{right.module}</td>
                  <td className="py-1 px-2 border text-center">{right.view === 'true' ? '✔️' : '❌'}</td>
                  <td className="py-1 px-2 border text-center">{right.edit === 'true' ? '✔️' : '❌'}</td>
                  <td className="py-1 px-2 border text-center">{right.create === 'true' ? '✔️' : '❌'}</td>
                  <td className="py-1 px-2 border text-center">{right.delete === 'true' ? '✔️' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500">No rights assigned.</div>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-6">Account created: {user.created_at ? new Date(user.created_at).toLocaleString() : '-'}</div>
    </div>
  );
} 