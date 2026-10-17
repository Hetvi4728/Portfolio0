import React from 'react';
import AboutContent from '@/components/AboutContent';
import { getResumeData } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About Me | Hetvi Patel',
  description: 'Learn more about Hetvi Patel\'s background, education, technical skills, and projects.',
};

export default async function AboutPage() {
  const resumeData = await getResumeData();
  return <AboutContent initialResume={resumeData} />;
}
