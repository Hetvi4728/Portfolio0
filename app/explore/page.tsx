import type { Metadata } from 'next';
import ExploreContent from '@/components/ExploreContent';

export const metadata: Metadata = {
  title: 'Explore — Hetvi Patel',
  description:
    "Explore Hetvi Patel's projects, websites, creative experiments, and things she's building.",
};

export default function ExplorePage() {
  return <ExploreContent />;
}
