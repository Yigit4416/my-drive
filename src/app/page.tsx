import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { SignedOut, SignedIn, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white px-8 py-12 shadow-md">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          S3 Drive
        </h1>

        <Suspense
          fallback={
            <div className="flex justify-center">
              <div className="animate-pulse text-lg text-gray-600">
                Loading...
              </div>
            </div>
          }
        >
          <SignedOut>
            <div className="mb-8 text-center">
              <p className="mb-2 text-lg text-gray-700">Welcome to S3 Drive</p>
              <p className="mb-6 text-sm text-gray-500">
                Please sign in or create a new account to continue
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <SignInButton>
                  <Button className="w-full bg-blue-600 py-5 text-base transition-all hover:bg-blue-700">
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton>
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 py-5 text-base text-blue-600 transition-all hover:bg-blue-50"
                  >
                    Create Account
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex flex-col items-center">
              <Card className="w-full border border-gray-200 bg-white p-8">
                <p className="mb-6 text-center text-gray-700">
                  Welcome to your personal drive
                </p>
                <Button className="w-full bg-blue-600 py-5 text-base transition-all hover:bg-blue-700">
                  <Link
                    href={"/folder/root"}
                    className="flex w-full items-center justify-center"
                  >
                    Go to My Files
                  </Link>
                </Button>
              </Card>
            </div>
          </SignedIn>
        </Suspense>

        <p className="mt-8 text-center text-xs text-gray-400">
          Secure cloud storage for all your important files
        </p>
      </div>
    </main>
  );
}
