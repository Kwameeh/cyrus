"use client";

import { useTransitionRouter } from "next-view-transitions";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isHome = pathname === "/";

  const router = useTransitionRouter();

  function slideInOut() {
    document.documentElement.animate(
      [
        {
          opacity: 1,
          transform: "translateY(0)",
        },
        {
          opacity: 0.2,
          transform: "translateY(-35%)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      }
    );

    document.documentElement.animate(
      [
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }

  return (
    <nav className="">
      <div className="logo" style={{ flex: "none" }}>
        {isHome ? (
          <a
            href="/"
            className="!P-2 text-sm sm:text-base opacity-90 hover:opacity-100 transition-opacity">
            <span className="">Cyrus Image</span>
          </a>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              router.push("/", {
                onTransitionReady: slideInOut,
              });
            }}
            className="!P-2 text-sm sm:text-base opacity-90 hover:opacity-100 transition-opacity">
            <span className="">← Back</span>
          </button>
        )}
      </div>

      <div className="links" style={{ flex: "none" }}>
        <a
          className="text-sm sm:text-base border border-white/20 !px-2  rounded-full"
          href="/contact">
          <span className="leading-none tracking-wide">Contact</span>
        </a>
      </div>
    </nav>
  );
}
