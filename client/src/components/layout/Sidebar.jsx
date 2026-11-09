import { useState } from "react";
import {
  FiArchive,
  FiHome,
  FiLogOut,
  FiMenu,
  FiPlus,
  FiSettings,
  FiX,
} from "react-icons/fi";
import sidebarBackground from "../../assets/images/sidebar-bg.png";
import vellumLogo from "../../assets/images/vellum-logo.png";

const navigationItems = [
  { label: "My Notes", icon: FiHome, href: "#notes", active: true },
  { label: "Create Note", icon: FiPlus, href: "#create-note" },
  { label: "Archived", icon: FiArchive, href: "#archived" },
  { label: "Settings", icon: FiSettings, href: "#settings", separated: true },
];

function Sidebar({ activeItem = "My Notes", onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function navigate(label) {
    onNavigate?.(label);
    setIsMenuOpen(false);
  }

  return (
    <aside
      className="flex min-h-0 w-full shrink-0 flex-col bg-cover bg-center px-4 py-5 text-[#E9E8E8] md:min-h-screen md:w-56 md:px-4 md:py-7"
      style={{ backgroundImage: `url(${sidebarBackground})` }}
    >
      <div className="mb-5 flex items-center justify-between md:mb-10">
        <a
          href="#notes"
          className="flex shrink-0 items-center px-2"
          aria-label="Private Notes home"
        >
          <img
            src={vellumLogo}
            alt="Vellum"
            className="h-10 w-auto max-w-full object-contain object-left"
          />
        </a>
        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="sidebar-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-lg p-2 transition-colors hover:bg-[#8E3435]/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9E8E8] md:hidden"
        >
          {isMenuOpen ? (
            <FiX aria-hidden="true" className="h-6 w-6" />
          ) : (
            <FiMenu aria-hidden="true" className="h-6 w-6" />
          )}
        </button>
      </div>

      <nav
        id="sidebar-navigation"
        aria-label="Main navigation"
        className={`${isMenuOpen ? "block" : "hidden"} md:block`}
      >
        <ul className="flex flex-col gap-1">
          {navigationItems.map(({ label, icon: Icon, href, separated }) => {
            const active = label === activeItem;
            const canNavigate =
              label === "My Notes" ||
              label === "Create Note" ||
              label === "Archived";

            return (
            <li
              key={label}
              className={`shrink-0 md:w-full ${separated ? "md:mt-4 md:border-t md:border-[#E9E8E8]/15 md:pt-4" : ""}`}
            >
              <a
                href={canNavigate ? undefined : href}
                onClick={canNavigate ? (event) => {
                  event.preventDefault();
                  navigate(label);
                } : undefined}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                  active
                    ? "bg-[#8E3435]/70"
                    : "hover:bg-[#8E3435]/45 focus-visible:bg-[#8E3435]/45"
                }`}
              >
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                <span className="whitespace-nowrap">{label}</span>
              </a>
            </li>
            );
          })}
        </ul>
      </nav>

      <button
        type="button"
        onClick={() => navigate("Log Out")}
        className={`${isMenuOpen ? "flex" : "hidden"} mt-4 shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-colors hover:bg-[#8E3435]/45 focus-visible:bg-[#8E3435]/45 md:mt-2 md:flex`}
      >
        <FiLogOut aria-hidden="true" className="h-5 w-5 shrink-0" />
        <span className="whitespace-nowrap">Log Out</span>
      </button>
    </aside>
  );
}

export default Sidebar;