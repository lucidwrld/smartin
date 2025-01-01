import React, { useRef, useCallback, useState, useEffect } from "react";

const InfiniteScroll = ({
  data = [],
  pagination = {},
  isLoading = false,
  fetchNextPage,
  currentPage,
  setCurrentPage,
  renderItem,
}) => {
  const observer = useRef();
  const [allData, setAllData] = useState([]);
  const [isFetchingNext, setIsFetchingNext] = useState(false);

  useEffect(() => {
    if (data?.length) {
      setAllData((prev) => [...prev, ...data]);
    }
  }, [data]);

  const lastItemRef = useCallback(
    (node) => {
      if (isFetchingNext || !pagination?.nextPage) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        async (entries) => {
          if (entries[0].isIntersecting && pagination?.nextPage) {
            setIsFetchingNext(true);
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            await fetchNextPage(nextPage);
            setIsFetchingNext(false);
          }
        },
        { threshold: 0.75 }
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [
      isFetchingNext,
      pagination?.nextPage,
      fetchNextPage,
      currentPage,
      setCurrentPage,
    ]
  );

  if (!data?.length && !allData?.length && isLoading) {
    return (
      <div className="w-full p-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {allData.map((item, index) => (
        <div
          key={index}
          ref={index === allData.length - 1 ? lastItemRef : null}
          className="opacity-100 transition-opacity"
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};

export default InfiniteScroll;
