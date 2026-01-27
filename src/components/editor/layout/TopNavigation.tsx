import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Id } from "../../../../convex/_generated/dataModel"
import { useEditor } from "../hooks/useEditor";
import EditorTab from "./EditorTab";

const TopNavigation = ({ projectId }: { projectId: Id<"projects"> }) => {
    const { openTabs } = useEditor(projectId);

  return (
    <ScrollArea className="flex-1">
      <nav className="bg-sidebar flex items-center h-8.75 border-bottom">
        {openTabs.map((fileId, index) => (
          <EditorTab
            key={fileId}
            fileId={fileId}
            isFirst={index === 0}
            projectId={projectId}
          />
        ))}
      </nav>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
export default TopNavigation