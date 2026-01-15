import { Button } from "@/components/ui/button";
import { Doc } from "../../../../convex/_generated/dataModel"
import Link from "next/link";
import { AlertCircle, ArrowRight, Globe, Loader2 } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import { FaGithub } from "react-icons/fa";

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

const ContinueCard = ({ data }: { data: Doc<"projects"> }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">Last Updated</span>
      <Button
        variant={"outline"}
        asChild
        className="h-auto items-start justify-start p-4 flex flex-col gap-2 bg-background border rounded-none"
      >
        <Link href={`/projects/${data._id}`} className="group">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {getProjectIcon(data)}
              <span className="font-medium truncate">{data.name}</span>
            </div>
            <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(data.updatedAt)}
          </span>
        </Link>
      </Button>
    </div>
  );
};
export default ContinueCard