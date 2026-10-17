import React from 'react';
import blogData from '@/data/blog.json';
import { BlogPost } from '@/types/portfolio';
import BlogContent from '@/components/BlogContent';

export const metadata = {
  title: 'Blog & Articles | Hetvi Patel',
  description: 'Technical articles and deep dives written by Hetvi Patel on technology, software development, and programming.',
};

export default function BlogPage() {
  const posts: BlogPost[] = blogData;
  return <BlogContent initialPosts={posts} />;
}
