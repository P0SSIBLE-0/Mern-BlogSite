import { useEffect, useState } from "react";
import {Navigate} from "react-router-dom";
import Editor from "../components/Editor";
import toast from "react-hot-toast";
import config from "../../config";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect , setRedirect] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading , setLoading] = useState(false)

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

  async function createNewPost(ev){
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]); 
    
    setLoading(true);
    const token = localStorage.getItem("token");
    if(!token) return;
    const response = await fetch(`${config.server_url}/post`, {
      method: 'POST',
      body: data,
      headers: {
        Authorization: `${token}`,
      },
    })
    if(response.ok){
      setLoading(false);
      setRedirect(true);
      toast.success("Post has been created successfully")
    }
  }
  if(redirect){
    return <Navigate to={'/'}/>
  }
  return (
    <form className="flex flex-col p-4" onSubmit={createNewPost}>
      <input className="p-2 my-2 border-2 border-neutral-400 rounded" 
      type="text" 
      placeholder="Title"
      value={title}
      onChange={ev => setTitle(ev.target.value)}
      />
      <input className="p-2 my-3 border-2 border-neutral-400 rounded" 
      type="text"  
      placeholder="summary" 
      value={summary}
      onChange={ev => setSummary(ev.target.value)}
      />
       <div className="flex flex-wrap">
          {files && (
            <img
              className="p-2 rounded-xl max-w-full max-h-full lg:w-120px  md:100px"
              src={previewUrl}
              alt="Selected"
            />
          )}
          <input
            className="p-2 my-3 border-2 border-neutral-400 rounded"
            type="file"
            onChange={handleImageChange}
          />
          <span className="p-2 lg:my-2 text-sm text-red-400" >Image size should be under 4.5Mb</span>
        </div>
      <Editor value={content} onChange={setContent}/>
      <button className="p-2 font-semibold bg-slate-500 text-white my-4 w-40 rounded hover:bg-slate-800 inline-flex gap-2 text-center justify-center"> <img className={`size-6 ${loading?'block': 'hidden'}`} src="https://i.gifer.com/ZKZg.gif" alt="" />Create Post</button>
    </form>
  );
}
