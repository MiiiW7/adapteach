'use client';

import { usePathname } from 'next/navigation';
import { Footer7 } from './footer7';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Halaman yang tidak perlu footer
  const authPages = ['/login', '/register'];
  const shouldHideFooter = authPages.includes(pathname);
  
  if (shouldHideFooter) {
    return null;
  }
  
  return <Footer7 />;
}
