import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  type Files,
  mockFiles,
  Folders,
  folders,
} from "./_components/mockdata";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const folder: Folders = folders;
  const files: Files = mockFiles;
  return (
    <main className="bg-gradient-to- flex min-h-screen flex-col items-center justify-center text-white">
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
    </main>
  );
}
