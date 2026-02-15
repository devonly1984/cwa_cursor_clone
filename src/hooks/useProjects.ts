import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const useProject = (projectId: Id<"projects">) => {
  return useQuery(api.public.queries.projects.getById, { id: projectId });
};
export const useProjects = () => {
  return useQuery(api.public.queries.projects.get);
};

export const useProjectsPartial = (limit: number) => {
  return useQuery(api.public.queries.projects.getPartial, { limit });
};
export const useCreateProject = () => {
  return useMutation(api.public.mutations.projects.create).withOptimisticUpdate(
    (localStore, args) => {
      const existingProjects = localStore.getQuery(
        api.public.queries.projects.get
      );
      if (existingProjects !== undefined) {
        const now = Date.now();
        const newProject = {
          _id: crypto.randomUUID() as Id<"projects">,
          _creationTime: now,
          name: args.name,
          ownerId: "anonymouse",
          updatedAt: now,
        };
        localStore.setQuery(api.public.queries.projects.get, {}, [
          newProject,
          ...existingProjects,
        ]);
      }
    }
  );
};
export const useRenameProject = (projectId: Id<"projects">) => {
  return useMutation(api.public.mutations.projects.rename).withOptimisticUpdate(
    (localStore, args) => {
      const existingProject = localStore.getQuery(
        api.public.queries.projects.getById,
        { id: args.id }
      );

      if (existingProject !== undefined && existingProject !== null) {
        localStore.setQuery(
          api.public.queries.projects.getById,
          { id: args.id },
          {
            ...existingProject,
            name: args.name,
            updatedAt: Date.now(),
          }
        );
      }
      const existingProjects= localStore.getQuery(api.public.queries.projects.get)
      if (existingProjects!==null) {
        localStore.setQuery(
          api.public.queries.projects.get,{

          },
          existingProjects?.map(project=>{
            return project._id === args.id ? { ...project, name: args.name, updatedAt: Date.now() } : project
          })
        )
      }
    }
  );
};

export const useUpdateProjectSettings = () => useMutation(api.public.mutations.projects.updateSettings);
