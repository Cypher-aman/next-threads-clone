"use client";

import { sidebarLinks } from "@/constants/index";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

type LinkType = {
  label: string;
  imgURL: string;
  route: string;
};

function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link: LinkType) => {
          const isActive = pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 text-subtle-medium max-sm:hidden">
                {link.label.split(" ")[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Footer;
