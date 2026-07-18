import { FaDiscord, FaSteam } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content items-center p-10 px-20 pb-20">
      <aside className="grid-flow-col items-center">
        <p className="font-black">{new Date().getFullYear()} TUG.GG</p>
      </aside>
      
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        {/* Discord Link */}
        <a
          href="https://discord.gg/jAavRHsnH"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#5865F2] transition-colors"
          aria-label="Join us on Discord"
        >
          <FaDiscord className="w-6 h-6" />
        </a>
        
        {/* Steam Link */}
        <a
          href="https://store.steampowered.com/app/222880/Insurgency/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#4b95e9] transition-colors"
          aria-label="Get the game on Steam"
        >
          <FaSteam className="w-6 h-6" />
        </a>
      </nav>
    </footer>
  );
}