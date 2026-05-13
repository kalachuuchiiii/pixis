import { Button } from "@/components/ui/button";
import { DynamicBackground } from "@/components/ui/DynamicBackground";
import { Pixis, PixisAvatar } from "@/components/ui/PixisAvatar";
import { Dot } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { privacyPolicy } from "@/features/auth/data/auth";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

const Footer = () => (
  <footer className="border-t border-zinc-200 dark:border-zinc-800 lg:px-6  py-10 text-sm text-zinc-500 dark:text-zinc-400">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2">
          <PixisAvatar />
          <Pixis />
        </div>
        <Dot />
        <span className=" text-xs"> Free AI flashcards</span>
      </div>

      <div className="flex lg:gap-6 gap-2  lg:text-base text-xs flex-wrap">
        {["Features"].map((link) => (
          <a
            key={link}
            href={`/#${link.toLowerCase()}`}
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {link}
          </a>
        ))}
        <a href="/documentation" target="_blank">
          Documentation
        </a>
        <a href="/study" target="_blank">
          Study guides
        </a>
        <Dialog>
          <DialogTrigger>
            <button className="cursor-pointer">Privacy</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Privacy Policy</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {privacyPolicy}
            </p>
          </DialogContent>
        </Dialog>
        <a href="https://github.com/kalachuuchiiii/pixis" target="_blank">
          GitHub
        </a>
      </div>
    </div>
  </footer>
);

export const GuestLayout = () => {
  return (
    <main className="w-full flex flex-col justify-between min-h-screen h-full">
      <DynamicBackground />
      <nav className="sticky  top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 h-16 px-6 md:px-8 flex items-center justify-between">
        <div className="flex tracking-widest items-center gap-3">
          <PixisAvatar /> <Pixis />
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-600 dark:text-zinc-400">
          {["Features", "Modes"].map((item) => (
            <a
              key={item}
              href={`/#${item.toLowerCase()}`}
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}

          <a
            href={`/documentation`}
            target="_blank"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Documentation
          </a>
          <a
            href={`/study`}
            target="_blank"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Study guides
          </a>
        </div>

        <Link to="/sign-up">
          <Button className="my-btn">Get started free</Button>
        </Link>
      </nav>
      <Outlet />
      <Footer />
    </main>
  );
};
