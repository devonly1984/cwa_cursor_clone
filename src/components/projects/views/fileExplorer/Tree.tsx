"use client";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { ChevronRight } from "lucide-react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { cn } from "@/lib/utils";
import {
  useCreateFile,
  useCreateFolder,
  useFolderContents,
  useRenameFile,
  useDeleteFile,
  
} from "@/hooks/useFiles";
import { getItemPadding } from "@/lib/utils";
import  LoadingRow  from "@/components/projects/views/fileExplorer/LoadingRow";
import  CreateInput  from "@/components/projects/views/fileExplorer/CreateInput";
import { useState } from "react";

import TreeItemWrapper from "./TreeItemWrapper";
import RenameInput from "./RenameInput";

interface TreeProps {
  item: Doc<"files">;
  level?: number;
  projectId: Id<"projects">;
}
const Tree = ({ item, level = 0, projectId }: TreeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [creating, setCreating] = useState<"file" | "folder" | null>(null);
  const renamefile = useRenameFile();
  const deleteFile = useDeleteFile();
  const createFile = useCreateFile();
  const createFolder = useCreateFolder();
  const folderContents = useFolderContents({
    projectId,
    parentId: item._id,
    enabled: item.type === "folder" && isOpen,
  });
  const handleRename = (newName:string)=>{
    setIsRenaming(false);
    if (newName===item.name) {
      return;
    }
    renamefile({ id: item._id, newName });
  }
  const handleCreate = (name:string)=>{
    setCreating(null);
    if (creating==='file') {
      createFile({
        projectId,
        name,
        content: "",
        parentId: item._id,
      });
    } else {
      createFolder({
        projectId,
        name,
        parentId: item._id,
      });
    }
  }
  const startCreating = (type:'file'|'folder')=>{
    setIsOpen(true);
    setCreating(type);
  };
  if (item.type === "file") {
    const fileName = item.name;
    if (isRenaming) {
      return (
        <RenameInput
          type="file"
          defaultValue={fileName}
          level={level}
          onSubmit={handleRename}
          onCancel={() => setIsRenaming(false)}
        />
      );
    }
    return (
      <TreeItemWrapper
        item={item}
        level={level}
        onClick={() => {}}
      
        onRename={() => setIsRenaming(true)}
        onDelete={() => {
          //close tab
          deleteFile({ id: item._id });
        }}
      >
        <FileIcon fileName={fileName} autoAssign className="size-4" />I
        <span className="truncate text-sm">{fileName}</span>
      </TreeItemWrapper>
    );
  }
  const folderName = item.name;
  const folderRender = (
    <>
      <div className="flex items-center gap-0.5">
        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-muted-foreground",
            isOpen && "rotate-90",
          )}
        />
        <FolderIcon folderName={folderName} className="size-4" />
      </div>
      <span className="truncate text-sm">{folderName}</span>
    </>
  );
  if (creating) {
    return (
      <>
        <button
          onClick={() => setIsOpen((value) => !value)}
          className="group flex items-center gap-1 h-5.5 hover:bg-accent/30  w-full"
          style={{ paddingLeft: getItemPadding(level, false) }}
        >
          {folderRender}
        </button>
        {isOpen && (
          <>
            {folderContents === undefined && (
              <LoadingRow level={level + 1} />
            )}
            <CreateInput
              type={creating}
              level={level + 1}
              onSubmit={handleCreate}
              onCancel={() => setCreating(null)}
            />
            {folderContents?.map((subItem) => (
              <Tree
                key={subItem._id}
                item={subItem}
                level={level + 1}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </>
    );
  }
  if (isRenaming) {
    return (
      <>
        <RenameInput
          type="folder"
          defaultValue={folderName}
          isOpen={isOpen}
          level={level}
          onSubmit={handleRename}
          onCancel={() => setIsRenaming(false)}
        />
        {isOpen && (
          <>
            {folderContents === undefined && (
              <LoadingRow level={level + 1} />
            )}
            <CreateInput
              type={creating}
              level={level + 1}
              onSubmit={handleCreate}
              onCancel={() => setCreating(null)}
            />
            {folderContents?.map((subItem) => (
              <Tree
                key={subItem._id}
                item={subItem}
                level={level + 1}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </>
    );
  }
  return (
    <>
      <TreeItemWrapper
        item={item}
        level={level}
        onClick={() => setIsOpen((value) => !value)}
        onDoubleClick={() => {}}
        onRename={() => setIsRenaming(true)}
        onDelete={() => {
          //Close tab
          deleteFile({ id: item._id });
        }}
        onCreateFile={() => startCreating("file")}
        onCreateFolder={() => startCreating("folder")}
      >
        {folderRender}
      </TreeItemWrapper>
      {isOpen && (
        <>
          {folderContents === undefined && (
            <LoadingRow level={level + 1} />
          )}
          {folderContents?.map((subItem) => (
            <Tree
              key={subItem._id}
              item={subItem}
              level={level + 1}
              projectId={projectId}
            />
          ))}
        </>
      )}
    </>
  );
};
export default Tree;
