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
 * Fetches repositories for a given organization.
 * @async
 * @param {string} org - The organization login name.
 * @param {string} token - A valid GitHub Personal Access Token for authentication.
 * @returns {Promise<Object[]>} A list of repository objects.
 * @throws {Error} If the API call fails.
 */
export async function fetchOrganizationRepositories(org, token) {
  const response = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=100`, {
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
