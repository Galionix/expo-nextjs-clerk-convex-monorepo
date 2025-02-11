"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from '@/cache';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL);

export default function ConvexClientProvider({ children }) {
  return (
    <ClerkProvider
    tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
