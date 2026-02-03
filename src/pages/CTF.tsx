import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ctfCategories } from '@/lib/categories';
import { Sword, Trophy, Clock, AlertCircle } from 'lucide-react';

const CTF: React.FC = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory: string }>();
  
  const activeCategory = ctfCategories.find(c => c.id === category);

  if (!activeCategory) {
    return <Navigate to="/ctf/misc/image-stego" replace />;
  }

  // If subcategory is missing, redirect to the first one
  if (!subcategory && activeCategory.subCategories.length > 0) {
    return <Navigate to={`/ctf/${category}/${activeCategory.subCategories[0].id}`} replace />;
  }

  const activeSubCategory = activeCategory.subCategories.find(s => s.id === subcategory);

  if (!activeSubCategory) {
     // Fallback if invalid subcategory
     return <Navigate to={`/ctf/${category}/${activeCategory.subCategories[0].id}`} replace />;
  }

  const Icon = activeCategory.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {activeCategory.name} / {activeSubCategory.name}
            </h2>
            <p className="text-sm text-slate-500">
              Training challenges for {activeSubCategory.name}
            </p>
          </div>
        </div>
      </div>

      {/* Content Placeholder for Challenges */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Example Challenge Cards */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-200">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {activeSubCategory.name}
                </span>
                <span className="text-xs font-medium text-slate-500">500 pts</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                Challenge {i}: Basic {activeSubCategory.name}
              </h3>
              <p className="mb-4 text-sm text-slate-500 line-clamp-2">
                This is a sample challenge description for {activeSubCategory.name}. Find the flag hidden within the provided resources.
              </p>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5" />
                    <span>12 Solves</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Easy</span>
                  </div>
                </div>
                <button className="flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600">
                  <Sword className="h-3.5 w-3.5" />
                  Solve
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State / Coming Soon */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <AlertCircle className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-900">More coming soon</h3>
          <p className="mt-1 text-sm text-slate-500">
            We are constantly adding new challenges to this category.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CTF;
