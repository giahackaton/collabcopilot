
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface SidebarToggleProps {
  collapsed: boolean;
  onClick: () => void;
  className?: string;
}

const SidebarToggle = ({ collapsed, onClick, className = "" }: SidebarToggleProps) => {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className={`bg-white shadow-md rounded-full ${className}`}
      onClick={onClick}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
    </Button>
  );
};

export default SidebarToggle;
