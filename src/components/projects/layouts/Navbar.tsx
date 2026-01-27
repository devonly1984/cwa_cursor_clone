"use client"
import { Button } from "@/components/ui/button";

import { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { poppins } from "@/lib/constants";
import { UserButton } from "@clerk/nextjs";
import { useProject, useRenameProject } from "@/hooks/useProjects";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { CloudCheck, Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
interface NavbarProps {
    projectId:Id<'projects'>;
}
const Navbar = ({ projectId }: NavbarProps) => {

  const project = useProject(projectId);
  const renameProject = useRenameProject(projectId);
  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState("");
  
const handleStartRename = ()=>{
  if (!project) return;
  setName(project.name);
  setIsRenaming(true);

}
const handleSubmit = ()=>{
  if (!project )return;
  setIsRenaming(false);
  const trimmedName = name.trim();
  if (!trimmedName || trimmedName===project.name)  {
    return
  }
  renameProject({ id: projectId, name: trimmedName });
}
const handleKeyDown = (e:KeyboardEvent)=>{
  if (e.key==='Enter') {
    handleSubmit();
  } else if (e.key==='Escape') {
    setIsRenaming(false);
  }

}
  return (
    <nav className="flex justify-between items-center gap-x-2 p-2 bg-sidebar border-b">
      <div className="flex items-center gap-x-2">
        <Breadcrumb>
          <BreadcrumbList className="gap-0!">
            <BreadcrumbItem>
              <BreadcrumbLink
                className="flex items-center gap-1.5 group/logo"
                asChild
              >
                <Button
                  variant={"ghost"}
                  className="w-fit! p-1.5! h-7!"
                  asChild
                >
                  <Link href="/">
                    <Image
                      src="/images/logo.svg"
                      alt="Logo"
                      width={20}
                      height={20}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium",
                        poppins.className
                      )}
                    >
                      Polaris
                    </span>
                  </Link>
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="ml-0! mr-1" />
            <BreadcrumbItem>
              {isRenaming ? (
                <Input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                  onBlur={handleSubmit}
                  onKeyDown={(e) => handleKeyDown}
                  className="text-sm bg-transparent text-foreground outline-none focus:ring-1 focus:ring-inset focus:ring-ring font-medium max-w-40 truncate"
                />
              ) : (
                <BreadcrumbPage
                  onClick={handleStartRename}
                  className="text-sm cursor-pointer hover:text-primary font-medium max-w-40 truncate"
                >
                  {project?.name ?? "Loading..."}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {project?.importStatus === "importing" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Loader className="size-4 text-muted-foreground animate-spin" />
            </TooltipTrigger>
            <TooltipContent>Importing...</TooltipContent>
          </Tooltip>
        ) : (
          project?.updatedAt && (
            <Tooltip>
              <TooltipTrigger asChild>
                <CloudCheck className="size-4 text-muted-foreground " />
              </TooltipTrigger>
              <TooltipContent>
                Saved{" "}
                {project.updatedAt
                  ? formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })
                  : "Loading..."}
              </TooltipContent>
            </Tooltip>
          )
        )}
      </div>
      <div className="flex items-center gap-2">
        <UserButton />
      </div>
    </nav>
  );
};
export default Navbar