import MDEditor, { commands } from "@uiw/react-md-editor";
import { useState } from 'react';

export default function Editor({ value, onChange }) {
  const [showPreview, setShowPreview] = useState(false);

  const commandArr = [
    // Add default commands you want to keep
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.hr,
    commands.image,
    commands.link,
    commands.code, 
    commands.quote,
    commands.checkedListCommand
  ];

  return (
    <div className="relative" data-color-mode="light">
      <div className="flex mb-2">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-1.5 text-xs bg-zinc-900 text-white rounded hover:bg-zinc-600 transition-colors"
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        textareaProps={{
          placeholder: "Please enter Markdown text",
        }}
        commands={commandArr}
        preview="edit"
        style={{
          fontSize: "16px",
          height: "100%",
          border: "none",
        }}
        previewOptions={{
          preview: "preview",
          style: {
            fontSize: "16px", // Larger font size for preview
            padding: "20px",
          },
        }}
      />
      <div 
        className={`w-full lg:w-1/2 min-h-full fixed top-0 right-0 bg-white p-7 z-30 lg:p-10 shadow-lg transition-transform duration-300 ease-in-out ${
          showPreview ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto max-h-screen`}
      >
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="absolute top-0 right-0 p-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold my-2">Preview</h1>
        <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} />
      </div>
    </div>
  );
}
