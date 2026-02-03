import React from 'react';
import { Shield } from 'lucide-react';

const AWD: React.FC = () => {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center space-y-4 text-center">
      <div className="rounded-full bg-slate-100 p-6">
        <Shield className="h-12 w-12 text-slate-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">AWD Mode</h2>
      <p className="max-w-md text-slate-500">
        Attack with Defence mode is currently under development. Here you will be able to monitor your services, patch vulnerabilities, and attack other teams.
      </p>
      <button className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
        Initialize Environment
      </button>
    </div>
  );
};

export default AWD;
