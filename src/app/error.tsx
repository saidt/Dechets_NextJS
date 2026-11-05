'use client';

import { clientError } from '@/lib/error';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  const router = useRouter()
  const pathName = usePathname()
  
  useEffect(() => {
    clientError('GlobalError', error, pathName, router)
  }, [error]);

  return (
    <></>
  );
}