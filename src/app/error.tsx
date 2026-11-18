'use client';

import {ErrorContent} from '@/components/error-content';

export default function ErrorPage(props: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  return <ErrorContent {...props} />;
}
