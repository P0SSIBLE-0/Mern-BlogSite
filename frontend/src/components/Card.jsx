import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom' 
import {format} from 'date-fns';

export default function Card({_id,title, summary, cover, createdAt, author}) {
  function truncateString(inputString) {
    const wordsArray = inputString.split(' ');
    const truncatedWords = wordsArray.slice(0, Math.min(50, wordsArray.length));
    const truncatedString = truncatedWords.join(' ');
    if (wordsArray.length > truncatedWords.length) {
      return truncatedString + '...';
    }
    return truncatedString;
  }
  
  
  return (
    <div className="flex min-w-[800px] max-w-2xl flex-col gap-2 items-center rounded-md md:flex-row mx-2 mb-4 md:mx-auto lg:m-auto lg:mb-4">
      <div className="h-32 w-full md:h-[250px] md:w-[450px]">
        <Link to={`/post/${_id}`}>
          <img
            src={`http://localhost:3000/${cover}`}
            alt="Laptop"
            className="h-full w-full object-cover"
          />
        </Link>
      </div>
      <div className='w-1/2'>
        <div className="p-4 max-w-96">
          <Link to={`/post/${_id}`}>
            <h1 className="inline-flex items-center text-lg font-semibold hover:underline">
              {title} <ArrowUpRight className="ml-2 h-4 w-4" />
            </h1>
          </Link>
          <p className='text-sm text-neutral-600'><span className='font-semibold'>{author?.username} |</span> <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time></p>
          <p className="mt-3 text-sm text-gray-600">
            {truncateString(summary)}
          </p>
        
        </div>
      </div>
    </div>
  )
}
