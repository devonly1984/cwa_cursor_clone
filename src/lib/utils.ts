import { clsx, type ClassValue } from "clsx"
import { formatDistanceToNow } from "date-fns"
import { twMerge } from "tailwind-merge"
import { BASE_PADDING, LEVEL_PADDING } from "./constants"

export const  cn=(...inputs: ClassValue[]) =>{
  return twMerge(clsx(inputs))
}
export const formatTimestamp = (timestamp: number) => formatDistanceToNow(new Date(timestamp,), { addSuffix: true })
export const getItemPadding  =(level:number,isFile:boolean)=>{
  const fileOffset = isFile ? 16: 0;
  return BASE_PADDING + level * LEVEL_PADDING + fileOffset

}