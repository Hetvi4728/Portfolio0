import React from 'react';
import { ArtItem } from '@/types/portfolio';
import ArtContent from '@/components/ArtContent';
import { getArtData } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Creations & Art | Hetvi Patel',
  description:
    'A curated gallery of personal visual explorations, paintings, and digital artwork created outside of coding by Hetvi Patel.',
};

export default async function ArtPage() {
  const artworks: ArtItem[] = await getArtData();
  return <ArtContent initialArtworks={artworks} />;
}
