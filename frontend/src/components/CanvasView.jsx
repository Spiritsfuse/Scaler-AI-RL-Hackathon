import { useState } from "react";
import {
  MoreVertical,
  Plus,
  CaseSensitive,
  Smile,
  CheckSquare,
  List,
  Grid,
} from "lucide-react";
import { useChannelStateContext } from "stream-chat-react";

/**
 * Canvas View Component - Inline canvas editor for the message window
 * Replaces the message list when "Add canvas" tab is active
 */
const CanvasView = () => {
  const { channel } = useChannelStateContext();
  const [title, setTitle] = useState("Your canvas title");
  const [subtitle, setSubtitle] = useState("What's on the docket for today?");
  const [helperText, setHelperText] = useState("Feeling stuck? Try a");
  const [isSaving, setIsSaving] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);

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
        text: `📄 **Canvas: ${title}**\n\n${subtitle}\n\n${helperText}`,
        canvas_title: title,
        canvas_subtitle: subtitle,
        canvas_helper: helperText,
      });

      // Reset form after save
      setTitle("Your canvas title");
      setSubtitle("What's on the docket for today?");
      setHelperText("Feeling stuck? Try a");
    } catch (error) {
      console.error("Error saving canvas:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      {/* Vertical More Button - Fixed on Right Side */}
      <button
        className="absolute top-3 right-4 z-10 p-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        aria-label="More options"
      >
        <MoreVertical className="size-5 text-gray-600" />
      </button>

      {/* Canvas Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Add Cover Hover Area - Full width, no gap */}
        <div className="group h-20 border border-dashed border-gray-200 hover:bg-gray-50 transition-all cursor-pointer relative">
          <button
            className="absolute bottom-0 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm shadow-sm hover:shadow-md"
            style={{ left: '15%' }}
          >
            Add cover
          </button>
        </div>

        {/* Content Container - Constrained width for text */}
        <div className="max-w-3xl mx-auto px-6 pt-6">
          {/* Editable Canvas Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setShowToolbar(true)}
            onBlur={() => setTimeout(() => setShowToolbar(false), 200)}
            className="w-full text-3xl font-bold text-gray-800 border-none outline-none bg-transparent mb-4 focus:ring-0"
            placeholder="Your canvas title"
          />

          {/* Editable Subtitle */}
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            onFocus={() => setShowToolbar(true)}
            onBlur={() => setTimeout(() => setShowToolbar(false), 200)}
            className="w-full text-lg text-gray-500 border-none outline-none bg-transparent mt-4 focus:ring-0"
            placeholder="What's on the docket for today?"
          />

          {/* Editable Helper Text with Link */}
          <div className="mt-2 text-base text-gray-500">
            <input
              type="text"
              value={helperText}
              onChange={(e) => setHelperText(e.target.value)}
              onFocus={() => setShowToolbar(true)}
              onBlur={() => setTimeout(() => setShowToolbar(false), 200)}
              className="border-none outline-none bg-transparent focus:ring-0 inline"
              placeholder="Feeling stuck? Try a"
            />
            {" "}
            <a href="#" className="underline text-gray-500 hover:text-gray-700">
              template...
            </a>
          </div>
        </div>
      </div>

      {/* Floating Toolbar */}
      {showToolbar && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2">
            {/* Plus Icon with Green Background */}
            <button className="p-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
              <Plus className="size-4" />
            </button>

            {/* Text Format Button */}
            <button className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors">
              <CaseSensitive className="size-5" />
            </button>

            {/* Emoji Button */}
            <button className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors">
              <Smile className="size-5" />
            </button>

            {/* Checkbox Button */}
            <button className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors">
              <CheckSquare className="size-5" />
            </button>

            {/* List Button */}
            <button className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors">
              <List className="size-5" />
            </button>

            {/* Grid Button */}
            <button className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors">
              <Grid className="size-5" />
            </button>
          </div>
        </div>
      )}

      {/* Footer with Save Button */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isSaving ? "Saving..." : "Save Canvas"}
        </button>
      </div>
    </div>
  );
};

export default CanvasView;
