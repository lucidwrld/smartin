"use client";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import Loader from "./Loader";
const InfiniteScroll = ({
  currentPage,
  nextPage,
  isLoading,
  onLoadMore,
  children,
}) => {
  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView && nextPage !== null && !isLoading) {
      onLoadMore();
    }
  }, [inView, nextPage, isLoading]);

  return (
    <>
      {children}
      {nextPage !== null && (
        <div ref={ref} className="py-4 flex justify-center">
          {isLoading && <Loader />}
        </div>
      )}
    </>
  );
};

export { InfiniteScroll };
