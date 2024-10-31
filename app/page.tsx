import Image from "next/image";
import logo from "../images/lg.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StoryWriter from "@/components/StoryWriter";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col s">
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-purple-500 flex flex-col space-y-5 justify-center items-center order-1 lg:order-1 pb-10 space-x-3 rounded-md">
          <Image src={logo} height={250} alt="logo" />
          <Button asChild className="px-20 bg-purple-700 p-10 text-xl">
            <Link href="/stories">Explore Stories Library</Link>
          </Button>
        </div>

        <StoryWriter/>
      </section>
    </main>
  );
}
