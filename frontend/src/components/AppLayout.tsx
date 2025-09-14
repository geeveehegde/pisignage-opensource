'use client';

import { usePathname } from 'next/navigation';
import SidebarComponent from './Sidebar';
import Topbar from './Topbar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  // Temporarily bypass authentication check
  // Don't apply layout to auth page or when not authenticated
  // if (pathname === '/auth' || loading || !user) {
  //   return <>{children}</>;
  // }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 overflow-y-auto">
            <SidebarComponent />
          </div>
        </div>

        {/* Main content */}
        <SidebarInset>
          {/* Topbar - visible on all screen sizes */}
          <Topbar />
          
          {/* Mobile header */}
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-center">
              <div className="text-lg font-bold text-gray-900">piSignage</div>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-white">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
