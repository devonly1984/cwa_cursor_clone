import { clsx, type ClassValue } from "clsx"
import { formatDistanceToNow } from "date-fns"
import { twMerge } from "tailwind-merge"

export const  cn=(...inputs: ClassValue[]) =>{
  return twMerge(clsx(inputs))
}
export const formatTimestamp = (timestamp: number) => formatDistanceToNow(new Date(timestamp,), { addSuffix: true })