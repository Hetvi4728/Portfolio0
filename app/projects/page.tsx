import React from 'react';
import projectsData from '@/data/projects.json';
import { Project } from '@/types/portfolio';
import ProjectsContent from '@/components/ProjectsContent';

export const metadata = {
  title: 'Projects | Hetvi Patel',
  description: 'Explore Hetvi Patel\'s portfolio of projects, web development, and software applications.',
};

export default function ProjectsPage() {
  const projects: Project[] = projectsData;
  return <ProjectsContent initialProjects={projects} />;
}
