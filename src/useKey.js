import { useEffect } from "react";

// For performing some action on pressing a key -
// Exiting upon pressing Esckey -
export function useKey(key, action) {
  useEffect(
    function () {
      const callback = function (e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      };

      document.addEventListener("keydown", callback);

      // cleanup function
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [key, action]
  );
}
