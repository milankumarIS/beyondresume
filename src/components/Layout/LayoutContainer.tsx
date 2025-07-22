import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import color from "../../theme/color";
import { useTheme } from "../util/ThemeContext";

const LayoutContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className="layout-wrapper"
      style={{
        display: "flex",
        background: theme === "dark" ? color.newbg : "white",
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
      <Sidebar />
      <div
        className="main-content"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "transparent",
          paddingLeft: 60,
        }}
      >
        <Header />
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

export default LayoutContainer;
