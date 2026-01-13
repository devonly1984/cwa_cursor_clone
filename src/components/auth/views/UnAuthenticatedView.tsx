import { ShieldAlert } from "lucide-react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
const UnAuthenticatedView = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="w-full max-w-lg bg-muted">
        <Item variant={"outline"}>
          <ItemMedia variant={"icon"}>
            <ShieldAlert />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Unauthorized Access</ItemTitle>
            <ItemDescription>
              You are not authorized to access this resource.
            </ItemDescription>
            <ItemActions>
              <SignInButton>
                <Button variant={"outline"} size="sm">
                  Sign In
                </Button>
              </SignInButton>
            </ItemActions>
          </ItemContent>
        </Item>
      </div>
    </div>
  );
}
export default UnAuthenticatedView