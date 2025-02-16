import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ConfigProvider, Button, theme, Layout } from "antd";
import KanbanBoard from "./pages/KanbanBoard";

const { Header, Content } = Layout;

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const { darkAlgorithm, defaultAlgorithm } = theme;

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Header style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button onClick={toggleTheme}>
              {isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
            </Button>
          </Header>

          <Content>
            <Routes>
              <Route path="/" element={<KanbanBoard />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;