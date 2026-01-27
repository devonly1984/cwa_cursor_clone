import { useFile, useUpdateFile } from "@/hooks/useFiles";
import { Id } from "../../../../convex/_generated/dataModel"
import { useEditor } from "../hooks/useEditor"

import Image from "next/image";
import {CodeEditor,TopNavigation,FileBreadCrumbs} from "../layout/";
import {  useRef } from "react";

const EditorView = ({projectId}:{projectId:Id<'projects'>}) => {
  const { activeTabId } = useEditor(projectId);
  const activeFile = useFile(activeTabId);
  const updateFile = useUpdateFile();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveFileBinary = activeFile && activeFile.storageId;
  const isActiveFileText = activeFile && !activeFile.storageId;
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center">
        <TopNavigation projectId={projectId} />
      </div>
      {activeTabId && <FileBreadCrumbs projectId={projectId} />}
      <div className="flex-1 min-h-0 bg-background">
        {!activeFile && (
          <div className="size-full flex items-center justify-center">
            <Image
              src="/images/logo-alt.svg"
              alt="Cursor"
              width={50}
              height={50}
              className="opacity-25"
            />
          </div>
        )}
        {isActiveFileText && (
          <CodeEditor
            key={activeFile._id}
            fileName={activeFile.name}
            initialValue={activeFile.content}
            onChange={(content: string) => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              timeoutRef.current = setTimeout(() => {
                updateFile({ id: activeFile._id, content });
              }, 1500);
            }}
          />
        )}
        {isActiveFileBinary && <p>TODO: implment Binary Preview</p>}
      </div>
    </div>
  );
}
export default EditorView