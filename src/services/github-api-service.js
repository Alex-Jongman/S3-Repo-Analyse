/**
 * Service for fetching data from the GitHub API.
 * Contains functions for retrieving repositories, user information, etc.
 *
 * @module githubApiService
 */

/**
 * Fetches repository information for a user via the GitHub REST API.
 * @async
 * @param {string} username - The username whose repositories will be fetched.
 * @param {string} token - A valid GitHub Personal Access Token for authentication.
 * @returns {Promise<Object[]>} A list of repository objects.
 * @throws {Error} If the API call fails.
 */
export async function fetchUserRepositories(username, token) {
  const response = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}
