import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import NotesLayout from "../components/notes/NotesLayout";
import { initialNotes } from "../components/notes/notesData";
import NoteEditor from "./NoteEditor";
import { apiRequest } from "../services/api";

function Dashboard() {
  const [notes, setNotes] = useState(initialNotes);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const data = await apiRequest("/api/auth/me");
        setCurrentUser(data.user);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }

    loadCurrentUser();
  }, []);

  function formatNote(note) {
    return {
      ...note,
      date: new Date(note.updated_at).toLocaleDateString(),
    };
  }

  async function loadNotes() {
    try {
      setError("");

      const data = await apiRequest("/api/notes");

      setNotes(data.filter((note) => !note.archived).map(formatNote));

      setArchivedNotes(data.filter((note) => note.archived).map(formatNote));
    } catch (error) {
      console.error("Failed to load notes:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

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
    setError("");
    setEditingNote({
      id: null,
      title: "",
      content: "",
      category: "Personal",
      date: "",
      pinned: false,
      archived: false,
    });
  }

  async function saveNote(updatedNote) {
    try {
      setError("");

      const noteData = {
        title: updatedNote.title,
        content: updatedNote.content,
        category: updatedNote.category || "Personal",
        pinned: Boolean(updatedNote.pinned),
        archived: Boolean(updatedNote.archived),
      };

      if (updatedNote.id) {
        await apiRequest(`/api/notes/${updatedNote.id}`, {
          method: "PUT",
          body: JSON.stringify(noteData),
        });
      } else {
        await apiRequest("/api/notes", {
          method: "POST",
          body: JSON.stringify(noteData),
        });
      }

      await loadNotes();
      setEditingNote(null);
    } catch (error) {
      console.error("Failed to save note:", error);
      setError(error.message);
      alert(`Unable to save note: ${error.message}`);
    }
  }

  async function deleteNote(noteId) {
    try {
      setError("");

      await apiRequest(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      await loadNotes();
      setEditingNote(null);
    } catch (error) {
      console.error("Failed to delete note:", error);
      setError(error.message);
      alert(`Unable to delete note: ${error.message}`);
    }
  }

  async function archiveNote(note) {
    try {
      setError("");

      await apiRequest(`/api/notes/${note.id}`, {
        method: "PUT",
        body: JSON.stringify({
          archived: !note.archived,
        }),
      });

      await loadNotes();
    } catch (error) {
      console.error("Failed to archive note:", error);
      setError(error.message);
      alert(`Unable to archive note: ${error.message}`);
    }
  }

  async function handleLogout() {
    try {
      await apiRequest("/api/auth/logout", {
        method: "POST",
      });

      window.location.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Unable to log out. Please try again.");
    }
  }

  function handleSidebarNavigation(label) {
    if (label === "Log Out") {
      handleLogout();
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
          editingNote ? "Create Note" : showArchived ? "Archived" : "My Notes"
        }
        onNavigate={handleSidebarNavigation}
      />

      <main className="min-w-0 flex-1">
        {editingNote ? (
          <>
            {error && (
              <p role="alert" className="p-3 text-red-700">
                {error}
              </p>
            )}
            <NoteEditor
              key={editingNote.id ?? "new-note"}
              note={editingNote}
              onBack={() => setEditingNote(null)}
              onSave={saveNote}
              onDelete={deleteNote}
            />
          </>
        ) : (
          <>
            <Navbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={setSearchQuery}
              currentUser={currentUser}
            />

            {error && (
              <p role="alert" className="px-6 py-3 text-red-700">
                {error}
              </p>
            )}

            {loading ? (
              <p className="p-6 text-[#652423]">Loading your notes...</p>
            ) : (
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
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
