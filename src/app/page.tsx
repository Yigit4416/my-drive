import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { SignedOut, SignedIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main className="bg-gradient-to- flex min-h-screen flex-col items-center justify-center text-white">
      <Suspense fallback={<div>Please wait...</div>}>
        <SignedOut>
          <div className="text-center">pls sign in or create a new account</div>
        </SignedOut>
        <SignedIn>
          <div>
            <Card>
              <Button>
                <Link href={"/root"}>Go to Root File</Link>
              </Button>
            </Card>
          </div>
        </SignedIn>
      </Suspense>
    </main>
  );
}
