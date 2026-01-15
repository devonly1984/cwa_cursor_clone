import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
export const useProjects = ()=>useQuery(api.queries.projects.get)

export const useProjectsPratial = (limit: number) => useQuery(api.queries.projects.getPartial, { limit })
export const useCreateProject = () => {
    
    return useMutation(api.mutations.projects.create).withOptimisticUpdate(
    (localStore,args)=>{
        const existingProjects = localStore.getQuery(api.queries.projects.get);
        if (existingProjects!==undefined) {
            const now = Date.now();
            const newProject = {
                _id: crypto.randomUUID() as Id<'projects'>,
                _creationTime: now,
                name: args.name,
                ownerId: "anonymouse",
                updatedAt: now
            }
            localStore.setQuery(api.queries.projects.get,{},[
                newProject,
                ...existingProjects
            ])
        }
    }
)}