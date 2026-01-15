import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
export const useProjects = ()=>useQuery(api.queries.projects.get)

export const useProjectsPratial = (limit: number) => useQuery(api.queries.projects.getPartial, { limit })
export const useCreateProject = () => useMutation(api.mutations.projects.create)