const GITHUB_API_URL = 'https://api.github.com/repos';

export const fetchIssues = async (repoUrl: string) => {
  const repoPath = extractRepoPath(repoUrl);
  const response = await fetch(`${GITHUB_API_URL}/${repoPath}/issues`);
  if (!response.ok) {
    throw new Error('Failed to fetch issues');
  }
  return response.json();
};

export const fetchRepoInfo = async (repoUrl: string) => {
  const repoPath = extractRepoPath(repoUrl);
  const response = await fetch(`${GITHUB_API_URL}/${repoPath}`);
  if (!response.ok) {
    throw new Error('Failed to fetch repository info');
  }
  return response.json();
};

const extractRepoPath = (repoUrl: string): string => {
  return repoUrl.replace('https://github.com/', '');
};