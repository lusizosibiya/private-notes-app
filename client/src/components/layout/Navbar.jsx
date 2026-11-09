import { useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { getActiveUserName } from "../../utils/userProfile";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function Navbar({ searchQuery, onSearchChange, onSearch }) {
  const [userName] = useState(getActiveUserName);
  const searchInputRef = useRef(null);
  const initial = userName.trim().charAt(0).toUpperCase() || "?";

  return (
    <header className="flex w-full flex-col gap-5 border-b border-[#280A08]/10 bg-[#D5D1D1] px-5 py-5 text-[#280A08] sm:px-8 md:flex-row md:items-center md:justify-between md:px-10">
      <div>
        <h1 className="font-serif text-2xl font-semibold sm:text-3xl">
          {getGreeting()}
          {userName && (
            <>
              , <span className="text-[#652423]">{userName}</span>
            </>
          )}
        </h1>
        <p className="mt-1 text-sm text-[#280A08]/75 sm:text-base">
          Capture, organise and keep your thoughts private.
        </p>
      </div>

      <div className="flex items-center gap-4 self-end md:self-auto">
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(searchQuery);
          }}
          className="flex h-11 w-full min-w-0 items-center gap-3 rounded-full border border-[#280A08]/15 bg-[#E4E1E1] px-4 focus-within:border-[#652423] focus-within:ring-2 focus-within:ring-[#652423]/15 sm:w-64 md:w-72"
        >
          <button
            type="submit"
            aria-label="Search notes"
            className="shrink-0 rounded-full text-[#280A08]/75 hover:text-[#652423] focus-visible:outline-2 focus-visible:outline-[#652423]"
          >
            <FiSearch aria-hidden="true" className="h-5 w-5" />
          </button>
          <input
            ref={searchInputRef}
            type="text"
            aria-label="Search your notes"
            placeholder="Search your notes..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-[#280A08] outline-none placeholder:text-[#280A08]/55"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                onSearchChange("");
                onSearch("");
                searchInputRef.current?.focus();
              }}
              className="shrink-0 rounded-full text-[#280A08]/60 hover:text-[#652423]"
            >
              <FiX aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </form>
        <div
          aria-label={userName ? `Signed-in user: ${userName}` : "User profile"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#652423] font-serif text-lg text-[#E9E8E8]"
        >
          {initial}
        </div>
      </div>
    </header>
  );
}

export default Navbar;