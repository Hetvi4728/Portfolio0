import React from 'react';
import { BlogPost } from '@/types/portfolio';
import BlogContent from '@/components/BlogContent';
import { getBlogData } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog & Articles | Hetvi Patel',
  description: 'Technical articles and deep dives written by Hetvi Patel on technology, software development, and programming.',
};

export default async function BlogPage() {
  const posts: BlogPost[] = await getBlogData();
  return <BlogContent initialPosts={posts} />;
}
