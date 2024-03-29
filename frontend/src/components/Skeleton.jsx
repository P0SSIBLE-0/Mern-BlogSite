function Skeleton() {
  return (
    <div class="flex max-w-[900px] flex-col gap-2 items-center rounded-xl md:flex-row mx-2 mb-4 md:mx-6 lg:m-auto lg:mb-4 animate-pulse bg-neutral-400/50 p-4 ">
      <div class="bg-neutral-400/50 w-full lg:w-1/2 h-44 animate-pulse rounded-md"></div>
      <div class="flex flex-col gap-2 w-full lg:w-1/2">
        <div class="bg-neutral-400/50 w-full h-5 animate-pulse rounded-md"></div>
        <div class="bg-neutral-400/50 w-full h-5 animate-pulse rounded-md"></div>
        <div class="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
        <div class="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
      </div>
    </div>
  );
}

export default Skeleton;
