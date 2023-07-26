const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center w-full fixed top-0 right-0 bottom-0 left-0 z-[200]">
      <div className="w-14 h-14 animate-spin border-[10px] border-[#f3f3f3] border-t-[10px] border-t-[#383636] rounded-full"></div>
    </div>
  );
};

export default LoadingSpinner;
