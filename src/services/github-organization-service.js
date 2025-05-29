/**
 * Service for fetching data related to GitHub organizations using the official GitHub REST API.
 * Contains functions for retrieving organizations and their repositories.
 *
 * @module githubOrganizationService
 */

/**
 * Fetches the list of organizations the authenticated user belongs to.
 * @async
 * @param {string} token - A valid GitHub Personal Access Token for authentication.
 * @returns {Promise<Object[]>} A list of organization objects.
 * @throws {Error} If the API call fails.
 */
export async function fetchUserOrganizations(token) {
  const response = await fetch('https://api.github.com/user/orgs', {
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

/**
 * Fetches repositories for a given organization, handling pagination to retrieve all repositories.
 * @async
 * @param {string} org - The organization login name.
 * @param {string} token - A valid GitHub Personal Access Token for authentication.
 * @returns {Promise<Object[]>} A list of all repository objects.
 * @throws {Error} If the API call fails.
 */
export async function fetchOrganizationRepositories(org, token) {
  let allRepos = [];
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const response = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=100&page=${page}`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied. You do not have permission to view repositories for this organization.');
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    const repos = await response.json();
    allRepos = allRepos.concat(repos);
    hasMore = repos.length === 100;
    page++;
  }
  return allRepos;
}

/**
 * Fetches all organizations the authenticated user belongs to, handling pagination.
 * @async
 * @param {string} token - A valid GitHub Personal Access Token for authentication.
 * @returns {Promise<Object[]>} A list of all organization objects.
 * @throws {Error} If the API call fails.
 */
export async function fetchAllUserOrganizations(token) {
  let orgs = [];
  let url = 'https://api.github.com/user/orgs?per_page=100';
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
    const pageOrgs = await response.json();
    orgs = orgs.concat(pageOrgs);
    // Parse Link header for pagination
    const linkHeader = response.headers.get('Link');
    if (linkHeader) {
      const match = linkHeader.match(/<([^>]+)>; rel="next"/);
      url = match ? match[1] : null;
    } else {
      url = null;
    }
  }
  return orgs;
}
