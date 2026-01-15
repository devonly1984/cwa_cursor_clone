import {useRouter} from 'next/navigation';
import { FaGithub } from 'react-icons/fa';
import { AlertCircle, Globe, Loader2 } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useProjects } from '@/hooks/useProjects';
import { Doc } from '../../../../convex/_generated/dataModel';
interface ProjectsCommandDialogProps {
    open:boolean;
    onOpenChange:(open:boolean)=>void;
}
 const getProjectIcon = (project:Doc<'projects'>,className?:string)=>{
   if (project.importStatus ==='completed') {
    return <FaGithub className="size-4 text-muted-foreground"/>
   } else if (project.importStatus==='failed'){
    return <AlertCircle className="size-4 text-muted-foreground" />;
   } else if (project.importStatus==='importing') {
    return (
      <Loader2 className="size-4 text-muted-foreground animate-spin" />
    );
   } else {
     return <Globe className="size-4 text-muted-foreground" />;
   }
}
const ProjectsCommandDialog = ({open,onOpenChange}:ProjectsCommandDialogProps) => {
    const router =useRouter();
    const projects = useProjects();
    const handleSelect = (projectId: string)=>{
        router.push(`/projects/${projectId}`);
        onOpenChange(false);
    }
  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Projects"
      description="Search and navigate to your projects"
    >
      <CommandInput placeholder="Search projects..." />
      <CommandList>
        <CommandEmpty>No projects found.</CommandEmpty>
        <CommandGroup heading="Projects">
          {projects?.map((project) => (
            <CommandItem
              key={project._id}
              value={`${project.name}-${project._id}`}
              onSelect={() => handleSelect(project._id)}
            >
              {getProjectIcon(project)}
              <span>{project.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default ProjectsCommandDialog