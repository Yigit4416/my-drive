import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { NavBar } from "./navbar";
import AddButton from "./addbutton";

export default function TopNav() {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b p-4 text-xl font-semibold">
      <div className="flex flex-row items-center gap-4">
        <Link href={"/"}>S3 Drive</Link>
        <SignedIn>
          <NavBar />
        </SignedIn>
      </div>
      <div className="flex flex-row items-center gap-4">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
      </div>
    </div>
  );
}
