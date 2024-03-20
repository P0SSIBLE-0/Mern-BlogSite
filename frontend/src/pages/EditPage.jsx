import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";
import toast from "react-hot-toast";
import config from "../../config";

export default function EditPage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { id } = useParams();
  const [loading , setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  // Function to handle image selection
  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setFiles([selectedFile]); // Store the selected file(s)

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Store the preview URL
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    fetch(`${config.server_url}/post/${id}`).then((response) => {
      response.json().then((data) => {
        setTitle(data.title);
        setSummary(data.summary);
        setContent(data.content);
        setPreviewUrl(data.cover);
      });
    });
  }, []);

  async function updatePost(e) {
    e.preventDefault();
    const data = new FormData();
    setLoading(true);
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files[0]);
    }
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${config.server_url}/post`, {
        mode: 'no-cors',
        method: "PUT",
        body: data,
        headers: {
          Authorization: `${token}`, // Send token in header
        },
      });
      if (response.ok) {
        setLoading(false);
        toast.success("Post has been uploaded!");
        setRedirect(true);
      }
    } catch (err) {
      setLoading(false);
      toast.error("something went wrong! try again");
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }
  return (
    <form className="flex flex-col p-4" onSubmit={updatePost}>
      <input
        className="p-2 my-2 border-2 border-neutral-400 rounded"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        className="p-2 my-3 border-2 border-neutral-400 rounded"
        type="text"
        placeholder="summary"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <div>
        <div className="">
          <div className="flex flex-wrap">
            {previewUrl && (
              <img
                className="p-2 rounded-lg"
                src={`${previewUrl}`}
                alt="Selected"
                style={{ maxWidth: "100%", maxHeight: "130px" }}
              />
            )}
            <input
              className="p-2 my-3 border-2 border-neutral-400 rounded"
              type="file"
              onChange={handleImageChange}
            />
          </div>
          <span className="p-2 my-2 text-sm text-red-400" >Image size should be under 4.5Mb</span>
        </div>
      </div>
      <Editor value={content} onChange={setContent} />
      <button className="p-2 font-semibold bg-slate-500 text-white my-4 w-40 rounded hover:bg-slate-800 text-center inline-flex justify-center"><img className={`size-6 ${loading?'block': 'hidden'}`} src="https://i.gifer.com/ZKZg.gif" alt="" />
        Update Post
      </button>
    </form>
  );
}
