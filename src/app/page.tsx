import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex flex-col gap-4 items-center">
        <Link href={"/auth/signup"}>
          <Button className="w-40 p-4">Sign Up</Button>
        </Link>
        <Link href={"/auth/signin"}>
          <Button className="w-40 p-4">Sign In</Button>
        </Link>
      </div>
    </div>
  );
}
