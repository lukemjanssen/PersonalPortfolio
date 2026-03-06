import { useState, useEffect } from 'react';
import axios from 'axios';

/* Fetches public repos for a GitHub username, sorted by stars */
export function useGitHubRepos(username) {
  const [repos, setRepos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!username) return;
    axios
      .get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
      .then(({ data }) => {
        const sorted = data
          .filter((r) => !r.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 12);
        setRepos(sorted);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [username]);

  return { repos, loading, error };
}
