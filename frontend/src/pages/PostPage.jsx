import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../userContext/UserContext";
import Loading from "../components/Loader";
import { Clock, Pencil, Trash, User } from "lucide-react";
import toast from "react-hot-toast";
import config from "../../config";
import ReactMarkdown from 'react-markdown';

export default function PostPage() {
  const [postInfo, setPostInfo] = useState({});
  const { id } = useParams();
  const { userInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get the current post data
    const fetchPost = async () => {
      try {
        const response = await fetch(`${config.server_url}/post/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPostInfo(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error.message);
      }
    };

    fetchPost();
  }, [id]);

  async function deletePost() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${config.server_url}/post/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        toast.success("Post deleted!");
        setRedirect(true);
      } else {
        console.error(`Failed to delete post. Status: ${response.status}`);
        toast.error("something went wrong!");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("something went wrong!");
    }
  }
  if (redirect) {
    return <Navigate to={`/`} />;
  }

  return (
    <>
      {" "}
      {loading ? (
        <Loading />
      ) : (
        <div className="lg:max-w-screen-lg mx-auto">
          <div className="p-4">
            <div className="flex justify-center flex-col items-center my-2">
              <div className="flex flex-wrap w-full gap-2">
                {postInfo.tags.map((tag) => (
                  <span key={tag} className="text-sm font-semibold bg-gray-300 text-gray-500 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="lg:text-5xl text-4xl font-extrabold my-5  leading-tight text-start">
                {postInfo.title}
              </h1>
              <div className="flex flex-col w-full md:flex-row lg:flex-row justify-between items-center gap-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock  className="text-neutral-700 size-5"/>
                  <span className="text-neutral-600">
                    {format(new Date(postInfo.createdAt), 'MMM dd, yyyy')}
                  </span>
                  <span className="font-semibold text-neutral-700 flex items-center text-sm">
                    <User className="mr-1 size-5"/>
                    By @{postInfo.author?.username}
                  </span>
                </div>

                <div className="mx-3 space-x-4">
                  {userInfo?.id === postInfo?.author?._id &&
                    userInfo !== null && (
                      <Link
                        to={"/edit/" + id}
                        className="py-1 w-20 text-white mt-2 rounded-md font-semibold border-2 border-zinc-700 bg-zinc-700 inline-flex justify-center hover:bg-slate-900"
                      >
                        <Pencil className="w-4 mx-1" />
                        Edit
                      </Link>
                    )}
                  {userInfo?.id === postInfo?.author?._id &&
                    userInfo !== null && (
                      <Link
                        onClick={deletePost}
                        className="py-1 w-24 mt-2 rounded-md font-semibold border-2 border-red-500 text-red-500 inline-flex justify-center hover:bg-red-500 hover:text-white"
                      >
                        <Trash className="w-4 mx-1" />
                        Delete
                      </Link>
                    )}
                </div>
              </div>
            </div>
            <img
              className="rounded my-4 m-auto w-full shadow-md"
              src={`${postInfo.cover}`}
              alt=""
            />
            <div className="w-full max-w-[1000px] mt-10">
              <ReactMarkdown 
                className="prose prose-slate lg:prose-lg mx-auto w-full"
              >
                {postInfo.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
