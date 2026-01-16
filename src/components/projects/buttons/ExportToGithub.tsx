import { FaGithub } from "react-icons/fa"

const ExportToGithub = () => {
  return (
    <div className="flex-1 flex justify-end h-full">
      <div className="flex items-center gap-1.5 h-full px-3 cursor-pointer text-muted-foreground border- hover:bg-accent/30">
        <FaGithub className="size-3.5" />
        <span className="text-sm">Export</span>
      </div>
    </div>
  );
}
export default ExportToGithub
