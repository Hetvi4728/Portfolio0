'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAdmin } from './AdminContext';
import {
  FileText,
  Github,
  Linkedin,
  Send,
  Brain,
  Zap,
  Bot as BotIcon,
  Flame,
  Database,
  Eye,
  Layers,
  Link as LinkIcon,
  ExternalLink,
  Code2,
  Pencil,
  X,
  Save,
  Loader2,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
} from 'lucide-react';

interface HomeHeroContentProps {
  initialData: any;
}

export default function HomeHeroContent({ initialData }: HomeHeroContentProps) {
  const { isAdmin } = useAdmin();
  const [data, setData] = useState<any>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'badges' | 'metrics' | 'stack' | 'profiles'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState<any>(initialData);
  const [badgesRawText, setBadgesRawText] = useState<string>(
    Array.isArray(initialData?.hero_badges) ? initialData.hero_badges.join(', ') : ''
  );
  const [isUploading, setIsUploading] = useState(false);

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
          if (Array.isArray(fresh.hero_badges)) {
            setBadgesRawText(fresh.hero_badges.join(', '));
          }
        }
      }
    } catch (err) {
      console.warn('Failed to fetch latest resume data:', err);
    }
  };

  const handleOpenModal = (tab?: 'profile' | 'badges' | 'metrics' | 'stack' | 'profiles') => {
    setFormData(JSON.parse(JSON.stringify(data)));
    setBadgesRawText(Array.isArray(data?.hero_badges) ? data.hero_badges.join(', ') : '');
    if (tab) setActiveTab(tab);
    setSaveSuccess(false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const parsedBadges = badgesRawText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      hero_badges: parsedBadges,
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
    } catch (err) {
      alert('Error connecting to MongoDB save endpoint.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const base64 = event.target.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileData: base64, folder: 'portfolio_profiles' }),
          });
          const uploadRes = await res.json();
          if (res.ok && uploadRes.url) {
            setFormData((prev: any) => ({ ...prev, profile_image: uploadRes.url }));
          } else {
            setFormData((prev: any) => ({ ...prev, profile_image: base64 }));
          }
        } catch (err) {
          setFormData((prev: any) => ({ ...prev, profile_image: base64 }));
        } finally {
          setIsUploading(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Safe accessor helpers
  const name = data?.name || 'Hetvi Patel';
  const title = data?.title || 'IT Student';
  const summary = data?.summary || '';
  const heroTagline = data?.hero_tagline || 'OPEN TO COLLABORATION & RESEARCH';
  const profileImage = data?.profile_image || '/images/hetvi.jpg';
  const resumeUrl = data?.resume_url || data?.links?.resume || 'https://drive.google.com/file/d/1GzDOMeZzXpkl95ztqR5CXrPUbD3TYaHb/view';

  const heroBadges: string[] = Array.isArray(data?.hero_badges) && data.hero_badges.length > 0
    ? data.hero_badges
    : ['LangChain', 'FastAPI', 'OpenAI API', 'React.js / Next.js', 'PyTorch', 'ChromaDB', 'OpenCV', 'Docker'];

  const metrics = data?.metrics || {
    cgpa: data?.cgpa || '8.00',
    degree_label: 'CGPA · ' + (data?.degree || 'B.Tech in Information Technology'),
    projects_count: '2+',
    projects_label: 'Production & Research Projects',
    highlight_badge: 'RAG · Agents · Vision',
  };

  const coreStack = data?.core_stack_overview || {
    title: 'Core Stack Overview',
    categories: [
      { title: 'AI & ML Architecture', items: 'PyTorch, TensorFlow, LangChain, LangGraph, scikit-learn' },
      { title: 'Data & Vector Databases', items: 'ChromaDB, Qdrant, FAISS, PostgreSQL, MongoDB' },
      { title: 'Backend & Infrastructure', items: 'Python, FastAPI, Docker, Microservices, REST APIs' },
    ],
    link_text: 'Explore Full Stack →',
    link_url: '#stack',
  };

  const connectProfiles = Array.isArray(data?.connect_profiles) && data.connect_profiles.length > 0
    ? data.connect_profiles
    : [
        { label: 'GitHub Profile ↗', url: data?.links?.github || 'https://github.com/Hetvi4728', platform: 'github' },
        { label: 'LinkedIn Profile ↗', url: data?.links?.linkedin || 'https://www.linkedin.com/in/patelhetvi4', platform: 'linkedin' },
        { label: 'LeetCode Profile ↗', url: data?.links?.leetcode || 'https://leetcode.com/u/hetvi47/', platform: 'leetcode' },
      ];

  // Pick badge styling cyclically
  const getBadgeStyle = (index: number) => {
    const styles = [
      'cyber-badge',
      'cyber-badge-emerald',
      'cyber-badge-violet',
      'cyber-badge-teal',
      'cyber-badge-amber',
    ];
    return styles[index % styles.length];
  };

  const getBadgeIcon = (badgeName: string) => {
    const lower = badgeName.toLowerCase();
    if (lower.includes('chain') || lower.includes('ai') || lower.includes('brain')) return <Brain size={13} />;
    if (lower.includes('fast') || lower.includes('react') || lower.includes('next')) return <Zap size={13} />;
    if (lower.includes('bot') || lower.includes('gpt') || lower.includes('openai')) return <BotIcon size={13} />;
    if (lower.includes('torch') || lower.includes('tensor') || lower.includes('flame')) return <Flame size={13} />;
    if (lower.includes('db') || lower.includes('data') || lower.includes('chroma') || lower.includes('mongo')) return <Database size={13} />;
    if (lower.includes('cv') || lower.includes('vision') || lower.includes('eye')) return <Eye size={13} />;
    if (lower.includes('docker') || lower.includes('infra') || lower.includes('layer')) return <Layers size={13} />;
    return <Code2 size={13} />;
  };

  const getProfileIcon = (platform?: string) => {
    const p = (platform || '').toLowerCase();
    if (p.includes('git')) return <Github size={13} className="text-indigo-600 dark:text-indigo-400" />;
    if (p.includes('linkedin')) return <Linkedin size={13} className="text-sky-600 dark:text-sky-400" />;
    if (p.includes('leet')) return <Code2 size={13} className="text-amber-600 dark:text-amber-400" />;
    return <ExternalLink size={13} className="text-emerald-600 dark:text-emerald-400" />;
  };

  return (
    <>
      {/* 1. HERO SECTION (#home) */}
      <section id="home" className="pt-24 md:pt-28 scroll-mt-28 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Main Info Card */}
          <div className="cyber-glass-card col-span-8 p-6 md:p-8 flex flex-col justify-between relative group">
            {isAdmin && (
              <button
                onClick={() => handleOpenModal('profile')}
                title="Edit Profile & Badges"
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 text-indigo-400 hover:text-white hover:bg-indigo-600 border border-indigo-500/30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg z-10"
              >
                <Pencil size={14} />
              </button>
            )}

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-bold font-code mb-4 tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{heroTagline.toUpperCase()}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3.5 text-slate-900 dark:text-slate-100">
                {name}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed mb-6">
                {summary}
              </p>

              {/* Skills badges / pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {heroBadges.map((badge, idx) => (
                  <span key={idx} className={getBadgeStyle(idx)}>
                    {getBadgeIcon(badge)} {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-primary text-xs px-4 py-2"
              >
                <FileText size={14} /> Resume ↗
              </a>
              {data?.links?.github && (
                <a
                  href={data.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-btn-secondary text-xs px-4 py-2"
                >
                  <Github size={14} /> GitHub ↗
                </a>
              )}
              {data?.links?.linkedin && (
                <a
                  href={data.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-btn-secondary text-xs px-4 py-2"
                >
                  <Linkedin size={14} /> LinkedIn ↗
                </a>
              )}
              {data?.links?.leetcode && (
                <a
                  href={data.links.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-btn-secondary text-xs px-4 py-2"
                >
                  <Code2 size={14} /> LeetCode ↗
                </a>
              )}
              <a href="#contact" className="cyber-btn-secondary text-xs px-4 py-2">
                <Send size={14} /> Contact →
              </a>
            </div>
          </div>

          {/* Portrait Photo Card */}
          <div className="cyber-glass-card col-span-4 p-0 overflow-hidden relative group min-h-[280px] border-purple-100 dark:border-purple-900/40">
            {isAdmin && (
              <button
                onClick={() => handleOpenModal('profile')}
                title="Change Photo"
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 text-indigo-400 hover:text-white hover:bg-indigo-600 border border-indigo-500/30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg z-20"
              >
                <Pencil size={14} />
              </button>
            )}
            <Image
              src={profileImage}
              alt={name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Card 1: Key Metrics / Stats Card with Amber Aesthetic Tint */}
          <div className="cyber-glass-card col-span-4 p-5 flex flex-col justify-between bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 dark:from-amber-950/40 dark:via-slate-900/90 dark:to-orange-950/30 border-amber-100 dark:border-amber-900/40 relative group">
            {isAdmin && (
              <button
                onClick={() => handleOpenModal('metrics')}
                title="Edit Metrics"
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/80 text-amber-400 hover:text-white hover:bg-amber-600 border border-amber-500/30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md z-10"
              >
                <Pencil size={13} />
              </button>
            )}

            <div className="flex flex-col gap-3.5">
              <div>
                <div className="text-4xl font-extrabold font-code text-amber-600 dark:text-amber-400 leading-none">
                  {metrics.cgpa}
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 font-code">
                  {metrics.degree_label}
                </div>
              </div>
              <div className="border-t border-amber-200/60 dark:border-amber-900/40 my-0.5"></div>
              <div>
                <div className="text-4xl font-extrabold font-code text-indigo-600 dark:text-indigo-400 leading-none">
                  {metrics.projects_count}
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 font-code">
                  {metrics.projects_label}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <span className="cyber-badge-amber w-full justify-center">
                <Layers size={13} /> {metrics.highlight_badge}
              </span>
            </div>
          </div>

          {/* Card 2: Core Stack Overview Card with Emerald Aesthetic Tint */}
          <div className="cyber-glass-card col-span-4 p-5 flex flex-col justify-between bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 dark:from-emerald-950/40 dark:via-slate-900/90 dark:to-teal-950/30 border-emerald-100 dark:border-emerald-900/40 relative group">
            {isAdmin && (
              <button
                onClick={() => handleOpenModal('stack')}
                title="Edit Core Stack Overview"
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/80 text-emerald-400 hover:text-white hover:bg-emerald-600 border border-emerald-500/30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md z-10"
              >
                <Pencil size={13} />
              </button>
            )}

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5 font-code">
                <Code2 size={15} /> {coreStack.title || 'Core Stack Overview'}
              </h3>

              <div className="space-y-2.5">
                {(coreStack.categories || []).map((cat: any, i: number) => (
                  <div key={i}>
                    <span className="text-[0.7rem] font-bold text-slate-900 dark:text-slate-100 uppercase font-code block mb-0.5">
                      {cat.title}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {cat.items}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-emerald-200/60 dark:border-emerald-900/40">
              <a
                href={coreStack.link_url || '#stack'}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                {coreStack.link_text || 'Explore Full Stack →'}
              </a>
            </div>
          </div>

          {/* Card 3: Connect & Profiles Card with Sky/Indigo Aesthetic Tint */}
          <div className="cyber-glass-card col-span-4 p-5 flex flex-col justify-between bg-gradient-to-br from-sky-50/80 via-white to-indigo-50/60 dark:from-sky-950/40 dark:via-slate-900/90 dark:to-indigo-950/30 border-sky-100 dark:border-sky-900/40 relative group">
            {isAdmin && (
              <button
                onClick={() => handleOpenModal('profiles')}
                title="Edit Connect & Profiles"
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/80 text-sky-400 hover:text-white hover:bg-sky-600 border border-sky-500/30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md z-10"
              >
                <Pencil size={13} />
              </button>
            )}

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-3 flex items-center gap-1.5 font-code">
                <LinkIcon size={15} /> Connect &amp; Profiles
              </h3>
              <div className="flex flex-col gap-2">
                {connectProfiles.map((item: any, i: number) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cyber-btn-secondary w-full text-xs !py-2 !justify-start hover:border-indigo-300 dark:hover:border-indigo-600"
                  >
                    {getProfileIcon(item.platform || item.label)} {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADMIN EDIT MODAL */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Pencil size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Edit Hero &amp; Overview (MongoDB)
                  </h3>
                  <p className="text-[0.7rem] text-slate-500 dark:text-slate-400">
                    Changes are saved live into MongoDB Atlas collection &quot;resume&quot;
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 bg-slate-50/30 dark:bg-slate-900/30 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'profile'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                Profile &amp; Header
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('badges')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'badges'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                Skills Badges
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('metrics')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'metrics'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                Key Metrics
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stack')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'stack'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                Core Stack Card
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('profiles')}
                className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'profiles'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                Connect &amp; Profiles
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* TAB 1: PROFILE & HEADER */}
              {activeTab === 'profile' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Header Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.hero_tagline || ''}
                      onChange={(e) => setFormData({ ...formData, hero_tagline: e.target.value })}
                      placeholder="OPEN TO COLLABORATION & RESEARCH"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Title / Role
                      </label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Hero Bio / Summary
                    </label>
                    <textarea
                      rows={3}
                      value={formData.summary || ''}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Resume PDF / Drive URL
                    </label>
                    <input
                      type="url"
                      value={formData.resume_url || ''}
                      onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Photo Upload & URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Profile Image (Path, URL or Upload)
                    </label>
                    <div className="flex gap-2 items-center mb-2">
                      <input
                        type="text"
                        value={formData.profile_image || ''}
                        onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                        placeholder="/images/hetvi.jpg or https://res.cloudinary.com/..."
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                      />
                      <label className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all">
                        {isUploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                        <span>Upload</span>
                        <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                      </label>
                    </div>
                    {formData.profile_image && (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mt-2">
                        <Image src={formData.profile_image} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: SKILLS BADGES */}
              {activeTab === 'badges' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Hero Badges (Comma-separated)
                    </label>
                    <p className="text-[0.7rem] text-slate-500 dark:text-slate-400 mb-2">
                      Enter skill badges separated by commas. Each badge will render with an aesthetic cyber pill icon.
                    </p>
                    <textarea
                      rows={3}
                      value={badgesRawText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBadgesRawText(val);
                        const arr = val
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setFormData((prev: any) => ({ ...prev, hero_badges: arr }));
                      }}
                      placeholder="LangChain, FastAPI, OpenAI API, React.js / Next.js, PyTorch, ChromaDB, OpenCV, Docker"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      Live Preview ({formData.hero_badges?.length || 0} badges):
                    </span>
                    <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      {(formData.hero_badges || []).map((badge: string, idx: number) => (
                        <span key={idx} className={getBadgeStyle(idx)}>
                          {getBadgeIcon(badge)} {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: KEY METRICS */}
              {activeTab === 'metrics' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
                    Controls the Key Metrics &amp; Stats card (Amber aesthetic).
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Metric 1 Value (e.g. CGPA)
                      </label>
                      <input
                        type="text"
                        value={formData.metrics?.cgpa || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metrics: { ...formData.metrics, cgpa: e.target.value },
                            cgpa: e.target.value,
                          })
                        }
                        placeholder="8.00"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Metric 1 Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.metrics?.degree_label || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metrics: { ...formData.metrics, degree_label: e.target.value },
                          })
                        }
                        placeholder="CGPA · B.Tech in Information Technology"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Metric 2 Value (e.g. Projects)
                      </label>
                      <input
                        type="text"
                        value={formData.metrics?.projects_count || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metrics: { ...formData.metrics, projects_count: e.target.value },
                          })
                        }
                        placeholder="2+"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Metric 2 Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.metrics?.projects_label || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metrics: { ...formData.metrics, projects_label: e.target.value },
                          })
                        }
                        placeholder="Production & Research Projects"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Highlight Tag (Bottom Pill)
                    </label>
                    <input
                      type="text"
                      value={formData.metrics?.highlight_badge || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metrics: { ...formData.metrics, highlight_badge: e.target.value },
                        })
                      }
                      placeholder="RAG · Agents · Vision"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: CORE STACK CARD */}
              {activeTab === 'stack' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400">
                    Controls the Core Stack Overview card (Emerald aesthetic).
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Card Title
                    </label>
                    <input
                      type="text"
                      value={formData.core_stack_overview?.title || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          core_stack_overview: {
                            ...formData.core_stack_overview,
                            title: e.target.value,
                          },
                        })
                      }
                      placeholder="Core Stack Overview"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Categories */}
                  <div className="space-y-3">
                    {(formData.core_stack_overview?.categories || []).map((cat: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[0.7rem] font-bold uppercase text-slate-600 dark:text-slate-400">
                            Category {i + 1}
                          </label>
                        </div>
                        <input
                          type="text"
                          value={cat.title || ''}
                          onChange={(e) => {
                            const newCats = [...(formData.core_stack_overview?.categories || [])];
                            newCats[i] = { ...newCats[i], title: e.target.value };
                            setFormData({
                              ...formData,
                              core_stack_overview: { ...formData.core_stack_overview, categories: newCats },
                            });
                          }}
                          placeholder="Category Name (e.g. AI & ML Architecture)"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 font-bold"
                        />
                        <textarea
                          rows={2}
                          value={cat.items || ''}
                          onChange={(e) => {
                            const newCats = [...(formData.core_stack_overview?.categories || [])];
                            newCats[i] = { ...newCats[i], items: e.target.value };
                            setFormData({
                              ...formData,
                              core_stack_overview: { ...formData.core_stack_overview, categories: newCats },
                            });
                          }}
                          placeholder="Items list (e.g. PyTorch, TensorFlow, LangChain...)"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Footer Link Text
                      </label>
                      <input
                        type="text"
                        value={formData.core_stack_overview?.link_text || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            core_stack_overview: {
                              ...formData.core_stack_overview,
                              link_text: e.target.value,
                            },
                          })
                        }
                        placeholder="Explore Full Stack →"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Footer Link URL / Anchor
                      </label>
                      <input
                        type="text"
                        value={formData.core_stack_overview?.link_url || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            core_stack_overview: {
                              ...formData.core_stack_overview,
                              link_url: e.target.value,
                            },
                          })
                        }
                        placeholder="#stack"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CONNECT & PROFILES */}
              {activeTab === 'profiles' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-700 dark:text-sky-400">
                    Controls the Connect &amp; Profiles card links (Sky/Indigo aesthetic).
                  </div>

                  <div className="space-y-3">
                    {(formData.connect_profiles || []).map((prof: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[0.7rem] font-bold uppercase text-slate-600 dark:text-slate-400">
                            Profile {i + 1}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(formData.connect_profiles || [])];
                              updated.splice(i, 1);
                              setFormData({ ...formData, connect_profiles: updated });
                            }}
                            className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <input
                              type="text"
                              value={prof.label || ''}
                              onChange={(e) => {
                                const updated = [...(formData.connect_profiles || [])];
                                updated[i] = { ...updated[i], label: e.target.value };
                                setFormData({ ...formData, connect_profiles: updated });
                              }}
                              placeholder="Label (e.g. GitHub Profile ↗)"
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 font-semibold"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="url"
                              value={prof.url || ''}
                              onChange={(e) => {
                                const updated = [...(formData.connect_profiles || [])];
                                updated[i] = { ...updated[i], url: e.target.value };
                                setFormData({ ...formData, connect_profiles: updated });
                              }}
                              placeholder="https://..."
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(formData.connect_profiles || [])];
                        updated.push({ label: 'New Profile ↗', url: '', platform: 'other' });
                        setFormData({ ...formData, connect_profiles: updated });
                      }}
                      className="w-full py-2 border border-dashed border-indigo-400/40 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Plus size={14} /> Add Profile Link
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving to MongoDB...
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
    </>
  );
}
