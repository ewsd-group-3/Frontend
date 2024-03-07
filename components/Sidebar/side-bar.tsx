import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronFirst, LogOut, Menu, User } from "lucide-react";
import { MenuLinks } from "@/constants/links";
import PlaceHolderImg from "@/public/placeholder-img.png";
import Image from "next/image";
import MenuLink from "./menu-link";
import MobileMenu from "./mobile-menu";

function getLocalIsSidebarOpen() {
  return localStorage.getItem("isSidebarOpen") === "true" ? true : false;
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [mount, setMount] = useState(false);
  const pathName = usePathname();
  const [open, setOpen] = useState(
    typeof window !== "undefined" ? getLocalIsSidebarOpen : null
  );

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <>
      {mount && (
        <>
          <MobileMenu pathName={pathName} />
          <div className='flex'>
            <div
              className={`${
                open ? `w-72` : `w-20`
              } bg-primary h-screen p-5 pt-7 duration-300 fixed flex-col justify-between hidden md:flex`}
            >
              <div
                className={`absolute cursor-pointer -right-3 top-9 w-6 h-6 grid place-items-center ring-2 ring-background bg-accent rounded-full  ${
                  !open && "rotate-180"
                }`}
                onClick={() => {
                  localStorage.setItem("isSidebarOpen", `${!open}`);
                  setOpen(getLocalIsSidebarOpen);
                }}
              >
                <ChevronFirst size={18} color='white' />
              </div>

              <div>
                <div className='flex gap-x-4 items-center'>
                  <Image
                    src={PlaceHolderImg}
                    className={`rounded-full ${!open && ""}`}
                    width={40}
                    height={40}
                    alt='logo'
                  />
                  <h1
                    className={`text-white origin-left font-medium text-md duration-300 whitespace-nowrap ${
                      !open && "hidden"
                    }`}
                  >
                    Wyne School Portal
                  </h1>
                </div>
                <ul className='pt-6'>
                  {MenuLinks.map((Menu) => (
                    <MenuLink
                      icon={{
                        src: Menu.src,
                      }}
                      path={Menu.path}
                      title={Menu.title}
                      gap={Menu.gap}
                      key={Menu.path}
                      pathName={pathName}
                      open={open}
                    />
                  ))}
                </ul>
              </div>
              <div>
                <hr className='mt-9 mb-6' />
                <MenuLink
                  icon={{
                    src: User,
                    img: PlaceHolderImg.src,
                  }}
                  path={"/profile"}
                  pathName={pathName}
                  title={"User Name"}
                  open={open}
                />
                <MenuLink
                  icon={{
                    src: LogOut,
                  }}
                  pathName={pathName}
                  title={"Logout"}
                  open={open}
                />
              </div>
            </div>

            <main
              className={`flex-1 p-5 pt-3 duration-300 mt-16 md:mt-0 ${
                open ? `md:ml-72` : `md:ml-20`
              }`}
            >
              {children}
            </main>
          </div>
        </>
      )}
    </>
  );
}
