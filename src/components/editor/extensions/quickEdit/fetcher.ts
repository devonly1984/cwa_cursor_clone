import { EditRequest, editRequestSchema, EditResponse, editResponseSchema } from '@/lib/suggestion/quickEdit';

import ky from 'ky';
import { toast } from 'sonner'
export const fetcher = async(
    payload: EditRequest,
    signal: AbortSignal
):Promise<string|null>=>{
    try {
        const validatePayload = editRequestSchema.parse(payload);
        const response = await ky.post('/api/quick-edit',{
            json: validatePayload,
            signal,
            timeout: 10_000,
            retry: 0
        }).json<EditResponse>();
        const validatedResponse = editResponseSchema.parse(response)
        return validatedResponse.editedCode || null;

    } catch (error) {
        if (error instanceof Error && error.name ==='AbortError') {
            return null;
        }
        toast.error("Failed to fetch AI quick edit")
        return null;
    }
}