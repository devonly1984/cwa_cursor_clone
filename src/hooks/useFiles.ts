import { useMutation, useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

export const useCreateFile = () => {
  return useMutation(api.mutations.files.createFile);
};

export const useCreateFolder = () => {
  return useMutation(api.mutations.files.createFolder);
};
export const useFolderContents = ({
  projectId,
  parentId,
  enabled = true,
}: {
  projectId: Id<"projects">;
  parentId?: Id<"files">;
  enabled?: boolean;
}) => {
  return useQuery(
    api.queries.files.getFolderContents,
    enabled ? { projectId, parentId } : "skip",
  );
};
export const useRenameFile = ()=>{
    return useMutation(api.mutations.files.renameFile)
}
export const useDeleteFile = ()=>{
    return useMutation(api.mutations.files.deleteFile)
}
export const useFile = (fileId:Id<'files'>|null)=>(
  useQuery(api.queries.files.getFile, fileId ? { id: fileId } : 'skip')
)
export const useFilePath = (fileId:Id<'files'>|null)=>(
  useQuery(api.queries.files.getFilePath, fileId ? { id: fileId } : 'skip')
)
export const useUpdateFile = ()=>{
  return useMutation(api.mutations.files.updateFile)
  //Optimistic update
}