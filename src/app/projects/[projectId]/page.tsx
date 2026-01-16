import ProjectIdView from "@/components/projects/views/ProjectIdView";
import { Id } from "../../../../convex/_generated/dataModel";


interface SingleProjectPageProps {
  params: Promise<{ projectId: Id<"projects"> }>;
}
const SingleProjectPage =async ({ params }: SingleProjectPageProps) => {
    const { projectId } = await params;
  return <ProjectIdView projectId={projectId}/>;
};
export default SingleProjectPage;
