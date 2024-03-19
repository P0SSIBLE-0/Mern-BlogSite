import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../userContext/UserContext";
import Loading from '../components/Loader';
import { Pencil , Trash} from "lucide-react";
import toast from "react-hot-toast";
import config from "../../config";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState({});
  const { id } = useParams();
  const { userInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [loading , setLoading] = useState(true);

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
        toast.success("Post deleted!")
        setRedirect(true)
      } else {
        console.error(`Failed to delete post. Status: ${response.status}`);
        toast.error("something went wrong!")
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("something went wrong!")
    }
  }
  if(redirect){
    return <Navigate to={`/`} />
  }

  return (
    <> { loading ? <Loading/> : (
      <div>
        <div className="p-4 ">
          <div className="flex justify-center flex-col items-center my-2">
            <div className="space-x-5 my-2 text-center">
              <h1 className="text-4xl font-bold my-2 mx-4 p-4">{postInfo.title}</h1>
              {postInfo?.createdAt && (
                <span className="text-neutral-400">
                  {formatISO9075(new Date(postInfo.createdAt))}
                </span>
              )}
            </div>
            <span className=" font-semibold text-gray-700">
              by @{postInfo.author?.username}
            </span>
            <div className="flex mx-3 space-x-4">
              {(userInfo?.id === postInfo?.author?._id && userInfo !== null) && (
                <Link
                to={"/edit/" + id}
                className="py-2 w-20 text-white mt-2 rounded-md font-semibold bg-slate-700 inline-flex justify-center hover:bg-slate-900"
                >
                  <Pencil className="w-4 mx-1" />
                  Edit
                </Link>
              )}
              {(userInfo?.id === postInfo?.author?._id && userInfo !== null) && (
                <Link onClick={deletePost}
                className="py-2 w-24 text-white mt-2 rounded-md font-semibold bg-red-600 inline-flex justify-center hover:bg-red-700"
                >
                 <Trash className="w-4 mx-1"  />
                  Delete
                </Link>
              )}
            </div>
          </div>
          <img
            className="rounded my-4 m-auto w-full"
            src={`${postInfo.cover}`}
            alt=""
          />
          <div className="w-full p-2 m-auto">
            <div
              className="prose lg:prose-xl m-auto"
              dangerouslySetInnerHTML={{ __html: postInfo.content }}
            />
          </div>
        </div>
      </div>
  )}
    </>
  );
}
