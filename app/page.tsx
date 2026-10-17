import React from 'react';
import { getProjectsData, getBlogData, getResumeData } from '@/lib/contentStore';
import { Project, BlogPost } from '@/types/portfolio';

import HomeHeroContent from '@/components/HomeHeroContent';
import TechStackContent from '@/components/TechStackContent';
import ProjectsContent from '@/components/ProjectsContent';
import HomeAboutContent from '@/components/HomeAboutContent';
import BlogContent from '@/components/BlogContent';
import HomeContactContent from '@/components/HomeContactContent';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [projectsData, blogData, resumeData] = await Promise.all([
    getProjectsData(),
    getBlogData(),
    getResumeData(),
  ]);
  const projects: Project[] = projectsData;
  const posts: BlogPost[] = blogData;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* 1. HERO SECTION (#home) - Fully editable by admin & backed by MongoDB */}
      <HomeHeroContent initialData={resumeData} />

      {/* 2. TECH STACK SECTION (#stack) - Fully editable by admin & backed by MongoDB */}
      <TechStackContent initialData={resumeData} />

      {/* 3. PROJECTS SECTION (#projects) - Fully editable by admin & backed by MongoDB */}
      <section id="projects" className="scroll-mt-28">
        <ProjectsContent initialProjects={projects} sectionPrefix="03 / PORTFOLIO & LAB" hidePadding={true} />
      </section>

      {/* 4. ABOUT SECTION (#about) - Fully editable by admin & backed by MongoDB */}
      <HomeAboutContent initialData={resumeData} />

      {/* 5. BLOG SECTION (#blog) - Fully editable by admin & backed by MongoDB */}
      <section id="blog" className="scroll-mt-28">
        <BlogContent initialPosts={posts} sectionPrefix="05 / WRITING & ARTICLES" hidePadding={true} />
      </section>

      {/* 6. CONTACT SECTION (#contact) - Fully editable by admin & backed by MongoDB */}
      <HomeContactContent initialData={resumeData} />
    </div>
  );
}
