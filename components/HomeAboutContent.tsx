'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAdmin } from './AdminContext';
import {
  Mail,
  Phone,
  MapPin,
  Lightbulb,
  Palette,
  Briefcase,
  Code2,
  GraduationCap,
  Pencil,
  X,
  Save,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

interface HomeAboutContentProps {
  initialData: any;
}

export default function HomeAboutContent({ initialData }: HomeAboutContentProps) {
  const { isAdmin } = useAdmin();
  const [data, setData] = useState<any>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'skills' | 'education' | 'softskills'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState<any>(initialData);

  // Raw inputs for comma-separated skills
  const [languagesInput, setLanguagesInput] = useState<string>(
    Array.isArray(initialData?.technical_skills?.programming_languages)
      ? initialData.technical_skills.programming_languages.join(', ')
      : 'C, C++, HTML, CSS, JavaScript, Python'
  );
  const [frameworksInput, setFrameworksInput] = useState<string>(
    Array.isArray(initialData?.technical_skills?.frameworks)
      ? initialData.technical_skills.frameworks.join(', ')
      : 'React.js, Next.js, Node.js, FastAPI, Tailwind CSS'
  );
  const [aiLibrariesInput, setAiLibrariesInput] = useState<string>(
    Array.isArray(initialData?.technical_skills?.ai_ml_libraries)
      ? initialData.technical_skills.ai_ml_libraries.join(', ')
      : 'PyTorch, TensorFlow, LangChain, OpenCV, ChromaDB, Scikit-learn'
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
          setFormData(fresh);
          if (fresh.technical_skills?.programming_languages) {
            setLanguagesInput(fresh.technical_skills.programming_languages.join(', '));
          }
          if (fresh.technical_skills?.frameworks) {
            setFrameworksInput(fresh.technical_skills.frameworks.join(', '));
          }
          if (fresh.technical_skills?.ai_ml_libraries) {
            setAiLibrariesInput(fresh.technical_skills.ai_ml_libraries.join(', '));
          }
        }
      }
    } catch (err) {
      console.warn('Failed to fetch latest resume for about section:', err);
    }
  };

  const handleOpenModal = (tab?: 'profile' | 'experience' | 'skills' | 'education' | 'softskills') => {
    setFormData(JSON.parse(JSON.stringify(data)));
    if (data?.technical_skills?.programming_languages) {
      setLanguagesInput(data.technical_skills.programming_languages.join(', '));
    }
    if (data?.technical_skills?.frameworks) {
      setFrameworksInput(data.technical_skills.frameworks.join(', '));
    }
    if (data?.technical_skills?.ai_ml_libraries) {
      setAiLibrariesInput(data.technical_skills.ai_ml_libraries.join(', '));
    }
    if (tab) setActiveTab(tab);
    setSaveSuccess(false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const parseList = (str: string) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const payload = {
      ...formData,
      technical_skills: {
        ...(formData.technical_skills || {}),
        programming_languages: parseList(languagesInput),
        frameworks: parseList(frameworksInput),
        ai_ml_libraries: parseList(aiLibrariesInput),
      },
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
        setFormData(payload);
        setSaveSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSaveSuccess(false);
        }, 800);
      } else {
        alert(resData.error || 'Failed to save changes to MongoDB.');
      }
    } catch (err: any) {
      alert('Error saving to MongoDB: ' + (err?.message || 'Network error'));
    } finally {
      setIsSaving(false);
    }
  };

  const profileImage = data?.profile_image || '/images/hetvi.jpg';
  const name = data?.name || 'Hetvi Patel';
  const title = data?.title || 'IT Student';
  const summary = data?.summary || '';
  const email = data?.email || 'hetvipatel4728@gmail.com';
  const phone = data?.phone || '+91 7990992726';
  const location = data?.location || 'Anand, Gujarat, India';
  const workExperience = Array.isArray(data?.work_experience) ? data.work_experience : [];
  const technicalSkills = data?.technical_skills || {
    programming_languages: ['C', 'C++', 'HTML', 'CSS', 'JavaScript', 'Python'],
    frameworks: ['React.js', 'Next.js', 'Node.js', 'FastAPI'],
    ai_ml_libraries: ['PyTorch', 'LangChain', 'OpenCV'],
  };
  const degree = data?.degree || 'B.Tech in Information Technology';
  const institution = data?.institution || 'G.H. Patel College of Engineering and Technology';
  const graduationYear = data?.graduation_year || 'June 2025 - May 2029';
  const cgpa = data?.cgpa || '8.00';

  return (
    <section id="about" className="scroll-mt-28 relative">
      <div className="text-center mb-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-code block mb-1">
          04 / BIOGRAPHY
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
          About {name}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          {title} passionate about programming, web development, and AI/ML technologies.
        </p>

        {isAdmin && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => handleOpenModal('profile')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Pencil size={13} /> Edit Biography &amp; Experience (Admin)
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column: Profile Card & Soft Skills */}
        <div className="flex flex-col gap-5">
          <div className="cyber-glass-card p-5 text-center bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-900/90 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/40 relative group">
            {isAdmin && (
              <button
                onClick={() => handleOpenModal('profile')}
                title="Edit Profile"
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer z-10"
              >
                <Pencil size={12} />
              </button>
            )}

            <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-700 shadow-sm">
              <Image src={profileImage} alt={name} fill sizes="96px" className="object-cover object-top" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-0.5">{name}</h3>
            <p className="text-indigo-600 dark:text-indigo-400 text-[0.72rem] font-semibold uppercase tracking-wider mb-2.5 font-code">
              {title}
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4">
              {summary}
            </p>

            <div className="flex flex-col gap-2.5 text-left bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              <div className="flex items-center gap-2.5 text-xs">
                <Mail size={14} className="text-indigo-600 dark:text-indigo-400" />
                <a href={`mailto:${email}`} className="text-slate-600 dark:text-slate-300 hover:underline truncate">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <Phone size={14} className="text-indigo-600 dark:text-indigo-400" />
                <a href={`tel:${phone}`} className="text-slate-600 dark:text-slate-300">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <MapPin size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-slate-600 dark:text-slate-300 truncate">{location}</span>
              </div>
            </div>
          </div>

          {/* Soft Skills & Hobbies Card */}
          <div className="cyber-glass-card p-5 relative group">
            {isAdmin && (
              <button
                onClick={() => handleOpenModal('softskills')}
                title="Edit Skills & Hobbies"
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer z-10"
              >
                <Pencil size={12} />
              </button>
            )}

            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2 font-code uppercase">
              <Lightbulb size={15} className="text-indigo-600 dark:text-indigo-400" /> Soft Skills &amp; Interests
            </h3>
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="cyber-badge">Critical Thinking</span>
              <span className="cyber-badge-emerald">Problem Solving</span>
              <span className="cyber-badge-violet">Creative Thinking</span>
            </div>

            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2 font-code uppercase">
              <Palette size={15} className="text-indigo-600 dark:text-indigo-400" /> Hobbies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <span className="cyber-badge-amber">Tech Exploration</span>
              <span className="cyber-badge-teal">Painting &amp; Digital Art</span>
              <span className="cyber-badge">Storytelling</span>
            </div>
          </div>
        </div>

        {/* Right Column: Work Experience, Skills & Education */}
        <div className="col-span-2 flex flex-col gap-5">
          {/* Work Experience */}
          <div className="cyber-glass-card p-6 relative group">
            {isAdmin && (
              <button
                onClick={() => handleOpenModal('experience')}
                title="Edit Work Experience"
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer z-10"
              >
                <Pencil size={12} />
              </button>
            )}

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2 font-code uppercase">
              <Briefcase size={20} className="text-indigo-600 dark:text-indigo-400" /> Work Experience
            </h3>

            <div className="relative pl-5 border-l-2 border-indigo-200 dark:border-indigo-900/50 space-y-6">
              {workExperience.length > 0 ? (
                workExperience.map((exp: any, index: number) => (
                  <div key={index} className="relative">
                    <span className="absolute left-[-1.6rem] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {exp.role} &middot;{' '}
                      {exp.company_url ? (
                        <a href={exp.company_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-indigo-600 dark:text-indigo-400">
                          {exp.company} ↗
                        </a>
                      ) : (
                        <span>{exp.company}</span>
                      )}
                    </h4>
                    <p className="text-xs font-semibold font-code text-slate-500 dark:text-slate-400 my-0.5">{exp.duration}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {exp.details}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Currently pursuing degree &middot; Open to internship and project opportunities.
                </p>
              )}
            </div>
          </div>

          {/* Technical Skills Breakdown */}
          <div className="cyber-glass-card p-6 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-indigo-950/20 dark:via-slate-900/90 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/40 relative group">
            {isAdmin && (
              <button
                onClick={() => handleOpenModal('skills')}
                title="Edit Technical Skills"
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer z-10"
              >
                <Pencil size={12} />
              </button>
            )}

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 font-code uppercase">
              <Code2 size={20} className="text-indigo-600 dark:text-indigo-400" /> Technical Expertise
            </h3>

            <div className="space-y-4">
              {(technicalSkills.programming_languages?.length ?? 0) > 0 && (
                <div>
                  <span className="text-[0.7rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 font-code">
                    Languages
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {technicalSkills.programming_languages.map((lang: string, i: number) => (
                      <span key={i} className="cyber-badge">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(technicalSkills.frameworks?.length ?? 0) > 0 && (
                <div>
                  <span className="text-[0.7rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 font-code">
                    Frameworks &amp; Web
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {technicalSkills.frameworks.map((fw: string, i: number) => (
                      <span key={i} className="cyber-badge-emerald">
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(technicalSkills.ai_ml_libraries?.length ?? 0) > 0 && (
                <div>
                  <span className="text-[0.7rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 font-code">
                    AI / ML / Data Libraries
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {technicalSkills.ai_ml_libraries.map((lib: string, i: number) => (
                      <span key={i} className="cyber-badge-violet">
                        {lib}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Education Card */}
          <div className="cyber-glass-card p-6 relative group">
            {isAdmin && (
              <button
                onClick={() => handleOpenModal('education')}
                title="Edit Education"
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer z-10"
              >
                <Pencil size={12} />
              </button>
            )}

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2 font-code uppercase">
              <GraduationCap size={20} className="text-indigo-600 dark:text-indigo-400" /> Education
            </h3>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {degree}
              </h4>
              <p className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold mt-0.5">{institution}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">
                {graduationYear} &middot;{' '}
                <strong className="text-slate-900 dark:text-slate-100">CGPA: {cgpa}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil size={16} className="text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Edit Biography, Experience &amp; Skills (MongoDB)
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

            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 bg-slate-50/30 dark:bg-slate-900/30 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Bio &amp; Contact
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('experience')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap ${
                  activeTab === 'experience'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Work Experience
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('skills')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap ${
                  activeTab === 'skills'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Technical Skills
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('education')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap ${
                  activeTab === 'education'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Education
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeTab === 'profile' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Phone</label>
                      <input
                        type="text"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-4">
                  {(formData.work_experience || []).map((exp: any, i: number) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase font-code">Position {i + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(formData.work_experience || [])];
                            updated.splice(i, 1);
                            setFormData({ ...formData, work_experience: updated });
                          }}
                          className="text-red-500 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={exp.role || ''}
                          onChange={(e) => {
                            const updated = [...(formData.work_experience || [])];
                            updated[i] = { ...updated[i], role: e.target.value };
                            setFormData({ ...formData, work_experience: updated });
                          }}
                          placeholder="Role (e.g. AI / ML Intern)"
                          className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                        />
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => {
                            const updated = [...(formData.work_experience || [])];
                            updated[i] = { ...updated[i], company: e.target.value };
                            setFormData({ ...formData, work_experience: updated });
                          }}
                          placeholder="Company Name"
                          className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={exp.duration || ''}
                          onChange={(e) => {
                            const updated = [...(formData.work_experience || [])];
                            updated[i] = { ...updated[i], duration: e.target.value };
                            setFormData({ ...formData, work_experience: updated });
                          }}
                          placeholder="Duration (e.g. 2025 - Present)"
                          className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        />
                        <input
                          type="url"
                          value={exp.company_url || ''}
                          onChange={(e) => {
                            const updated = [...(formData.work_experience || [])];
                            updated[i] = { ...updated[i], company_url: e.target.value };
                            setFormData({ ...formData, work_experience: updated });
                          }}
                          placeholder="Company URL (https://...)"
                          className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={exp.details || ''}
                        onChange={(e) => {
                          const updated = [...(formData.work_experience || [])];
                          updated[i] = { ...updated[i], details: e.target.value };
                          setFormData({ ...formData, work_experience: updated });
                        }}
                        placeholder="Key responsibilities and achievements..."
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(formData.work_experience || [])];
                      updated.push({
                        role: '',
                        company: '',
                        company_url: '',
                        duration: '',
                        details: '',
                      });
                      setFormData({ ...formData, work_experience: updated });
                    }}
                    className="w-full py-2 border border-dashed border-indigo-400/50 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1.5"
                  >
                    <Plus size={14} /> Add Work Experience
                  </button>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Programming Languages (Comma-separated)</label>
                    <textarea
                      rows={2}
                      value={languagesInput}
                      onChange={(e) => setLanguagesInput(e.target.value)}
                      placeholder="C, C++, HTML, CSS, JavaScript, Python..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Frameworks &amp; Web (Comma-separated)</label>
                    <textarea
                      rows={2}
                      value={frameworksInput}
                      onChange={(e) => setFrameworksInput(e.target.value)}
                      placeholder="React.js, Next.js, FastAPI, Node.js..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">AI / ML / Data Libraries (Comma-separated)</label>
                    <textarea
                      rows={2}
                      value={aiLibrariesInput}
                      onChange={(e) => setAiLibrariesInput(e.target.value)}
                      placeholder="PyTorch, TensorFlow, LangChain, OpenCV..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Degree</label>
                    <input
                      type="text"
                      value={formData.degree || ''}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Institution</label>
                    <input
                      type="text"
                      value={formData.institution || ''}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold mb-1">Graduation Year / Duration</label>
                      <input
                        type="text"
                        value={formData.graduation_year || ''}
                        onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">CGPA</label>
                      <input
                        type="text"
                        value={formData.cgpa || ''}
                        onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}

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
