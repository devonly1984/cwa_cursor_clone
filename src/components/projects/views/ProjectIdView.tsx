"use client";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import Tab from "../shared/Tab";
import { cn } from "@/lib/utils";
import ExportToGithub from "../buttons/ExportToGithub";

interface ProjectIdViewProps {
  projectId: Id<"projects">;
}
const ProjectIdView = ({ projectId }: ProjectIdViewProps) => {
    const [activeView, setActiveView] = useState<"editor" | "preview">(
      "editor"
    );
  return (
    <div className="h-full flex flex-col">
      <nav className="h-8.75 flex items-center bg-sidebar border-b">
        <Tab
          label="Code"
          isActive={activeView === "editor"}
          onClick={() => setActiveView("editor")}
        />
        <Tab
          label="Preview"
          isActive={activeView === "preview"}
          onClick={() => setActiveView("preview")}
        />
        <ExportToGithub />
      </nav>
      <div className="flex-1 relative">
        <div
          className={cn(
            "absolute inset-0",
            activeView === "editor" ? "visible" : "invisible"
          )}
        >
          <div className="">Editor</div>
        </div>
        <div
          className={cn(
            "absolute inset-0",
            activeView === "preview" ? "visible" : "invisible"
          )}
        >
          <div className="">Preview</div>
        </div>
      </div>
    </div>
  );
};
export default ProjectIdView;
