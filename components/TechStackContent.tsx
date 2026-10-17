'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { Pencil, X, Save, Loader2, CheckCircle2 } from 'lucide-react';

interface TechStackContentProps {
  initialData: any;
}

const defaultSections = [
  {
    title: 'AI & ML',
    skills: ['PyTorch', 'TensorFlow', 'LangChain', 'LangGraph', 'scikit-learn', 'XGBoost', 'OpenCV', 'HuggingFace'],
  },
  {
    title: 'DATA',
    skills: ['PostgreSQL', 'MongoDB', 'Neo4j graph', 'Qdrant', 'ChromaDB', 'FAISS', 'Pandas / NumPy'],
  },
  {
    title: 'BACKEND',
    skills: ['Python', 'FastAPI', 'Flask / Django', 'REST / ORM', 'Microservices', 'JavaScript / TS', 'React / Next.js'],
  },
  {
    title: 'INFRA',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Databricks', 'Supabase', 'Git / GitHub', 'Postman / FastMCP'],
  },
];

export default function TechStackContent({ initialData }: TechStackContentProps) {
  const { isAdmin } = useAdmin();
  const [data, setData] = useState<any>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [sections, setSections] = useState<any[]>(
    initialData?.full_stack_sections || defaultSections
  );
  const [skillsInputs, setSkillsInputs] = useState<string[]>(
    (initialData?.full_stack_sections || defaultSections).map((s: any) =>
      Array.isArray(s.skills) ? s.skills.join(', ') : ''
    )
  );

  useEffect(() => {
    fetchLatestData();
  }, []);

  const fetchLatestData = async () => {
    try {
      const res = await fetch('/api/resume');
      if (res.ok) {
        const fresh = await res.json();
        if (fresh && typeof fresh === 'object') {
          setData(fresh);
          const secs = fresh.full_stack_sections || defaultSections;
          setSections(secs);
          setSkillsInputs(secs.map((s: any) => (Array.isArray(s.skills) ? s.skills.join(', ') : '')));
        }
      }
    } catch (err) {
      console.warn('Failed to fetch latest resume data for stack:', err);
    }
  };

  const handleOpenModal = () => {
    const secs = data?.full_stack_sections || defaultSections;
    setSections(JSON.parse(JSON.stringify(secs)));
    setSkillsInputs(secs.map((s: any) => (Array.isArray(s.skills) ? s.skills.join(', ') : '')));
    setSaveSuccess(false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Parse comma-separated inputs back into arrays
    const updatedSections = sections.map((sec, idx) => ({
      ...sec,
      skills: (skillsInputs[idx] || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }));

    const payload = {
      ...data,
      full_stack_sections: updatedSections,
    };

    try {
      const res = await fetch('/api/resume/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setData(payload);
        setSections(updatedSections);
        setSaveSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSaveSuccess(false);
        }, 800);
      } else {
        alert(resData.error || 'Failed to save stack changes to MongoDB.');
      }
    } catch (err: any) {
      alert('Error saving stack: ' + (err?.message || 'Network error'));
    } finally {
      setIsSaving(false);
    }
  };

  const currentSections = data?.full_stack_sections || defaultSections;

  return (
    <section id="stack" className="scroll-mt-28 py-4 relative">
      {/* Header & Precision Ruler Ticks Bar */}
      <div className="relative mb-6">
        <div className="flex justify-between items-center text-[0.72rem] font-code tracking-widest text-slate-500 dark:text-slate-400 mb-2 uppercase">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">02 / 06</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">STACK</span>
          </div>
          <div className="flex items-center gap-3">
            <span>WHAT I REACH FOR</span>
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenModal}
                className="px-3 py-1 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-full text-[0.68rem] font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
              >
                <Pencil size={11} /> Edit Stack (Admin)
              </button>
            )}
          </div>
        </div>

        {/* Precision Ruler Ticks Line (Colorful Gradient Ticks) */}
        <div className="w-full relative h-3 border-t border-indigo-200 dark:border-indigo-900/50 flex justify-between items-start pt-0.5 overflow-hidden opacity-85">
          {Array.from({ length: 65 }).map((_, i) => (
            <div
              key={i}
              className={`w-[1px] ${
                i % 5 === 0
                  ? 'h-2.5 bg-gradient-to-b from-indigo-500 to-violet-500'
                  : 'h-1.5 bg-indigo-200 dark:bg-indigo-900/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Faint Background Number '02' */}
      <div className="relative">
        <div className="absolute -top-12 -left-4 text-9xl font-black font-code text-indigo-500/[0.04] dark:text-indigo-400/[0.04] select-none pointer-events-none z-0">
          02
        </div>

        {/* 4 Category Columns with Soft Aesthetic Gradient Tints */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 relative z-10">
          {currentSections.map((sec: any, idx: number) => {
            const cardStyles = [
              'bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-900/90 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400',
              'bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 dark:from-emerald-950/30 dark:via-slate-900/90 dark:to-teal-950/20 border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400',
              'bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40 dark:from-purple-950/30 dark:via-slate-900/90 dark:to-pink-950/20 border-purple-100 dark:border-purple-900/40 text-purple-700 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-400',
              'bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 dark:from-amber-950/30 dark:via-slate-900/90 dark:to-orange-950/20 border-amber-100 dark:border-amber-900/40 text-amber-700 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-400',
            ];
            const activeStyle = cardStyles[idx % cardStyles.length];

            return (
              <div key={idx} className={`cyber-glass-card p-5 relative group ${activeStyle.split(' text-')[0]}`}>
                {isAdmin && (
                  <button
                    onClick={handleOpenModal}
                    title={`Edit ${sec.title}`}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer z-10"
                  >
                    <Pencil size={12} />
                  </button>
                )}

                <h4 className="text-xs font-bold font-code tracking-wider uppercase mb-3 border-b border-indigo-200/70 dark:border-indigo-900/40 pb-2">
                  {sec.title}
                </h4>
                <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  {(sec.skills || []).map((skill: string, sIdx: number) => (
                    <li key={sIdx} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* EDIT MODAL */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil size={16} className="text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Edit Tech Stack Columns (MongoDB)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              {sections.map((sec, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[0.7rem] font-bold uppercase text-slate-500 dark:text-slate-400 font-code">
                      Column {i + 1}
                    </label>
                  </div>
                  <input
                    type="text"
                    value={sec.title || ''}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[i] = { ...updated[i], title: e.target.value };
                      setSections(updated);
                    }}
                    placeholder="Column Title (e.g. AI & ML)"
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:border-indigo-500"
                  />
                  <div>
                    <label className="block text-[0.68rem] text-slate-500 dark:text-slate-400 mb-1">
                      Skills (Comma-separated)
                    </label>
                    <textarea
                      rows={2}
                      value={skillsInputs[i] || ''}
                      onChange={(e) => {
                        const updatedInputs = [...skillsInputs];
                        updatedInputs[i] = e.target.value;
                        setSkillsInputs(updatedInputs);
                      }}
                      placeholder="Skill 1, Skill 2, Skill 3..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-300" /> Saved!
                    </>
                  ) : (
                    <>
                      <Save size={14} /> Save to MongoDB
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
