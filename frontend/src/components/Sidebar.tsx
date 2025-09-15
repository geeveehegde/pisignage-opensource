'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  PhotoIcon,
  ComputerDesktopIcon,
  QueueListIcon,
  CogIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Assets',
    href: '/assets',
    icon: PhotoIcon,
  },
  {
    name: 'Groups',
    href: '/groups',
    icon: ComputerDesktopIcon,
  },
  {
    name: 'Players',
    href: '/players',
    icon: UserGroupIcon,
  },
  {
    name: 'Playlists',
    href: '/playlists',
    icon: QueueListIcon,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: CogIcon,
  },
];

export default function SidebarComponent() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col items-start space-y-2">
          <img 
            src="/pisignage-logo.png" 
            alt="piSignage" 
            className="h-10 w-auto object-contain mt-2"
          />
        </div>
       
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.name}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  );
}
