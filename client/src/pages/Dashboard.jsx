import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import NotesLayout from "../components/notes/NotesLayout";
import { initialNotes } from "../components/notes/notesData";
import NoteEditor from "./NoteEditor";
import { endUserSession } from "../utils/userProfile";

function Dashboard() {
  const [notes, setNotes] = useState(initialNotes);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const visibleNotes = (showArchived ? archivedNotes : notes).filter((note) => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return true;

    const searchableText = [
      note.title,
      note.content.replace(/<[^>]*>/g, " "),
      note.category,
      note.date,
    ]
      .join(" ")
      .toLocaleLowerCase();
    return searchableText.includes(query);
  });

  function createNote() {
    setEditingNote({
      id: null,
      title: "",
      content: "",
      category: "Personal",
      date: "",
    });
  }

  function saveNote(updatedNote) {
    const savedNote = {
      ...updatedNote,
      id: updatedNote.id ?? Date.now(),
      date: `Today, ${new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date())}`,
    };

    const updateCollection = (currentNotes) => {
      const exists = currentNotes.some((note) => note.id === savedNote.id);
      return exists
        ? currentNotes.map((note) =>
            note.id === savedNote.id ? savedNote : note,
          )
        : [savedNote, ...currentNotes];
    };

    if (savedNote.archived) {
      setArchivedNotes(updateCollection);
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== savedNote.id),
      );
    } else {
      setNotes(updateCollection);
      setArchivedNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== savedNote.id),
      );
    }
    setEditingNote(null);
  }

  function deleteNote(noteId) {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== noteId),
    );
    setArchivedNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== noteId),
    );
    setEditingNote(null);
  }

  function archiveNote(note) {
    if (showArchived) {
      setArchivedNotes((currentNotes) =>
        currentNotes.filter((item) => item.id !== note.id),
      );
      setNotes((currentNotes) => [
        { ...note, archived: false },
        ...currentNotes,
      ]);
    } else {
      setNotes((currentNotes) =>
        currentNotes.filter((item) => item.id !== note.id),
      );
      setArchivedNotes((currentNotes) => [
        { ...note, archived: true },
        ...currentNotes,
      ]);
    }
  }

  function handleSidebarNavigation(label) {
    if (label === "Log Out") {
      endUserSession();
      window.location.assign("/login");
    } else if (label === "My Notes") {
      setShowArchived(false);
      setEditingNote(null);
    } else if (label === "Archived") {
      setShowArchived(true);
      setEditingNote(null);
    } else if (label === "Create Note") {
      setShowArchived(false);
      createNote();
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#D5D1D1] md:flex-row">
      <Sidebar
        activeItem={
          editingNote
            ? "Create Note"
            : showArchived
              ? "Archived"
              : "My Notes"
        }
        onNavigate={handleSidebarNavigation}
      />
      <main className="min-w-0 flex-1">
        {editingNote ? (
          <NoteEditor
            key={editingNote.id ?? "new-note"}
            note={editingNote}
            onBack={() => setEditingNote(null)}
            onSave={saveNote}
            onDelete={deleteNote}
          />
        ) : (
          <>
            <Navbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={setSearchQuery}
            />
            <NotesLayout
              notes={visibleNotes}
              onOpenNote={setEditingNote}
              onCreateNote={createNote}
              onArchiveNote={archiveNote}
              onDeleteNote={deleteNote}
              heading={showArchived ? "Archived Notes" : "My Notes"}
              isArchived={showArchived}
              searchQuery={searchQuery}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;