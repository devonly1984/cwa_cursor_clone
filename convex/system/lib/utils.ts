export const validateInternalKey = (key:string) =>{
    const internalKey = process.env.CONVEX_INTERNAL_KEY;
    if (!internalKey) {
        throw new Error("CONVEX_INTERNAL_KEY is not configured")
    }
    if (key !==internalKey) {
        throw new Error("Invalid internal Key")
    }
}