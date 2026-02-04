"use client"

import { ReactNode } from "react"
import Navbar from "./Navbar";
import { Id } from "../../../../convex/_generated/dataModel";
import {Allotment} from 'allotment'
import { DEFAULT_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE, MAX_SIDEBAR_WIDTH, MIN_SIDEBAR_WIDTH } from "@/lib/constants";

import ConversationSidebar from "@/components/conversations/layout/ConversationSidebar";
interface ProjectIdLayoutProps {
  children: ReactNode;
  projectId: Id<"projects">;
}
const ProjectIdLayout = ({
  children,
  projectId,
}: ProjectIdLayoutProps) => {
  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar projectId={projectId} />
      <div className="flex-1 flex overflow-hidden">
        <Allotment
          className="flex-1"
          defaultSizes={[DEFAULT_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}
        >
          <Allotment.Pane
            snap
            minSize={MIN_SIDEBAR_WIDTH}
            maxSize={MAX_SIDEBAR_WIDTH}
            preferredSize={DEFAULT_SIDEBAR_WIDTH}
          >
           <ConversationSidebar projectId={projectId}/>
          </Allotment.Pane>
          <Allotment.Pane>{children}</Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};
export default ProjectIdLayout