import { useEffect, useState } from "react";
import Post from "../components/Card";
import Loading from "../components/Loader";
import config from "../../config";
export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  async function getPosts() {
    try {
      const response = await fetch(`${config.server_url}/posts`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Handle the error appropriately (e.g., display an error message)
    }
  }
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <div className="my-4 lg:max-w-screen-lg mx-auto">
      {/* <HeroSection /> */}
      <h1 className="text-3xl font-extrabold mb-10 lg:text-[3rem] lg:ml-16 lg:mb-10 my-2 ml-4">Blogs</h1>

      {loading ? (
        <Loading />
      ) : (
        posts.length > 0 &&
        posts.map((post) => <Post key={post._id} {...post} loading={loading} />)
      )}
      {!loading && posts.length === 0 && (
        <p className="text-2xl font-semibold text-center">No posts found</p>
      )}
    </div>
  );
}
