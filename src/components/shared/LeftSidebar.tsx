"use client";

import { sidebarLinks } from "@/constants/index";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, SignOutButton, useAuth } from "@clerk/nextjs";

type LinkType = {
  label: string;
  imgURL: string;
  route: string;
};

function LeftSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userId } = useAuth();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex flex-1 flex-col gap-6 px-6 w-full">
        {sidebarLinks.map((link: LinkType) => {
          const isActive = pathname === link.route;

          if (link.route === "/profile") link.route = `/profile/${userId}`;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src="/assets/logout.svg"
                alt="logout"
                height="28"
                width="28"
              />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
}

export default LeftSidebar;
