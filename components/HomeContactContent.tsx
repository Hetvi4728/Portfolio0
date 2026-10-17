'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Code2,
  Instagram,
  Send,
  Pencil,
  X,
  Save,
  Loader2,
  CheckCircle2,
  Globe,
  ExternalLink,
} from 'lucide-react';

interface HomeContactContentProps {
  initialData: any;
}

export default function HomeContactContent({ initialData }: HomeContactContentProps) {
  const { isAdmin } = useAdmin();
  const [data, setData] = useState<any>(initialData || {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    location: initialData?.location || '',
    contact_note:
      initialData?.contact_note ||
      'Open to full-time roles, freelance projects, AI consulting, and research collaborations.',
    links: {
      github: initialData?.links?.github || '',
      linkedin: initialData?.links?.linkedin || '',
      leetcode: initialData?.links?.leetcode || '',
      GeeksforGeeks: initialData?.links?.GeeksforGeeks || '',
      instagram: initialData?.links?.instagram || '',
      medium: initialData?.links?.medium || '',
    },
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
          setFormData({
            email: fresh.email || '',
            phone: fresh.phone || '',
            location: fresh.location || '',
            contact_note:
              fresh.contact_note ||
              'Open to full-time roles, freelance projects, AI consulting, and research collaborations.',
            links: {
              github: fresh.links?.github || '',
              linkedin: fresh.links?.linkedin || '',
              leetcode: fresh.links?.leetcode || '',
              GeeksforGeeks: fresh.links?.GeeksforGeeks || '',
              instagram: fresh.links?.instagram || '',
              medium: fresh.links?.medium || '',
            },
          });
        }
      }
    } catch (err) {
      console.warn('Failed to fetch latest resume for contact section:', err);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      email: data.email || '',
      phone: data.phone || '',
      location: data.location || '',
      contact_note:
        data.contact_note ||
        'Open to full-time roles, freelance projects, AI consulting, and research collaborations.',
      links: {
        github: data.links?.github || '',
        linkedin: data.links?.linkedin || '',
        leetcode: data.links?.leetcode || '',
        GeeksforGeeks: data.links?.GeeksforGeeks || '',
        instagram: data.links?.instagram || '',
        medium: data.links?.medium || '',
      },
    });
    setSaveSuccess(false);
    setSaveError(null);
    setHasUnsavedChanges(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (hasUnsavedChanges && !saveSuccess) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to discard them?'
      );
      if (!confirmClose) return;
    }
    setIsModalOpen(false);
    setHasUnsavedChanges(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleLinkChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      links: {
        ...prev.links,
        [key]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const payload = {
      ...data,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      contact_note: formData.contact_note,
      links: {
        ...(data.links || {}),
        ...formData.links,
      },
    };

    try {
      const res = await fetch('/api/resume/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || result.details || 'Failed to save to database');
      }

      setData(payload);
      setSaveSuccess(true);
      setHasUnsavedChanges(false);
      setTimeout(() => {
        setIsModalOpen(false);
        setSaveSuccess(false);
      }, 1200);
    } catch (err: any) {
      console.error('Save failed:', err);
      setSaveError(err.message || 'Error saving contact details to MongoDB');
    } finally {
      setIsSaving(false);
    }
  };

  const socialLinkClasses =
    'w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 shadow-sm bg-white/80 dark:bg-slate-800/70';

  const email = data?.email || 'patelhetvi4728@gmail.com';
  const phone = data?.phone || '+91 97232 50645';
  const location = data?.location || 'Anand, Gujarat, India';
  const contactNote =
    data?.contact_note ||
    'Open to full-time roles, freelance projects, AI consulting, and research collaborations.';
  const links = data?.links || {};

  return (
    <section id="contact" className="scroll-mt-28 relative">
      <div className="text-center mb-10 relative">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-code block mb-1">
          06 / TALK &amp; CONTACT
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
          Get in Touch
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          Have a project idea, AI opportunity, or collaboration inquiry? Feel free to reach out directly.
        </p>

        {isAdmin && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800/60 transition-all shadow-xs"
            >
              <Pencil size={13} />
              Edit Contact Info &amp; Social Links (Admin)
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
        {/* Contact Info Side Card */}
        <div className="cyber-glass-card p-5 flex flex-col justify-between bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-900/90 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/40 min-h-[340px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Contact Information
              </h3>
              {isAdmin && (
                <button
                  onClick={handleOpenModal}
                  className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                  title="Edit details"
                >
                  <Pencil size={13} />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
              {contactNote}
            </p>

            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs shrink-0">
                  <Mail size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[0.65rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-code">
                    Email
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="font-semibold text-xs text-slate-900 dark:text-slate-100 hover:underline truncate block"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs shrink-0">
                  <Phone size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[0.65rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-code">
                    Phone
                  </span>
                  <a
                    href={`tel:${phone}`}
                    className="font-semibold text-xs text-slate-900 dark:text-slate-100 block"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs shrink-0">
                  <MapPin size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[0.65rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-code">
                    Location
                  </span>
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block truncate">
                    {location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900/40 mt-5">
            <div className="flex gap-2.5 justify-center flex-wrap">
              {links.github && (
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClasses}
                  title="GitHub"
                >
                  <Github size={15} />
                </a>
              )}
              {links.linkedin && (
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClasses}
                  title="LinkedIn"
                >
                  <Linkedin size={15} />
                </a>
              )}
              {links.leetcode && (
                <a
                  href={links.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClasses}
                  title="LeetCode"
                >
                  <Code2 size={15} />
                </a>
              )}
              {links.GeeksforGeeks && (
                <a
                  href={links.GeeksforGeeks}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClasses}
                  title="GeeksforGeeks"
                >
                  <Globe size={15} />
                </a>
              )}
              {links.instagram && (
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClasses}
                  title="Instagram"
                >
                  <Instagram size={15} />
                </a>
              )}
              {links.medium && (
                <a
                  href={links.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClasses}
                  title="Medium"
                >
                  <ExternalLink size={15} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="cyber-glass-card p-5 md:col-span-2">
          <form action="https://api.web3forms.com/submit" method="POST" className="space-y-3.5">
            <input type="hidden" name="access_key" value="5b038aeb-d553-42aa-b4ad-a244fd5aac2a" />
            <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

            <div>
              <label htmlFor="contact_name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="contact_name"
                name="name"
                className="cyber-input text-xs"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="contact_email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="contact_email"
                name="email"
                className="cyber-input text-xs"
                placeholder="e.g. john@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="contact_message" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Message
              </label>
              <textarea
                id="contact_message"
                name="message"
                className="cyber-input min-h-[100px] text-xs resize-y"
                placeholder="Write your message here..."
                required
              ></textarea>
            </div>

            <button type="submit" className="cyber-btn-primary w-full py-2.5 text-xs mt-1">
              Send Message <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Admin Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Pencil size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Edit Contact &amp; Social Links
                  </h3>
                  <p className="text-xs text-slate-500">
                    Updates will be stored in MongoDB Atlas and reflected immediately.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Error & Success Alerts */}
            {saveError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
                {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={16} /> Changes saved successfully to MongoDB!
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="cyber-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="cyber-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="cyber-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Card Note / Bio
                </label>
                <textarea
                  value={formData.contact_note}
                  onChange={(e) => handleChange('contact_note', e.target.value)}
                  className="cyber-input text-xs min-h-[70px] resize-y"
                  placeholder="Short note about what inquiries you are open to..."
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-3 font-code uppercase tracking-wider">
                  Social Links
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[0.7rem] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.links.github}
                      onChange={(e) => handleLinkChange('github', e.target.value)}
                      placeholder="https://github.com/..."
                      className="cyber-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.7rem] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={formData.links.linkedin}
                      onChange={(e) => handleLinkChange('linkedin', e.target.value)}
                      placeholder="https://www.linkedin.com/in/..."
                      className="cyber-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.7rem] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      LeetCode URL
                    </label>
                    <input
                      type="url"
                      value={formData.links.leetcode}
                      onChange={(e) => handleLinkChange('leetcode', e.target.value)}
                      placeholder="https://leetcode.com/u/..."
                      className="cyber-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.7rem] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      GeeksforGeeks Profile URL
                    </label>
                    <input
                      type="url"
                      value={formData.links.GeeksforGeeks}
                      onChange={(e) => handleLinkChange('GeeksforGeeks', e.target.value)}
                      placeholder="https://www.geeksforgeeks.org/profile/..."
                      className="cyber-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.7rem] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={formData.links.instagram}
                      onChange={(e) => handleLinkChange('instagram', e.target.value)}
                      placeholder="https://www.instagram.com/..."
                      className="cyber-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.7rem] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Medium URL
                    </label>
                    <input
                      type="url"
                      value={formData.links.medium}
                      onChange={(e) => handleLinkChange('medium', e.target.value)}
                      placeholder="https://medium.com/@..."
                      className="cyber-input text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900 pb-1">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="cyber-btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} /> Save Contact Details
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
