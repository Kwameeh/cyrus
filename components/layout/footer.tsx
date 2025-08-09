import {
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
  const socials = [
    {
      name: "GitHub",
      href: "https://github.com/codegrid",
    },
    {
      name: "Twitter",
      href: "https://twitter.com/codegrid",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/codegrid",
    },
    {
      name: "Facebook",
      href: "https://facebook.com/codegrid",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/codegrid",
    },
  ];
  const iconByName: Record<string, JSX.Element> = {
    GitHub: <FaGithub />,
    Twitter: <FaTwitter />,
    Instagram: <FaInstagram />,
    Facebook: <FaFacebook />,
    LinkedIn: <FaLinkedin />,
  };
  return (
    <footer className="select-none text-white" role="contentinfo">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] opacity-80 hover:opacity-100 transition-opacity">
            <span className="sm:hidden">Cyrus</span>
            <span className="hidden sm:inline"> Image</span>
          </span>
          <span className="hidden sm:inline-block h-3 w-px bg-white/30" />
          <a
            href="#"
            className="relative text-[11px] sm:text-xs opacity-80 hover:opacity-100 transition-all after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-gradient-to-r after:from-white/80 after:to-white/40 after:transition-[width] after:duration-300 hover:after:w-full">
            <span className="sm:hidden">CI</span>
            <span className="hidden sm:inline">The perfect frame</span>
          </a>
        </div>

        <div className="socials flex items-center gap-2 sm:gap-3">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              aria-label={social.name}
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 !px-3 py-1 text-[11px] sm:text-xs backdrop-blur-[2px] transition-all hover:border-white/50 hover:bg-white/5 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.18)]">
              <span className="size-1.5 rounded-full bg-gradient-to-r from-white/80 to-white/40 transition-all group-hover:from-white group-hover:to-white/70" />
              <span className="relative hidden sm:inline">{social.name}</span>
              <span
                className="relative sm:hidden inline-flex items-center text-base !p-2"
                aria-hidden>
                {iconByName[social.name]}
              </span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
