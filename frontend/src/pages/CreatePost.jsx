import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";
import toast from "react-hot-toast";
import config from "../../config";

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    category: "",
  });
  const [files, setFiles] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [tags, setTags] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 4.5 * 1024 * 1024) {
        toast.error("Image size should be under 4.5MB");
        return;
      }

      setFiles(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFiles(null);
    setPreviewUrl("");
  };

  const handleAddTag = (tagValue) => {
    if (tagValue) {
      // Split the input by commas and trim whitespace
      const newTags = tagValue.split(",").map((tag) => tag.trim());

      // Filter out empty strings and add only unique tags
      const uniqueNewTags = newTags.filter((tag) => tag && !tags.includes(tag));

      setTags([...tags, ...uniqueNewTags]);
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };
  const createNewPost = async (ev) => {
    ev.preventDefault();

    if (!formData.title || !formData.content || !files) {
      toast.error("Please fill in all required fields");
      return;
    }

    const summary =
      formData.content
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/[#*]/g, "") // Remove # and *
        .replace(/[*_]{1,2}/g, "") // Remove bold and italic markers (e.g., *, _, **, __)
        .slice(0, 230) // Take first 230 characters
        .trim() + "..."; // Add ellipsis

    const data = new FormData();
    // Handle tags separately to ensure they're sent as JSON string
    const formDataToSend = {
      ...formData,
      tags: tags
    };
    
    Object.keys(formDataToSend).forEach((key) => {
      data.set(key, formDataToSend[key]);
    });
    data.set("summary", summary);
    data.set("file", files);
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await fetch(`${config.server_url}/post`, {
        method: "POST",
        body: data,
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        toast.success("Post created successfully!");
        setRedirect(true);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create post");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }


  return (
    <div className="flex flex-col gap-4 justify-around lg:flex-row md:flex-row max-w-7xl mx-auto ">
      <div className="max-w-[900px] flex-1 bg-white rounded-md mx-2">
        <div className="py-8 px-4 lg:px-14">
          {/* Cover Image Section */}
          <div className="mb-6">
            {!previewUrl && (
              <button
                className="px-4 py-2 border-2 border-gray-300 fonts-semibold rounded-md text-zinc-800 hover:border-gray-400 transition-colors font-semibold font-sans"
                onClick={() => document.getElementById("cover-image").click()}
              >
                Add a cover image
              </button>
            )}
            <input
              type="file"
              id="cover-image"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
            {previewUrl && (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Cover"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-gray-800/50 rounded-full text-white hover:bg-gray-800/75"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Title Input */}
          <input
            type="text"
            placeholder="New post title here..."
            className="w-full text-3xl lg:text-5xl font-extrabold mb-4 border-none outline-none text-gray-800 placeholder-zinc-600 font-sans"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 rounded-md px-2 py-1"
              >
                <span className="text-gray-700 text-sm">#{tag}</span>
                <button
                  onClick={() => handleDeleteTag(tag)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="flex items-center">
              <span className="text-zinc-700 mr-1">#</span>
              <input
                type="text"
                placeholder="Add upto 4 tags"
                className="border-none outline-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full p-2 mb-4 border border-gray-300 rounded-md text-gray-700"
          >
           {["Technology", "Programming", "Design", "Career", "Other", "Finance", "Health", "Travel", "Lifestyle"].map((category) => (
             <option key={category} value={category}>{category}</option>
           ))}
          </select>

          {/* Editor */}
          <div className="min-h-[240px]">
            <Editor
              value={formData.content}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, content: value }))
              }
            />
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 lg:left-[7.325rem] md:left-10 right-0 p-4 mt-5">
          <div className=" mx-auto flex items-center gap-4">
            <button
              onClick={createNewPost}
              disabled={loading}
              className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 disabled:bg-gray-300"
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
      <div className="w-[35%] p-10 hidden lg:block">
        <h2 className="text-lg font-semibold mb-4">Markdown Instructions</h2>
        <p>Use Markdown syntax to format your post:</p>
        <div className="w-full bg-gray-50 p-2 rounded-md font-mono font-normal table-auto my-2 overflow-auto">
          <table className="p-3">
            <thead>
              <tr>
                <th>Format</th>
                <th>Markdown Syntax</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>**Bold**</td>
                <td>Surround text with `**`</td>
              </tr>
              <tr>
                <td>*Italic*</td>
                <td>Surround text with `*`</td>
              </tr>
              <tr>
                <td>[Link](http://example.com)</td>
                <td>`[Link](http://example.com)`</td>
              </tr>
              <tr>
                <td>Lists</td>
                <td>Use `-` or `+` for unordered lists, and `1.` for ordered lists</td>
              </tr>
              <tr>
                <td>Headers</td>
                <td>Use `#` for headings, with the number of `#` indicating the level</td>
              </tr>
              <tr>
                <td>Code</td>
                <td>Surround code with backticks ``</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
