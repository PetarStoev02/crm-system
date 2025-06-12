import React from 'react';
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/communication")({
  component: Communication,
});

function Communication() {
  const messages = [
    { id: 1, type: 'Email', subject: 'Campaign Update', recipient: 'Acme Corp', date: '2024-03-15', status: 'Sent' },
    { id: 2, type: 'Call', subject: 'Follow-up Meeting', recipient: 'TechStart Inc', date: '2024-03-14', status: 'Scheduled' },
    { id: 3, type: 'Meeting', subject: 'Product Demo', recipient: 'Global Solutions', date: '2024-03-16', status: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Communication</h1>
        <div className="space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            New Email
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Schedule Call
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((message) => (
              <tr key={message.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    message.type === 'Email' ? 'bg-blue-100 text-blue-800' :
                    message.type === 'Call' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {message.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{message.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap">{message.recipient}</td>
                <td className="px-6 py-4 whitespace-nowrap">{message.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    message.status === 'Sent' ? 'bg-green-100 text-green-800' :
                    message.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {message.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
