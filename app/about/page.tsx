import React from 'react';
import resumeData from '@/data/resume.json';
import AboutContent from '@/components/AboutContent';

export const metadata = {
  title: 'About Me | Hetvi Patel',
  description: 'Learn more about Hetvi Patel\'s background, education, technical skills, and projects.',
};

export default function AboutPage() {
  return <AboutContent initialResume={resumeData} />;
}
