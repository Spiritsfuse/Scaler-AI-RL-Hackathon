import { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";

/**
 * Canvas Modal Component
 * A Slack-like canvas for creating rich documents/notes in a channel
 */
const CanvasModal = ({ channel, onClose }) => {
  const [title, setTitle] = useState("Untitled");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Handle saving the canvas
  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (!channel) {
        console.error("No channel available");
        return;
      }

      // Send canvas as a message to the channel
      await channel.sendMessage({
        text: `📄 **Canvas: ${title}**\n\n${content}`,
        canvas_title: title,
        canvas_content: content,
      });

      // Close modal after save
      onClose();
    } catch (error) {
      console.error("Error saving canvas:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create Canvas</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Canvas Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Add Cover Button (Placeholder) */}
          <div className="mb-6">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm text-gray-700">
              <ImageIcon className="size-4" />
              <span>Add cover</span>
            </button>
          </div>

          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-bold text-gray-900 border-none outline-none mb-6 placeholder-gray-400"
            placeholder="Untitled"
          />

          {/* Content Editor (Simple textarea for now) */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[400px] text-base text-gray-700 border-none outline-none resize-none placeholder-gray-400"
            placeholder="Start typing your canvas content here..."
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Canvas"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvasModal;