import React from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../util/ThemeContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

const LayoutContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useTheme();
  const location = useLocation();

  const isPublicPage = location.pathname.startsWith(
    "/beyond-resume-publicjobdetails"
  );

  return (
    <div
      className="layout-wrapper"
      style={{
        display: "flex",
        background: theme === "dark" ? "#082028" : "#e3ecf5",
        color: theme === "dark" ? "white" : "black",
        maxWidth: "100vw",
      }}
    >
      <img
        src={
          theme === "dark" ? "/assets/Ellipse 7.png" : "/assets/Ellipse 7.1.png"
        }
        alt="Loading illustration"
        style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -30%)",
          width: "100%",
          maxHeight: "100vh",
        }}
      />
      {!isPublicPage && <Sidebar />}
      <div
        className="main-content"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "transparent",
          paddingLeft: isPublicPage ? 0 : 60,
        }}
      >
        <Header />
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

export default LayoutContainer;
