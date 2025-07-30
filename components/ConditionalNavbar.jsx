'use client';

import { usePathname } from 'next/navigation';
import { Navbar1 } from './navbar1';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Halaman yang tidak perlu navbar
  const authPages = ['/login', '/register'];
  const shouldHideNavbar = authPages.includes(pathname);
  
  if (shouldHideNavbar) {
    return null;
  }
  
  return <Navbar1 />;
}
