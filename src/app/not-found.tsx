import type {Metadata} from 'next';
import {NotFoundContent} from '@/components/not-found-content';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: {index: false, follow: false},
  // A missing page is not a copy of the home page: no canonical link.
  alternates: {canonical: null},
};

export default function NotFound() {
  return <NotFoundContent />;
}
