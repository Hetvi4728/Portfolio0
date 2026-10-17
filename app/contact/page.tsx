import React from 'react';
import { getResumeData } from '@/lib/contentStore';
import HomeContactContent from '@/components/HomeContactContent';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact | Hetvi Patel',
  description: 'Get in touch with Hetvi Patel for internships, projects, or collaborations.',
};

export default async function ContactPage() {
  const resumeData = await getResumeData();

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12">
      <HomeContactContent initialData={resumeData} />
    </div>
  );
}
