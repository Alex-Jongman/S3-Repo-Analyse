// filepath: src/services/github-pull-request-service.js
/**
 * Service for fetching pull requests for a given repository from the GitHub API.
 *
 * @module githubPullRequestService
 */

/**
 * Fetches pull requests for a given repository in an organization.
 * @async
 * @param {string} org - The organization login name.
 * @param {string} repo - The repository name.
 * @param {string} token - A valid GitHub Personal Access Token for authentication.
 * @returns {Promise<Object[]>} A list of pull request objects.
 * @throws {Error} If the API call fails.
 */
export async function fetchRepositoryPullRequests(org, repo, token) {
  const response = await fetch(`https://api.github.com/repos/${org}/${repo}/pulls?per_page=100`, {
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
