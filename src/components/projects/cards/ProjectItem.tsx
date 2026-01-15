import Link from "next/link";
import { Doc } from "../../../../convex/_generated/dataModel"
import { AlertCircle, ArrowRight, Globe, Loader2 } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import { FaGithub } from "react-icons/fa";

interface ProjectItemProps {
  data: Doc<'projects'>;
}
const getProjectIcon = (project:Doc<'projects'>)=>{
   if (project.importStatus ==='completed') {
    return <FaGithub className="size-3.5 text-muted-foreground"/>
   } else if (project.importStatus==='failed'){
    return <AlertCircle className="size-3.5 text-muted-foreground" />;
   } else if (project.importStatus==='importing') {
    return (
      <Loader2 className="size-3.5 text-muted-foreground animate-spin" />
    );
   } else {
     return <Globe className="size-3.5 text-muted-foreground" />;
   }
}
const ProjectItem = ({data}:ProjectItemProps) => {
  return (
    <Link
      href={`/projects/${data._id}`}
      className="text-sm text-foreground/60 font-medium hover:text-foreground py-1 flex items-center justify-between w-full group"
    >
      <div className="flex items-center gap-2">
        {getProjectIcon(data)}
        <span className="truncate">{data.name}</span>
      </div>
      <span className="text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors">
        {formatTimestamp(data.updatedAt)}
      </span>
    </Link>
  );
}
export default ProjectItem