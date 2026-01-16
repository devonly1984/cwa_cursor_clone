"use client"

import { useProjectsPartial } from "@/hooks/useProjects";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { Kbd } from "../ui/kbd";
import ProjectItem from "./cards/ProjectItem";
import ContinueCard from "./cards/ContinueCard";

interface ProjectsListProps {
    onViewAll: ()=>void;
}
const ProjectsList = ({ onViewAll }: ProjectsListProps) => {
    const projects = useProjectsPartial(6);
  
    if (projects===undefined) {
        return <Spinner className="size-4 text-ring" />;
    }
      const [mostRecent, ...rest] = projects;
  return (
    <div className="flex flex-col gap-4">
      {mostRecent ? <ContinueCard data={mostRecent} /> : null}
      {rest.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              Recent Projects
            </span>
            <Button
              className="flex items-center gap-2 text-muted-foreground text-xs hover:text-foreground transition-colors"
              onClick={onViewAll}
            >
              View All
              <Kbd className="bg-accent border">Alt +K</Kbd>
            </Button>
          </div>
          <ul>
            {rest.map((project) => (
              <ProjectItem key={project._id} data={project} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default ProjectsList