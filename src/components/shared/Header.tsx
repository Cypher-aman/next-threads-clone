import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignOutButton, OrganizationSwitcher } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

function Header() {
  return (
    <nav className="topbar">
      <Link className="flex items-center gap-4" href="/">
        <Image src="/assets/logo.svg" alt="logo" height="30" width="30" />
        <h1 className="text-heading3-bold text-light-1 max-xs:hidden">
          Threads
        </h1>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  height="28"
                  width="28"
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              OrganisationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  );
}

export default Header;
