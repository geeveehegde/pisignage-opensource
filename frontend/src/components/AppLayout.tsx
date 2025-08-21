'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import SidebarComponent from './Sidebar';
import Topbar from './Topbar';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-900">piSignage</div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
              </button>
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
