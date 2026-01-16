"use client"

import { ReactNode } from "react"
import Navbar from "./Navbar";
import { Id } from "../../../../convex/_generated/dataModel";
import {Allotment} from 'allotment'
import { DEFAULT_CONVERSATION_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE, MAX_SIDEBAR_WIDTH, MIN_SIDEBAR_WIDTH } from "@/lib/constants";
import "allotment/dist/style.css";
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
          defaultSizes={[
            DEFAULT_CONVERSATION_SIDEBAR_WIDTH,
            DEFAULT_MAIN_SIZE,
          ]}
        >
          <Allotment.Pane
            snap
            minSize={MIN_SIDEBAR_WIDTH}
            maxSize={MAX_SIDEBAR_WIDTH}
            preferredSize={DEFAULT_CONVERSATION_SIDEBAR_WIDTH}
          >
            <div className="">Conversation sidebar</div>
          </Allotment.Pane>
          <Allotment.Pane>{children}</Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};
export default ProjectIdLayout