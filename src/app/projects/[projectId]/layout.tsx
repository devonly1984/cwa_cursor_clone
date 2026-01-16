import ProjectIdLayout from "@/components/projects/layouts/ProjectIdLayout";
import { ReactNode } from "react"
import { Id } from "../../../../convex/_generated/dataModel";
interface SingleProjectLayoutProps {
  children: ReactNode;
  params: Promise<{ projectId: Id<"projects"> }>;
}
const SingleProjectLayout = async({
  children,
  params,
}: SingleProjectLayoutProps) => {
    const {projectId} = await params;
  return (
    <ProjectIdLayout projectId={projectId}>{children}</ProjectIdLayout>
  );
};
export default SingleProjectLayout