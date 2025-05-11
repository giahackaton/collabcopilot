
import React from 'react';
import { cn } from "@/lib/utils";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
}

const Sidebar = ({ children, className = "" }: SidebarProps) => {
  return (
    <aside 
      className={cn(
        "h-screen bg-background border-r transition-all duration-300 ease-in-out flex-shrink-0 w-64",
        className
      )}
    >
      <div className="p-4">
        {children}
      </div>
    </aside>
  );
};

export default Sidebar;
