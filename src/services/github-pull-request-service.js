// filepath: src/services/github-pull-request-service.js
/**
 * Service for fetching pull requests for a given repository from the GitHub API.
 *
 * @module githubPullRequestService
 */

/**
 * Fetches all pull requests for a given repository in an organization, handling pagination.
 * @async
 * @param {string} org - The organization login name.
 * @param {string} repo - The repository name.
 * @param {string} token - A valid GitHub Personal Access Token for authentication.
 * @param {Object} [options] - Optional query parameters (e.g., { state: 'all' })
 * @returns {Promise<Object[]>} A list of all pull request objects.
 * @throws {Error} If the API call fails.
 */
export async function fetchRepositoryPullRequests(org, repo, token, options = {}) {
  const params = new URLSearchParams({ per_page: '100', ...options });
  let url = `https://api.github.com/repos/${org}/${repo}/pulls?${params.toString()}`;
  let allPRs = [];
  while (url) {
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    const prs = await response.json();
    allPRs = allPRs.concat(prs);
    // Parse Link header for pagination
    const linkHeader = response.headers.get('Link');
    if (linkHeader) {
      const match = linkHeader.match(/<([^>]+)>; rel="next"/);
      url = match ? match[1] : null;
    } else {
      url = null;
    }
  }
  return allPRs;
}
