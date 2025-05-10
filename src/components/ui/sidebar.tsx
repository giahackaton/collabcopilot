
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import SidebarToggle from "@/components/ui/sidebar-toggle";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
}

const Sidebar = ({ children, className = "", defaultCollapsed = false }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="relative">
      <aside 
        className={cn(
          "h-screen bg-background border-r transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          className
        )}
      >
        <div className={cn(
          "p-4", 
          collapsed ? "flex flex-col items-center" : ""
        )}>
          {children}
        </div>
      </aside>
      
      <div className="absolute top-1/2 -translate-y-1/2 -right-3 z-10">
        <SidebarToggle 
          collapsed={collapsed} 
          onClick={toggleCollapsed} 
        />
      </div>
    </div>
  );
};

export default Sidebar;
