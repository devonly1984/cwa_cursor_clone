"use client";

import { cn } from "@/lib/utils";

interface TabProps {
    label:string;
    isActive:boolean;
    onClick:()=>void;

}
const Tab = ({ label, isActive, onClick }: TabProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 h-full px-3 cursor-pointer text-muted-foreground border-r hover:bg-accent/30",
        isActive && "bg-background text-foreground"
      )}
    >
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default Tab