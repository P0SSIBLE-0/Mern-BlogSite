import { useState } from "react";
import {Navigate} from "react-router-dom";
import Editor from "../components/Editor";
import toast from "react-hot-toast";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect , setRedirect] = useState(false);

  async function createNewPost(ev){
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]); 
    
    const token = localStorage.getItem("token");
    if(!token) return;
    const response = await fetch('http://localhost:3000/post', {
      method: 'POST',
      body: data,
      headers: {
        Authorization: `${token}`,
      },
    })
    if(response.ok){
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
      <input className="p-2 my-3 border-2 border-neutral-400 rounded" 
      type="file"
      onChange={ev => setFiles(ev.target.files)}
       />
      <Editor value={content} onChange={setContent}/>
      <button className="p-2 font-semibold bg-slate-500 text-white my-4 w-32 rounded hover:bg-slate-800">Create Post</button>
    </form>
  );
}
