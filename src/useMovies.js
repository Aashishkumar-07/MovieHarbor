import { useState, useEffect } from "react";

const key = "ac27c604";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  // Loading spinner - when data is fetched (Network - 3G slow)
  const [isLoading, setIsLoading] = useState(false);
  //  When user goes offline
  const [error, setError] = useState("");

  useEffect(
    function () {
      // To prevent race condition in search bar- cleanUp function
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(""); //Setting Error Message as Empty String
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          console.log(data);

          // When the query/movie searched is not is not in the API
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
        } catch (err) {
          console.log(err.message);

          // To prevent race condition
          if (err.name === "AbortError") return;
          // When user goes offline
          if (err.message === "Failed to fetch")
            setError("Something went wrong with fetching movies");
          else setError(err.message);
        } finally {
          // Whatever may happen , In the end loading should be set to false finally .If we put it in try block and if any error gets thrown then we may not set setIsLoading as false
          setIsLoading(false);
        }

        if (!query.length) {
          setMovies([]);
          setError("");
          return;
        }
      }

      fetchMovies();
      // Cleanup function - To prevent race condition in search bar
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
