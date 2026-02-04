import { useMutation,useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useConversation = (id: Id<'conversations'>|null)=>{
    return useQuery(api.queries.conversations.getById, id ? { id } : 'skip')
}

export const useMessages = (conversationId: Id<'conversations'>|null)=>{
    return useQuery(api.queries.conversations.getMessages, conversationId ? { conversationId } : 'skip')
}

export const useConversations = (projectId: Id<'projects'>)=>{
    return useQuery(api.queries.conversations.getByProject, { projectId })
}

export const useCreateConversation = ()=>{
    return useMutation(api.mutations.conversations.create)
}

