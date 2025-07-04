import React from 'react';
import { useAuth } from '../AuthContext';

function getInitials(name, lastname) {
  if (!name && !lastname) return '?';
  return `${name?.[0] || ''}${lastname?.[0] || ''}`.toUpperCase();
}

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-8 text-center text-gray-500">No user information available.</div>;
  }

  return (
    <div className="mx-auto max-w-full bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-pink-100">
      {/* Avatar and Name */}
      <div className="flex flex-col items-center w-full mb-6">
        <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center text-3xl font-bold text-pink-600 shadow mb-3">
          {/* Avatar fallback to initials */}
          {user.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
          ) : (
            getInitials(user.firstname, user.lastname)
          )}
        </div>
        <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {user.firstname} {user.lastname}
        </div>
        <div className="text-gray-600 text-lg flex items-center gap-1">
          <svg className="w-5 h-5 text-pink-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 01-8 0 4 4 0 018 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7m0 0H9m3 0h3" /></svg>
          {user.email}
        </div>
        <div className="text-sm text-pink-400 font-medium mt-1">{user.position}</div>
      </div>
      <hr className="w-full border-t border-gray-200 my-6" />
      {/* User Rights */}
      <div className="w-full">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          User Rights
        </h3>
        {user.user_rights && user.user_rights.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full text-sm bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-pink-50 text-pink-700">
                  <th className="py-2 px-3 border">Module</th>
                  <th className="py-2 px-3 border">View</th>
                  <th className="py-2 px-3 border">Edit</th>
                  <th className="py-2 px-3 border">Create</th>
                  <th className="py-2 px-3 border">Delete</th>
                </tr>
              </thead>
              <tbody>
                {user.user_rights.map((right) => (
                  <tr key={right.id} className="even:bg-pink-50/40">
                    <td className="py-2 px-3 border font-medium text-gray-700">{right.module}</td>
                    {["view", "edit", "create", "delete"].map((perm) => (
                      <td key={perm} className="py-2 px-3 border text-center">
                        {right[perm] === 'true' ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold">✔️</span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-600 text-xs font-semibold">❌</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500">No rights assigned.</div>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-8 w-full text-right">Account created: {user.created_at ? new Date(user.created_at).toLocaleString() : '-'}</div>
    </div>
  );
} 