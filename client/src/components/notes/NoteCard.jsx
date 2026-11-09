import { useState } from "react";
import {
  FiArchive,
  FiCalendar,
  FiEdit2,
  FiMoreHorizontal,
  FiTrash2,
} from "react-icons/fi";

const categoryStyles = {
  Work: "bg-[#8E3435]/15 text-[#652423]",
  Study: "bg-slate-500/20 text-slate-700",
  Personal: "bg-rose-900/15 text-rose-900",
  Travel: "bg-slate-500/20 text-slate-700",
  Reading: "bg-rose-900/15 text-rose-900",
  Content: "bg-slate-500/20 text-slate-700",
};

function NoteCard({
  title,
  preview,
  category,
  date,
  listView = false,
  onClick,
  onEdit,
  onArchive,
  onDelete,
  isArchived = false,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const categoryStyle =
    categoryStyles[category] ?? "bg-[#280A08]/10 text-[#280A08]";

  return (
    <article
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (
          event.target === event.currentTarget &&
          onClick &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onClick();
        }
      }}
      className={`relative rounded-2xl border border-[#280A08]/5 bg-[#E4E1E1] p-5 text-[#280A08] shadow-sm transition-shadow hover:shadow-md sm:p-6 ${
        onClick
          ? "cursor-pointer focus-visible:outline-2 focus-visible:outline-[#652423]"
          : ""
      } ${
        listView
          ? "grid grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(10rem,0.8fr)_minmax(0,2fr)_auto]"
          : "flex min-h-44 flex-col"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-1 font-serif text-lg font-semibold sm:text-xl">
          {title}
        </h3>
        <button
          type="button"
          aria-label={`More options for ${title}`}
          aria-expanded={isMenuOpen}
          onClick={(event) => {
            event.stopPropagation();
            setIsMenuOpen((open) => !open);
          }}
          className="-mr-2 -mt-2 shrink-0 rounded-full p-2 text-[#280A08]/70 hover:bg-[#280A08]/5 hover:text-[#280A08]"
        >
          <FiMoreHorizontal aria-hidden="true" className="h-5 w-5" />
        </button>
        {isMenuOpen && (
          <div
            role="menu"
            aria-label={`${title} options`}
            onClick={(event) => event.stopPropagation()}
            className="absolute right-4 top-12 z-10 min-w-36 rounded-xl border border-[#280A08]/10 bg-[#F5F2F1] p-1.5 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsMenuOpen(false);
                onEdit?.();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-[#280A08]/5"
            >
              <FiEdit2 aria-hidden="true" className="h-4 w-4" />
              Edit
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsMenuOpen(false);
                onArchive?.();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-[#280A08]/5"
            >
              <FiArchive aria-hidden="true" className="h-4 w-4" />
              {isArchived ? "Restore" : "Archive"}
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsMenuOpen(false);
                onDelete?.();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#652423] hover:bg-[#8E3435]/10"
            >
              <FiTrash2 aria-hidden="true" className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      <p
        className={`text-sm leading-relaxed text-[#280A08]/85 ${
          listView ? "line-clamp-2" : "mt-2 line-clamp-3 flex-1"
        }`}
      >
        {preview}
      </p>

      <footer
        className={`flex flex-wrap items-center justify-between gap-3 ${
          listView ? "sm:justify-end" : "mt-5"
        }`}
      >
        <span
          className={`rounded-md px-2.5 py-1 text-xs font-medium ${categoryStyle}`}
        >
          {category}
        </span>
        <time className="inline-flex items-center gap-1.5 text-xs text-[#280A08]/75 sm:text-sm">
          <FiCalendar aria-hidden="true" className="h-4 w-4" />
          {date}
        </time>
      </footer>
    </article>
  );
}

export default NoteCard;
