import React from 'react';
import { Project } from '@/types/portfolio';
import ProjectsContent from '@/components/ProjectsContent';
import { getProjectsData } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects | Hetvi Patel',
  description: 'Explore Hetvi Patel\'s portfolio of projects, web development, and software applications.',
};

export default async function ProjectsPage() {
  const projects: Project[] = await getProjectsData();
  return <ProjectsContent initialProjects={projects} />;
}
