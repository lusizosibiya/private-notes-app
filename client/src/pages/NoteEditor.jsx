import { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiBold,
  FiCalendar,
  FiChevronDown,
  FiCode,
  FiEdit3,
  FiItalic,
  FiLink,
  FiList,
  FiSlash,
  FiRotateCcw,
  FiRotateCw,
  FiSave,
  FiTrash2,
  FiUnderline,
} from "react-icons/fi";

const categories = ["Personal", "Work", "Study", "Travel", "Reading", "Content"];
const EDITOR_SURFACE_COLOR = "#F5F2F1";

function NumberedListIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M9 6h12M9 12h12M9 18h12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M3.3 5.2h1v2.6M3.3 5.2h1.4M3.3 11.1c.1-.7.6-1 1.1-1 .6 0 1 .3 1 .9 0 .4-.2.7-.5 1l-1.6 1.5h2.1M3.4 16.2c.2-.3.6-.5 1-.5.7 0 1.1.3 1.1.9 0 .4-.3.7-.8.8.6 0 1 .4 1 1s-.5 1-1.2 1c-.5 0-.9-.2-1.2-.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}
const colorPalette = [
  ["#000000", "#434343", "#666666", "#999999", "#B7B7B7", "#CCCCCC", "#D9D9D9", "#EFEFEF", "#F3F3F3", "#FFFFFF"],
  ["#980000", "#FF0000", "#FF9900", "#FFFF00", "#00FF00", "#00FFFF", "#4A86E8", "#0000FF", "#9900FF", "#FF00FF"],
  ["#E6B8AF", "#F4CCCC", "#FCE5CD", "#FFF2CC", "#D9EAD3", "#D0E0E3", "#C9DAF8", "#CFE2F3", "#D9D2E9", "#EAD1DC"],
  ["#DD7E6B", "#EA9999", "#F9CB9C", "#FFE599", "#B6D7A8", "#A2C4C9", "#A4C2F4", "#9FC5E8", "#B4A7D6", "#D5A6BD"],
  ["#CC4125", "#E06666", "#F6B26B", "#FFD966", "#93C47D", "#76A5AF", "#6D9EEB", "#6FA8DC", "#8E7CC3", "#C27BA0"],
  ["#A61C00", "#CC0000", "#E69138", "#F1C232", "#6AA84F", "#45818E", "#3C78D8", "#3D85C6", "#674EA7", "#A64D79"],
  ["#85200C", "#990000", "#B45F06", "#BF9000", "#38761D", "#134F5C", "#1155CC", "#0B5394", "#351C75", "#741B47"],
  ["#5B0F00", "#660000", "#783F04", "#7F6000", "#274E13", "#0C343D", "#1C4587", "#073763", "#20124D", "#4C1130"],
];
const textColors = colorPalette.flat();
const highlightColors = textColors;
const textSizes = [
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "48px",
];

function isSafeLink(href) {
  try {
    const url = new URL(href, window.location.origin);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function normalizeCssColor(value) {
  if (!value) return "";
  const probe = document.createElement("span");
  probe.style.color = value;
  return window.getComputedStyle(probe).color;
}

function sanitizeEditorHtml(html) {
  const allowedTags = new Set([
    "A",
    "B",
    "BLOCKQUOTE",
    "BR",
    "CODE",
    "DIV",
    "EM",
    "I",
    "LI",
    "OL",
    "P",
    "SPAN",
    "STRONG",
    "U",
    "UL",
  ]);
  const allowedColors = new Set(textColors.map(normalizeCssColor));
  const allowedHighlights = new Set([
    ...highlightColors.map(normalizeCssColor),
    normalizeCssColor(EDITOR_SURFACE_COLOR),
  ]);
  const allowedSizes = new Set(textSizes);
  const parsed = new DOMParser().parseFromString(html, "text/html");

  function cleanNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent ?? "");
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const tag = node.tagName;
    if (!allowedTags.has(tag)) {
      const fragment = document.createDocumentFragment();
      Array.from(node.childNodes).forEach((child) => {
        const cleaned = cleanNode(child);
        if (cleaned) fragment.append(cleaned);
      });
      return fragment;
    }

    const cleanedElement = document.createElement(tag.toLowerCase());
    if (tag === "A") {
      const href = node.getAttribute("href") ?? "";
      if (isSafeLink(href)) cleanedElement.setAttribute("href", href);
      cleanedElement.setAttribute("target", "_blank");
      cleanedElement.setAttribute("rel", "noreferrer");
    }

    if (tag === "SPAN") {
      const color = node.style.color;
      const fontSize = node.style.fontSize;
      const backgroundColor = node.style.backgroundColor;
      if (allowedColors.has(normalizeCssColor(color))) {
        cleanedElement.style.color = color;
      }
      if (allowedHighlights.has(normalizeCssColor(backgroundColor))) {
        cleanedElement.style.backgroundColor = backgroundColor;
      }
      if (allowedSizes.has(fontSize)) cleanedElement.style.fontSize = fontSize;
    }

    Array.from(node.childNodes).forEach((child) => {
      const cleaned = cleanNode(child);
      if (cleaned) cleanedElement.append(cleaned);
    });
    return cleanedElement;
  }

  const container = document.createElement("div");
  Array.from(parsed.body.childNodes).forEach((node) => {
    const cleaned = cleanNode(node);
    if (cleaned) container.append(cleaned);
  });
  return container.innerHTML;
}

function NoteEditor({ note, onBack, onSave, onDelete }) {
  const [title, setTitle] = useState(note.title ?? "");
  const [content, setContent] = useState(note.content ?? "");
  const [category, setCategory] = useState(note.category ?? "Personal");
  const [pinned, setPinned] = useState(note.pinned ?? false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [openPalette, setOpenPalette] = useState(null);
  const [selectedTextColor, setSelectedTextColor] = useState(textColors[0]);
  const [selectedHighlightColor, setSelectedHighlightColor] = useState(null);
  const [historyAvailability, setHistoryAvailability] = useState({
    canUndo: false,
    canRedo: false,
  });
  const contentRef = useRef(null);
  const savedSelectionRef = useRef(null);
  const historyRef = useRef({ past: [], future: [], lastHtml: "" });

  useEffect(() => {
    if (!contentRef.current) return;
    const initialContent = note.content ?? "";
    const escapedContent = initialContent
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");
    contentRef.current.innerHTML = sanitizeEditorHtml(escapedContent);
    const initialHtml = contentRef.current.innerHTML;
    setContent(initialHtml);
    historyRef.current = { past: [], future: [], lastHtml: initialHtml };
    setHistoryAvailability({ canUndo: false, canRedo: false });
  }, [note.content, note.id]);

  function saveSelection() {
    const selection = window.getSelection();
    if (
      selection?.rangeCount &&
      contentRef.current?.contains(selection.anchorNode) &&
      contentRef.current.contains(selection.focusNode)
    ) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
      updateActiveFormats();
    }
  }

  function updateActiveFormats() {
    if (!contentRef.current) return;
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  }

  function restoreSelection() {
    const selection = window.getSelection();
    if (selection && savedSelectionRef.current) {
      selection.removeAllRanges();
      selection.addRange(savedSelectionRef.current);
    }
  }

  function wrapSelection(tagName, styleName, styleValue) {
    const editor = contentRef.current;
    const selection = window.getSelection();
    if (!editor || !selection) return;

    restoreSelection();
    let range = selection.rangeCount ? selection.getRangeAt(0) : null;
    if (!range || !editor.contains(range.commonAncestorContainer)) {
      editor.focus();
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
    }

    if (range.collapsed) {
      const placeholder = document.createTextNode("text");
      range.insertNode(placeholder);
      range.selectNodeContents(placeholder);
    }

    const wrapper = document.createElement(tagName);
    if (styleName) wrapper.style.setProperty(styleName, styleValue);
    try {
      range.surroundContents(wrapper);
    } catch {
      wrapper.append(range.extractContents());
      range.insertNode(wrapper);
    }

    selection.removeAllRanges();
    const nextRange = document.createRange();
    nextRange.selectNodeContents(wrapper);
    selection.addRange(nextRange);
    savedSelectionRef.current = nextRange.cloneRange();
    editor.focus();
    updateContent();
    updateActiveFormats();
  }

  function updateHistoryAvailability() {
    setHistoryAvailability({
      canUndo: historyRef.current.past.length > 0,
      canRedo: historyRef.current.future.length > 0,
    });
  }

  function commitEditorChange(previousHtml = historyRef.current.lastHtml) {
    if (!contentRef.current) return;

    const currentHtml = sanitizeEditorHtml(contentRef.current.innerHTML);
    if (currentHtml !== historyRef.current.lastHtml) {
      const history = historyRef.current;
      const snapshot = history.lastHtml === previousHtml
        ? previousHtml
        : history.lastHtml;
      history.past.push(snapshot);
      history.future = [];
      history.lastHtml = currentHtml;
      updateHistoryAvailability();
    }

    setContent(currentHtml);
    saveSelection();
  }

  function updateContent() {
    commitEditorChange();
  }

  function applyFormatting(format) {
    const editor = contentRef.current;
    if (!editor) return;
    editor.focus();
    restoreSelection();

    const inlineTags = {
      bold: "strong",
      italic: "em",
      underline: "u",
    };
    if (inlineTags[format]) {
      applyInlineFormat(inlineTags[format], format);
      return;
    }

    const commands = {
      unorderedList: "insertUnorderedList",
      orderedList: "insertOrderedList",
    };

    if (format === "code") {
      wrapSelection("code");
    } else if (format === "link") {
      const href = window.prompt("Enter the link URL", "https://");
      if (!href) return;
      if (!isSafeLink(href.trim())) {
        window.alert("Enter a valid http, https, or mailto link.");
        return;
      }
      document.execCommand("createLink", false, href.trim());
      updateContent();
    } else if (commands[format]) {
      document.execCommand(commands[format], false);
      commitEditorChange();
      updateActiveFormats();
    }
  }

  function applyInlineFormat(tagName, command) {
    const editor = contentRef.current;
    const selection = window.getSelection();
    if (!editor || !selection) return;

    restoreSelection();
    const range = selection.rangeCount ? selection.getRangeAt(0) : null;
    if (!range || !editor.contains(range.commonAncestorContainer)) return;

    if (range.collapsed) {
      const previousHtml = historyRef.current.lastHtml;
      document.execCommand(command, false);
      updateActiveFormats();
      commitEditorChange(previousHtml);
      return;
    }

    const previousHtml = historyRef.current.lastHtml;
    const fragment = range.extractContents();
    const textNodes = [];
    const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.trim()) {
        textNodes.push(walker.currentNode);
      }
    }

    const isFullyFormatted =
      textNodes.length > 0 &&
      textNodes.every((textNode) => {
        let parent = textNode.parentElement;
        while (parent && parent !== fragment) {
          if (parent.tagName.toLowerCase() === tagName) return true;
          parent = parent.parentElement;
        }
        return false;
      });

    function normalizeFragment(node) {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      Array.from(node.children).forEach(normalizeFragment);
      if (node.tagName.toLowerCase() === tagName) {
        const parent = node.parentNode;
        while (node.firstChild) parent.insertBefore(node.firstChild, node);
        parent.removeChild(node);
      }
    }

    Array.from(fragment.children).forEach(normalizeFragment);

    const insertedNode = document.createElement(
      isFullyFormatted ? "span" : tagName,
    );
    insertedNode.append(fragment);

    range.insertNode(insertedNode);
    selection.removeAllRanges();
    const updatedRange = document.createRange();
    updatedRange.selectNodeContents(insertedNode);
    selection.addRange(updatedRange);
    savedSelectionRef.current = updatedRange.cloneRange();
    commitEditorChange(previousHtml);
    updateActiveFormats();
  }

  function applyHistory(command) {
    const editor = contentRef.current;
    if (!editor) return;

    const history = historyRef.current;
    const source = command === "undo" ? history.past : history.future;
    const destination = command === "undo" ? history.future : history.past;
    const targetHtml = source.pop();
    if (targetHtml === undefined) return;

    destination.push(history.lastHtml);
    editor.innerHTML = targetHtml;
    history.lastHtml = targetHtml;
    setContent(targetHtml);
    editor.focus();

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
    savedSelectionRef.current = range.cloneRange();

    updateHistoryAvailability();
    updateActiveFormats();
  }

  function applyTextSize(size) {
    applyStyleToSelection("font-size", size);
  }

  function applyTextColor(color) {
    applyStyleToSelection("color", color);
  }

  function applyHighlight(color) {
    applyStyleToSelection(
      "background-color",
      color || EDITOR_SURFACE_COLOR,
    );
  }

  function applyStyleToSelection(property, value) {
    const editor = contentRef.current;
    const selection = window.getSelection();
    if (!editor || !selection) return;

    editor.focus();
    restoreSelection();

    const selectedRange = selection.rangeCount ? selection.getRangeAt(0) : null;
    if (
      !selectedRange ||
      selectedRange.collapsed ||
      !editor.contains(selectedRange.commonAncestorContainer)
    ) {
      return;
    }

    const segments = [];
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const textNode = walker.currentNode;
      if (!selectedRange.intersectsNode(textNode)) continue;

      const startOffset =
        selectedRange.startContainer === textNode
          ? selectedRange.startOffset
          : 0;
      const endOffset =
        selectedRange.endContainer === textNode
          ? selectedRange.endOffset
          : textNode.length;
      if (endOffset > startOffset) {
        segments.push({ textNode, startOffset, endOffset });
      }
    }

    if (segments.length === 0) return;

    const previousHtml = historyRef.current.lastHtml;
    const changedNodes = [];

    function clearStyle(node) {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      node.style.removeProperty(property);
      Array.from(node.children).forEach(clearStyle);
    }

    for (const { textNode, startOffset, endOffset } of segments.reverse()) {
      let selectedTextNode = textNode;
      if (endOffset < selectedTextNode.length) {
        selectedTextNode.splitText(endOffset);
      }
      if (startOffset > 0) {
        selectedTextNode = selectedTextNode.splitText(startOffset);
      }

      const segmentRange = document.createRange();
      segmentRange.selectNode(selectedTextNode);
      const fragment = segmentRange.extractContents();
      Array.from(fragment.childNodes).forEach(clearStyle);

      const styledText = document.createElement("span");
      styledText.style.setProperty(property, value);
      styledText.append(fragment);
      segmentRange.insertNode(styledText);
      changedNodes.unshift(styledText);
    }

    const updatedRange = document.createRange();
    updatedRange.setStartBefore(changedNodes[0]);
    updatedRange.setEndAfter(changedNodes[changedNodes.length - 1]);
    selection.removeAllRanges();
    selection.addRange(updatedRange);
    savedSelectionRef.current = updatedRange.cloneRange();
    commitEditorChange(previousHtml);
  }

  function handleSave() {
    if (!title.trim()) return;
    const safeContent = sanitizeEditorHtml(contentRef.current?.innerHTML ?? content);
    onSave({
      ...note,
      title: title.trim(),
      content: safeContent,
      category,
      pinned,
    });
  }

  const plainText =
    new DOMParser().parseFromString(content, "text/html").body.textContent ?? "";
  const wordCount = plainText.trim()
    ? plainText.trim().split(/\s+/).length
    : 0;

  return (
    <div className="flex min-h-screen min-w-0 flex-1 flex-col text-[#280A08]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#280A08]/10 bg-[#E4E1E1] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border border-[#280A08]/15 px-3 py-2 text-sm hover:bg-white/50"
          >
            <FiArrowLeft aria-hidden="true" className="h-4 w-4" />
            <span>Back to Notes</span>
          </button>
          <span className="hidden h-7 w-px bg-[#280A08]/20 sm:block" />
          <h1 className="font-serif text-lg">Note Editor</h1>
        </div>

        <div className="flex items-center gap-2">
          {note.id != null && (
            <button
              type="button"
              onClick={() => onDelete(note.id)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#8E3435]/50 px-3 py-2 text-sm text-[#652423] hover:bg-[#8E3435]/10"
            >
              <FiTrash2 aria-hidden="true" className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#652423] px-3 py-2 text-sm font-semibold text-[#E9E8E8] hover:bg-[#501c1b] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          >
            <FiSave aria-hidden="true" className="h-4 w-4" />
            <span>Save Note</span>
          </button>
        </div>
      </header>

      <div className="grid flex-1 gap-4 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_250px]">
        <section className="flex min-h-[65vh] min-w-0 flex-col rounded-2xl border border-[#280A08]/10 bg-[#F5F2F1] p-4 shadow-sm sm:p-6">
          <input
            aria-label="Note title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Untitled note"
            maxLength={100}
            className="w-full rounded-lg border border-[#280A08]/10 bg-transparent px-4 py-3 font-serif text-2xl font-semibold outline-none focus:border-[#652423]/50 sm:text-3xl"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#280A08]/70">
            <span className="rounded-full bg-[#E4E1E1] px-3 py-1.5">
              Category: {category}
            </span>
            {pinned && (
              <span className="rounded-full bg-[#8E3435]/15 px-3 py-1.5 text-[#652423]">
                Pinned
              </span>
            )}
            {note.date && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4E1E1] px-3 py-1.5">
                <FiCalendar aria-hidden="true" className="h-3.5 w-3.5" />
                Last edited: {note.date}
              </span>
            )}
          </div>

          <div
            aria-label="Text formatting options"
            className="mt-5 flex flex-wrap items-center gap-1 border-y border-[#280A08]/10 py-2 text-[#280A08]/75"
          >
            {[
              { label: "Undo", icon: FiRotateCcw, command: "undo" },
              { label: "Redo", icon: FiRotateCw, command: "redo" },
            ].map(({ label, icon: Icon, command }) => (
              <button
                key={command}
                type="button"
                aria-label={label}
                title={label}
                disabled={
                  command === "undo"
                    ? !historyAvailability.canUndo
                    : !historyAvailability.canRedo
                }
                onMouseDown={(event) => {
                  saveSelection();
                  event.preventDefault();
                }}
                onClick={() => applyHistory(command)}
                className="rounded-md p-2 hover:bg-[#280A08]/5 focus-visible:outline-2 focus-visible:outline-[#652423] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </button>
            ))}
            <span aria-hidden="true" className="mx-1 h-5 w-px bg-[#280A08]/10" />
            {[
              { label: "Bold", icon: FiBold, format: "bold" },
              { label: "Italic", icon: FiItalic, format: "italic" },
              { label: "Underline", icon: FiUnderline, format: "underline" },
              {
                label: "Bulleted list",
                icon: FiList,
                format: "unorderedList",
              },
              {
                label: "Numbered list",
                icon: NumberedListIcon,
                format: "orderedList",
              },
              { label: "Inline code", icon: FiCode, format: "code" },
              { label: "Insert link", icon: FiLink, format: "link" },
            ].map(({ label, icon: Icon, format }) => (
              <button
                key={format}
                type="button"
                aria-label={label}
                title={label}
                onMouseDown={(event) => {
                  saveSelection();
                  event.preventDefault();
                }}
                onClick={() => applyFormatting(format)}
                aria-pressed={
                  format === "bold" ||
                  format === "italic" ||
                  format === "underline"
                    ? activeFormats[format]
                    : undefined
                }
                className={`rounded-md p-2 focus-visible:outline-2 focus-visible:outline-[#652423] ${
                  activeFormats[format]
                    ? "bg-[#280A08]/5 text-[#652423]"
                    : "hover:bg-[#280A08]/5"
                }`}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </button>
            ))}

            <label className="ml-1 inline-flex items-center gap-1.5 border-l border-[#280A08]/10 pl-2 text-xs">
              <span>Size</span>
              <select
                aria-label="Text size"
                defaultValue="16px"
                onMouseDown={saveSelection}
                onChange={(event) => applyTextSize(event.target.value)}
                className="rounded-md border border-[#280A08]/15 bg-[#F5F2F1] px-2 py-1 text-xs text-[#280A08]"
              >
                {textSizes.map((size) => (
                  <option key={size} value={size}>
                    {size.replace("px", "")}
                  </option>
                ))}
              </select>
            </label>

            <div className="relative ml-1 border-l border-[#280A08]/10 pl-2">
              <button
                type="button"
                aria-label="Text color"
                aria-expanded={openPalette === "text"}
                onMouseDown={(event) => {
                  saveSelection();
                  event.preventDefault();
                }}
                onClick={() =>
                  setOpenPalette((current) =>
                    current === "text" ? null : "text",
                  )
                }
                className="inline-flex items-center gap-1 rounded-md px-2 py-2 hover:bg-[#280A08]/5"
              >
                <span
                  className="border-b-2 px-1 font-bold text-base"
                  style={{ borderColor: selectedTextColor }}
                >
                  A
                </span>
                <FiChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
              {openPalette === "text" && (
                <div
                  role="group"
                  aria-label="Choose text color"
                  className="absolute left-0 top-full z-30 mt-2 w-[284px] rounded-lg border border-[#280A08]/10 bg-white p-3 shadow-xl sm:w-[304px]"
                >
                  <div className="grid grid-cols-10 gap-1">
                    {colorPalette.flatMap((row, rowIndex) =>
                      row.map((color, colorIndex) => (
                        <button
                          key={`${rowIndex}-${colorIndex}`}
                          type="button"
                          aria-label={`Set text color ${color}`}
                          title={color}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setSelectedTextColor(color);
                            applyTextColor(color);
                            setOpenPalette(null);
                          }}
                          className="h-5 w-5 rounded-full border border-black/15 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#652423] sm:h-6 sm:w-6"
                          style={{ backgroundColor: color }}
                        />
                      )),
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label="Text highlight"
                aria-expanded={openPalette === "highlight"}
                onMouseDown={(event) => {
                  saveSelection();
                  event.preventDefault();
                }}
                onClick={() =>
                  setOpenPalette((current) =>
                    current === "highlight" ? null : "highlight",
                  )
                }
                className="inline-flex items-center gap-1 rounded-md px-2 py-2 hover:bg-[#280A08]/5"
              >
                <FiEdit3
                  aria-hidden="true"
                  className="h-4 w-4"
                  style={{ color: selectedHighlightColor }}
                />
                <FiChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
              {openPalette === "highlight" && (
                <div
                  role="group"
                  aria-label="Choose highlight color"
                  className="absolute right-0 top-full z-30 mt-2 w-[284px] rounded-lg border border-[#280A08]/10 bg-white p-3 shadow-xl sm:left-0 sm:right-auto sm:w-[304px]"
                >
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setSelectedHighlightColor(null);
                      applyHighlight(null);
                      setOpenPalette(null);
                    }}
                    className="mb-2 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-[#280A08] hover:bg-[#280A08]/5"
                  >
                    <FiSlash aria-hidden="true" className="h-4 w-4" />
                    None
                  </button>
                  <div className="grid grid-cols-10 gap-1">
                    {colorPalette.flatMap((row, rowIndex) =>
                      row.map((color, colorIndex) => (
                        <button
                          key={`${rowIndex}-${colorIndex}`}
                          type="button"
                          aria-label={`Highlight text ${color}`}
                          title={color}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setSelectedHighlightColor(color);
                            applyHighlight(color);
                            setOpenPalette(null);
                          }}
                          className="h-5 w-5 rounded-full border border-black/15 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#652423] sm:h-6 sm:w-6"
                          style={{ backgroundColor: color }}
                        />
                      )),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            ref={contentRef}
            role="textbox"
            aria-label="Note content"
            aria-multiline="true"
            contentEditable
            suppressContentEditableWarning
            onInput={updateContent}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            onPaste={(event) => {
              event.preventDefault();
              document.execCommand(
                "insertText",
                false,
                event.clipboardData.getData("text/plain"),
              );
              updateContent();
            }}
            onDrop={(event) => event.preventDefault()}
            className="prose-note mt-4 min-h-72 flex-1 overflow-y-auto bg-transparent text-base leading-7 outline-none empty:before:pointer-events-none empty:before:text-[#280A08]/45 empty:before:content-['Start_writing_your_note...'] [&_a]:text-[#652423] [&_a]:underline [&_code]:rounded [&_code]:bg-[#E4E1E1] [&_code]:px-1 [&_li]:ml-0 [&_ol]:list-outside [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-outside [&_ul]:list-disc [&_ul]:pl-6"
          />
        </section>

        <aside className="rounded-2xl border border-[#280A08]/10 bg-[#F5F2F1] p-5 shadow-sm">
          <h2 className="border-b border-[#280A08]/10 pb-3 font-serif text-lg font-semibold">
            Note Details
          </h2>

          <label
            htmlFor="editor-category"
            className="mt-4 block text-sm font-medium"
          >
            Category
          </label>
          <select
            id="editor-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 w-full rounded-lg border border-[#280A08]/15 bg-[#E4E1E1] px-3 py-2 text-sm outline-none focus:border-[#652423]"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="mt-4 flex cursor-pointer items-center justify-between border-b border-[#280A08]/10 py-3 text-sm">
            <span>Pinned</span>
            <input
              type="checkbox"
              checked={pinned}
              onChange={(event) => setPinned(event.target.checked)}
              className="h-4 w-4 accent-[#652423]"
            />
          </label>

          <div className="border-b border-[#280A08]/10 py-3 text-sm">
            <span className="block font-medium">Word Count</span>
            <span className="mt-1 block text-xs text-[#280A08]/70">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default NoteEditor;
