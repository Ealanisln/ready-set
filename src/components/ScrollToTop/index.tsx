import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const updateBannerHeight = () => {
      const banner = document.querySelector('.fixed.bottom-0');
      if (banner) {
        setBannerHeight(banner.clientHeight);
      } else {
        setBannerHeight(0);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    window.addEventListener("resize", updateBannerHeight);
    updateBannerHeight(); // Initial check

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      window.removeEventListener("resize", updateBannerHeight);
    };
  }, []);

  return (
    <div 
      className="fixed right-8 z-[999] transition-all duration-300 ease-in-out"
      style={{ bottom: `${bannerHeight + 32}px` }} // 32px (8 * 4) for the original bottom-8
    >
      {isVisible && (
        <div
          onClick={scrollToTop}
          aria-label="scroll to top"
          className="back-to-top flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-primary text-white shadow-md transition duration-300 ease-in-out hover:bg-dark"
        >
          <span className="mt-[6px] h-3 w-3 rotate-45 border-l border-t border-white"></span>
        </div>
      )}
    </div>
  );
}