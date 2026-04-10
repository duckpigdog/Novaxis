import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ctfCategories } from '@/lib/categories';
import { Wrench, AlertCircle, Play } from 'lucide-react';
import { WaveformModal } from '@/components/tools/WaveformModal';

const CTF: React.FC = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory: string }>();
  const [activeTool, setActiveTool] = useState<any>(null);
  
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

  // 根据当前选择的子类生成工具列表
  const tools = activeSubCategory.id === 'audio-stego'
    ? [
        { id: 1, name: '波形图', desc: '用于编辑音频波形，隐藏异常信号', type: '出题' },
        { id: 2, name: `高级 ${activeSubCategory.name} 分析器`, desc: `提供深度的 ${activeSubCategory.name} 分析功能。`, type: '解题' },
        { id: 3, name: `${activeSubCategory.name} 数据处理`, desc: `用于处理 ${activeSubCategory.name} 相关的常规任务。`, type: '解题' },
      ]
    : [
        { id: 1, name: `基础 ${activeSubCategory.name} 工具`, desc: `用于处理 ${activeSubCategory.name} 相关的常规任务。`, type: '解题' },
        { id: 2, name: `高级 ${activeSubCategory.name} 分析器`, desc: `提供深度的 ${activeSubCategory.name} 分析功能。`, type: '解题' },
        { id: 3, name: `${activeSubCategory.name} 生成器`, desc: `用于构造和生成特定的测试数据。`, type: '出题' },
      ];

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
              相关工具集成 - {activeSubCategory.name}
            </p>
          </div>
        </div>
      </div>

      {/* Content Placeholder for Tools */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Example Tool Cards */}
        {tools.map((tool) => (
          <div key={tool.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-200">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  tool.type === '出题' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                }`}>
                  {tool.type}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                {tool.name}
              </h3>
              <p className="mb-4 text-sm text-slate-500 line-clamp-2">
                {tool.desc}
              </p>
              
              <div className="flex items-center justify-end pt-2">
                <button 
                  onClick={() => {
                    if (tool.id === 1 && activeSubCategory.id === 'audio-stego') {
                      setActiveTool(tool);
                    } else {
                      alert('该工具正在开发中...');
                    }
                  }}
                  className="flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600"
                >
                  <Play className="h-3.5 w-3.5" />
                  打开工具
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State / Coming Soon */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Wrench className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-900">更多工具开发中</h3>
          <p className="mt-1 text-sm text-slate-500">
            我们正在不断向该分类添加新的工具支持。
          </p>
        </div>
      </div>

      {/* Render Active Tool Modals */}
      <WaveformModal 
        isOpen={activeTool?.id === 1 && activeSubCategory?.id === 'audio-stego'} 
        onClose={() => setActiveTool(null)} 
      />
    </div>
  );
};

export default CTF;
