import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ctfCategories } from '@/lib/categories';

const CTF: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  
  const activeCategory = ctfCategories.find(c => c.id === category);

  if (!activeCategory) {
    return <Navigate to="/ctf/misc" replace />;
  }

  const Icon = activeCategory.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Icon className="h-8 w-8 text-blue-600" />
          {activeCategory.name}
        </h2>
        <p className="text-muted-foreground text-slate-500">
          Select a sub-category to start your training.
        </p>
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeCategory.subCategories.map((sub, index) => (
          <div
            key={index}
            className="group relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{sub}</h3>
                <p className="text-sm text-slate-500">Explore {sub} challenges</p>
              </div>
            </div>
            <div className="mt-4">
               <button className="w-full rounded-md bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100">
                 Start Challenges
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CTF;
