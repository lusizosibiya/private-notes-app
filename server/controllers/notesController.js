import { createUserClient } from "../config/supabase.js";

export async function getNotes(req, res) {
  try {
    const supabase = createUserClient(req.accessToken);

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Get notes error:", error);

      return res.status(500).json({
        message: "Unable to retrieve notes.",
      });
    }

    return res.status(200).json(data ?? []);
  } catch (error) {
    console.error("Get notes error:", error);

    return res.status(500).json({
      message: "Something went wrong while retrieving notes.",
    });
  }
}

// This function creates the notes
export async function createNote(req, res) {
  try {
    const { title, content, category, pinned, archived } = req.body;

    // A note must have a title.
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "A note title is required.",
      });
    }

    // Validate the optional fields.
    if (
      (content !== undefined && typeof content !== "string") ||
      (category !== undefined && typeof category !== "string") ||
      (pinned !== undefined && typeof pinned !== "boolean") ||
      (archived !== undefined && typeof archived !== "boolean")
    ) {
      return res.status(400).json({
        message: "Invalid note information.",
      });
    }

    const supabase = createUserClient(req.accessToken);

    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: req.user.id,
        title: title.trim(),
        content: content ?? "",
        category: category?.trim() || "Personal",
        pinned: pinned ?? false,
        archived: archived ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error("Create note error:", error);

      return res.status(500).json({
        message: "Unable to create note.",
      });
    }

    return res.status(201).json({
      message: "Note created successfully.",
      note: data,
    });
  } catch (error) {
    console.error("Create note error:", error);

    return res.status(500).json({
      message: "Something went wrong while creating the note.",
    });
  }
}
// This function updates the notes
export async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const { title, content, category, pinned, archived } = req.body ?? {};

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        message: "Invalid note ID.",
      });
    }

    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "A note title cannot be empty.",
        });
      }

      updates.title = title.trim();
    }

    if (content !== undefined) {
      if (typeof content !== "string") {
        return res.status(400).json({
          message: "Content must be text.",
        });
      }

      updates.content = content;
    }

    if (category !== undefined) {
      if (typeof category !== "string" || !category.trim()) {
        return res.status(400).json({
          message: "A valid category is required.",
        });
      }

      updates.category = category.trim();
    }

    if (pinned !== undefined) {
      if (typeof pinned !== "boolean") {
        return res.status(400).json({
          message: "Pinned must be true or false.",
        });
      }

      updates.pinned = pinned;
    }

    if (archived !== undefined) {
      if (typeof archived !== "boolean") {
        return res.status(400).json({
          message: "Archived must be true or false.",
        });
      }

      updates.archived = archived;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for updating.",
      });
    }

    updates.updated_at = new Date().toISOString();

    const supabase = createUserClient(req.accessToken);

    const { data, error } = await supabase
      .from("notes")
      .update(updates)
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Update note error:", error);

      return res.status(500).json({
        message: "Unable to update note.",
      });
    }

    if (!data) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    return res.status(200).json({
      message: "Note updated successfully.",
      note: data,
    });
  } catch (error) {
    console.error("Update note error:", error);

    return res.status(500).json({
      message: "Something went wrong while updating the note.",
    });
  }
}
// This function deletes the notes
export async function deleteNote(req, res) {
  try {
    const { id } = req.params;

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        message: "Invalid note ID.",
      });
    }

    const supabase = createUserClient(req.accessToken);

    const { data, error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Delete note error:", error);

      return res.status(500).json({
        message: "Unable to delete note.",
      });
    }

    if (!data) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    return res.status(200).json({
      message: "Note deleted successfully.",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    return res.status(500).json({
      message: "Something went wrong while deleting the note.",
    });
  }
}
