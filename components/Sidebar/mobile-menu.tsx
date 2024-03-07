import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { MenuLinks } from "@/constants/links";
import BrandTitle from "./brand-title";

export default function MobileMenu({ pathName }: { pathName: string }) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  return (
    <div>
      {isHamburgerOpen && (
        <div className='h-screen w-full bg-primary'>
          <div className='flex justify-between h-16 p-5'>
            <BrandTitle />
            <div
              className='cursor-pointer grid place-items-center'
              onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
            >
              <X size={30} color='white' />B
            </div>
          </div>
          <div className='px-5 flex flex-col gap-y-4 pt-5'>
            {MenuLinks.map((Menu) => (
              <Link
                href={Menu.path}
                key={Menu.path}
                className={`flex items-center gap-4 p-4 rounded ${
                  pathName === Menu.path ? "bg-white " : "bg-primary"
                }`}
              >
                <Menu.src
                  size={22}
                  color={pathName === Menu.path ? "black" : "white"}
                />
                <div
                  className={`${
                    pathName === Menu.path ? "text-black" : "text-white"
                  }`}
                >
                  {Menu.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className='flex md:hidden w-full h-16 bg-primary fixed'>
        <div className='flex items-center w-full justify-between p-5 bg-primary'>
          <BrandTitle />
          <div
            className='cursor-pointer grid place-items-center'
            onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
          >
            <Menu size={30} color='white' />
          </div>
        </div>
      </div>
    </div>
  );
}
