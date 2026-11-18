import type {Metadata} from 'next';
import {PrivacyContent} from '@/components/privacy-content';
import {RESUME_DATA} from '@/data/resume-data';
import {siteMetadata} from '../site-config';

const title = `${RESUME_DATA.ui.privacy.title} | ${RESUME_DATA.name}`;
const description = RESUME_DATA.ui.privacy.intro;

/** Own description and share preview; the card image is re-exported in this folder. */
export const metadata: Metadata = {
  title: RESUME_DATA.ui.privacy.title,
  description,
  alternates: {canonical: '/privacy'},
  openGraph: {
    ...siteMetadata.openGraph,
    type: 'website',
    url: '/privacy',
    title,
    description,
  },
  twitter: {...siteMetadata.twitter, title, description},
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
