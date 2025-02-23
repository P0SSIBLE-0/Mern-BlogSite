import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Skeleton from "./Skeleton";

export default function Card({
  _id,
  title,
  summary,
  cover,
  createdAt,
  author,
  tags = [],
  category = "",
  loading,
}) {
  function truncateString(inputString, wordLimit = 25) {
    const wordsArray = inputString.split(" ");
    const truncatedWords = wordsArray.slice(0, Math.min(wordLimit, wordsArray.length));
    const truncatedString = truncatedWords.join(" ");
    if (wordsArray.length > truncatedWords.length) {
      return truncatedString + "...";
    }
    return truncatedString;
  }
  function getRandomTextColor() {
    const textColors = ["text-blue-500", "text-red-500", "text-green-500", "text-yellow-500", "text-purple-500"];
    return textColors[Math.floor(Math.random() * textColors.length)];
  }
  function getRandomBgColor() {
    const bgColor = ["bg-blue-500", "bg-red-500", "bg-green-500", "bg-yellow-400", "bg-purple-500, bg-lime-500, bg-indigo-500", "bg-pink-500", "bg-cyan-500"];
    return bgColor[Math.floor(Math.random() * bgColor.length)];
  }
  const getThumbnailImg = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    // Split URL to insert transformation parameters
    const parts = url.split('/upload/');
    
    // Add transformation parameters:
    // c_scale - Scale the image
    // w_800 - Set maximum width to 800px
    // q_auto - Automatic quality optimization
    // f_auto - Automatic format selection based on browser support
    return `${parts[0]}/upload/c_scale,w_800,q_auto,f_auto/${parts[1]}`;
  };
  return loading ? (
    <Skeleton />
  ) : (
    <article className="group relative bg-gray-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden max-w-[900px] mx-2 mb-6 md:mx-6 lg:mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Image Container */}
        <div className="md:col-span-5 h-64 md:h-full min-h-[270px] relative overflow-hidden p-3">
          <Link to={`/post/${_id}`}>
          <div className="w-full h-full relative overflow-hidden rounded-md  shadow-md">

            <img
              src={getThumbnailImg(cover)}
              onError={(e) =>
                (e.target.src = `https://blog.kanalysis.com/wp-content/uploads/2023/01/placeholder-116.png`)
              }
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-md"
              />
              </div>
            {category && (
              <span className={`absolute top-4 left-4 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-200 ${getRandomBgColor()} hover:opacity-75`}>
                {category}
              </span>
            )}
          </Link>
        </div>

        {/* Content Container */}
        <div className="md:col-span-7 px-6 pt-4 flex flex-col h-full pb-5">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={`inline-block rounded-lg px-3 py-1 text-gray-500 bg-neutral-300/80 hover:bg-zinc-500 transition-colors duration-200 font-semibold hover:text-gray-200 text-xs`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <Link to={`/post/${_id}`}>
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 flex items-start">
              {truncateString(title, 10)}
              <ArrowUpRight className="ml-1 h-5 w-5 inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </h2>
          </Link>

          {/* Summary */}
          <p className="text-gray-600 mb-4 flex-grow">
            {truncateString(summary)}
          </p>

          {/* Author and Date */}
          <div className="flex items-center mt-auto">
            <div className={`h-10 w-10 rounded-full overflow-hidden ${getRandomBgColor()} `}>
              {author?.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-white font-semibold text-lg">
                  {author?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {author?.username}
              </p>
              <time className="text-xs text-gray-500">
                {format(new Date(createdAt), "MMM d, yyyy")}
              </time>
            </div>
            <div className="ml-auto text-xs text-gray-500">
              {format(new Date(createdAt), "HH:mm")}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}