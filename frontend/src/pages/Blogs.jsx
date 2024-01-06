import { useEffect, useState } from 'react';
import  Post from '../components/Card';
import Loading from '../components/Loader';
export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  async function getPosts() {
    try {
      const response = await fetch('http://localhost:3000/posts');
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Handle the error appropriately (e.g., display an error message)
    }
  }
  useEffect(() => {
    getPosts();
  }, [])
  return (
    <div className='my-4'>
      {loading ? <Loading/> :
      (
        posts.length > 0 && posts.map(post => ( <Post key={post._id} {...post}/>))
      )
      }
    </div>
  )
}
