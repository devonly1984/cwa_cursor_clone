import { Spinner } from "@/components/ui/spinner"
const AuthLoadingView = () => {
  return (
    <div className="flex items-center justify-center bg-background h-screen">
      <Spinner className="size-6 text-ring" />
    </div>
  );
}
export default AuthLoadingView