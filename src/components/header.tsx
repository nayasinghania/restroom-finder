import Link from "next/link";
import { Search, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between mb-8 mx-4">
      <div className="flex items-center mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold mr-2 whitespace-nowrap">
          RestroomFinder
        </h1>
        <MapPin className="h-5 w-5 text-teal-500" />
      </div>
      <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search restrooms..."
            className="pl-8 w-full sm:w-auto"
          />
        </div>
        <Link href="/add-restroom" className="w-full sm:w-auto">
          <Button className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto flex items-center justify-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Restroom
          </Button>
        </Link>
        <div className="flex justify-center sm:justify-start">
          <SignedOut>
            <SignInButton>
              <Button className="w-full sm:w-auto">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
