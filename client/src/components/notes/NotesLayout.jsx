import { useState } from "react";
import { FiGrid, FiList, FiPlus } from "react-icons/fi";
import NoteCard from "./NoteCard";

function NotesLayout({
  notes,
  onOpenNote,
  onCreateNote,
  onArchiveNote,
  onDeleteNote,
  heading = "My Notes",
  isArchived = false,
  searchQuery = "",
}) {
  const [view, setView] = useState("grid");

  return (
    <section
      aria-labelledby="notes-heading"
      className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <h2
          id="notes-heading"
          className="font-serif text-2xl font-semibold text-[#280A08] sm:text-3xl"
        >
          {heading}
        </h2>

        <div className="flex items-center gap-3">
          <div
            role="group"
            aria-label="Note layout"
            className="flex rounded-xl border border-[#280A08]/10 bg-[#E4E1E1] p-1"
          >
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className={`rounded-lg p-2 transition-colors ${
                view === "grid"
                  ? "bg-[#8E3435] text-[#E9E8E8]"
                  : "text-[#280A08]/75 hover:bg-[#280A08]/5"
              }`}
            >
              <FiGrid aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className={`rounded-lg p-2 transition-colors ${
                view === "list"
                  ? "bg-[#8E3435] text-[#E9E8E8]"
                  : "text-[#280A08]/75 hover:bg-[#280A08]/5"
              }`}
            >
              <FiList aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onCreateNote}
            className="inline-flex items-center gap-2 rounded-xl bg-[#652423] px-4 py-2.5 text-sm font-semibold text-[#E9E8E8] transition hover:bg-[#501c1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#652423] sm:px-5"
          >
            <FiPlus aria-hidden="true" className="h-5 w-5" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#280A08]/20 bg-[#E4E1E1]/60 px-6 py-16 text-center">
          <h3 className="font-serif text-xl font-semibold text-[#280A08]">
            {searchQuery.trim()
              ? "No notes found"
              : isArchived
                ? "No archived notes"
                : "Start creating your notes"}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[#280A08]/70">
            {searchQuery.trim()
              ? "Try another search term or clear your search."
              : isArchived
                ? "Notes you archive will appear here."
                : "Capture your ideas, plans, and thoughts in a private place."}
          </p>
          {!isArchived && !searchQuery.trim() && (
            <button
              type="button"
              onClick={onCreateNote}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#652423] px-5 py-3 text-sm font-semibold text-[#E9E8E8] hover:bg-[#501c1b]"
            >
              <FiPlus aria-hidden="true" className="h-5 w-5" />
              Create your first note
            </button>
          )}
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
              : "flex flex-col gap-3"
          }
        >
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              title={note.title || "Untitled note"}
              preview={note.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()}
              category={note.category}
              date={note.date}
              listView={view === "list"}
              onClick={() => onOpenNote(note)}
              onEdit={() => onOpenNote(note)}
              onArchive={() => onArchiveNote(note)}
              onDelete={() => onDeleteNote(note.id)}
              isArchived={isArchived}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default NotesLayout;
