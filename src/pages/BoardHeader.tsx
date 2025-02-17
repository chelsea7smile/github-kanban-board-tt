import React, { useEffect, useState } from "react";
import { Typography, Input, Button, Select } from "antd";
import { RepoInfo } from "../types/RepoInfo";
import { BoardHeaderProps } from "../types/BoardHeaderProps";

const { Title, Text, Link } = Typography;
const { Option } = Select;

const capitalize = (s: string): string =>
  s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s;

const BoardHeader: React.FC<BoardHeaderProps> = ({
  repoUrl,
  setRepoUrl,
  loading,
  onLoadIssues,
}) => {
  const [savedRepos, setSavedRepos] = useState<string[]>([]);
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);

  useEffect(() => {
    const prefix = "kanban_issues_";
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith(prefix)
    );
    const repos = keys.map(
      (key) => "https://github.com/" + key.substring(prefix.length)
    );
    setSavedRepos(repos);
  }, []);

  useEffect(() => {
    const fetchRepoInfo = async () => {
      try {
        const parts = repoUrl.split("/");
        if (parts.length < 5) {
          setRepoInfo(null);
          return;
        }
        const owner = parts[3];
        const repo = parts[4];
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        const headers: HeadersInit = token ? { Authorization: `token ${token}` } : {};
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
        if (!res.ok) {
          setRepoInfo(null);
          return;
        }
        const data = await res.json();
        setRepoInfo({
          ownerLogin: owner,
          ownerUrl: `https://github.com/${owner}`,
          repoHtmlUrl: data.html_url,
          stars: data.stargazers_count,
        });
      } catch (error) {
        console.error("Failed to fetch repo info:", error);
        setRepoInfo(null);
      }
    };

    if (repoUrl.startsWith("https://github.com/")) {
      fetchRepoInfo();
    } else {
      setRepoInfo(null);
    }
  }, [repoUrl]);

  const handleRepoSelect = (value: string) => {
    setRepoUrl(value);
  };

  const repoName = capitalize(repoUrl.split("/").pop() || "");

  const formattedStars =
    repoInfo && repoInfo.stars >= 1000
      ? `${Math.round(repoInfo.stars / 1000)}K`
      : repoInfo
      ? repoInfo.stars.toString()
      : "";

  return (
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <Title level={2}>GitHub Kanban Board</Title>

      <Select
        placeholder="Choose a saved GitHub repo"
        style={{ width: 300, marginBottom: 10 }}
        onChange={handleRepoSelect}
        value={repoUrl || undefined}
      >
        {savedRepos.map((repo) => (
          <Option key={repo} value={repo}>
            {repo}
          </Option>
        ))}
      </Select>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: 10
        }}
      >
        <div data-cy="repo-url-input">
          <Input
            placeholder="Enter GitHub repo URL (e.g. https://github.com/facebook/react)"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
        </div>
        <div data-cy="load-issues-btn">
          <Button
            
            type="primary"
            onClick={onLoadIssues}
            loading={loading}
          >
            {loading ? "Loading..." : "Load Issues"}
          </Button>
        </div>
      </div>

      {repoInfo && (
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <Text>
            <Link href={repoInfo.ownerUrl} target="_blank">
              {capitalize(repoInfo.ownerLogin)}
            </Link>{" "}
            &gt;{" "}
            <Link href={repoInfo.repoHtmlUrl} target="_blank">
              {repoName}
            </Link>
          </Text>
          <Text>
          ⭐ {formattedStars} stars
          </Text>
        </div>
      )}
    </div>
  );
};

export default BoardHeader;