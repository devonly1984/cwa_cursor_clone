import { requestSchema, responseSchema, SuggestionRequest, SuggestionResponse } from '@/lib/suggestion/schemas';
import ky from 'ky';
import { toast } from 'sonner'
export const fetcher = async(
    payload: SuggestionRequest,
    signal: AbortSignal
):Promise<string|null>=>{
    try {
        const validatePayload = requestSchema.parse(payload);
        const response = await ky.post('/api/suggestion',{
            json: validatePayload,
            signal,
            timeout: 10_000,
            retry: 0
        }).json<SuggestionResponse>();
        const validatedResponse = responseSchema.parse(response)
        return validatedResponse.suggestion || null;

    } catch (error) {
        if (error instanceof Error && error.name ==='AbortError') {
            return null;
        }
        toast.error("Failed to fetch AI completion")
        return null;
    }
}