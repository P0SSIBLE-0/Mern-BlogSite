import {useEffect, useState} from 'react'
import {Navigate, useParams} from "react-router-dom";
import Editor from '../components/Editor';
import toast from 'react-hot-toast';

export default function EditPage() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect , setRedirect] = useState(false);
  const {id} = useParams();

  useEffect(() => {
    fetch('http://localhost:3000/post/'+ id).then((response) =>{
      response.json().then(data =>{
        setTitle(data.title);
        setSummary(data.summary);
        setContent(data.content);
      })
    })
  }, []);

  async function updatePost(e){
    e.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if(files?.[0]){
      data.set('file', files[0]); 
    }
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/post',{
      method: 'PUT',
      body : data,
      headers: {
        Authorization: `${token}`, // Send token in header
      },
    })
    if(response.ok){
      toast.success("Post has been uploaded!")
      setRedirect(true);
    }
    toast.error("something went wrong! try again")
  }

  if(redirect){
    return <Navigate to={`/post/${id}`} />
  }
  return (
    <form className="flex flex-col p-4" onSubmit={updatePost}>
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
      <button className="p-2 font-semibold bg-slate-500 text-white my-4 w-32 rounded hover:bg-slate-800">Update Post</button>
    </form>
  )
}
