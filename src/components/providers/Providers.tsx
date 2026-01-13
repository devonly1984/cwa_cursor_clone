"use client";
import { ClerkProvider, useAuth, UserButton } from "@clerk/nextjs";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode } from "react";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import { ThemeProvider } from "./ThemeProvider";
import { dark } from "@clerk/themes";
import {
  UnAuthenticatedView,
  AuthLoadingView,
} from "@/components/auth/views";
if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error(
    "Missing environment variable process.env.NEXT_PUBLIC_CONVEX_URL. please ensure it exists and retry"
  );
}
const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL
);
export const Providers = ({children}:{children:ReactNode})=> {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Authenticated>
            <UserButton />
            {children}
          </Authenticated>
          <Unauthenticated>
            <UnAuthenticatedView />
          </Unauthenticated>
          <AuthLoading>
            <AuthLoadingView />
          </AuthLoading>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}