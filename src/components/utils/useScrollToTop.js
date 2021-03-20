import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ページ遷移時に自動でトップにスクロールさせるためのフック
 */
export default function useScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}