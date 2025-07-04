import React from "react";

interface TitleHeaderProps {
  title: string;
  style?: React.CSSProperties;
}

const TitleHeader: React.FC<TitleHeaderProps> = ({ title, style }) => {
  const combinedStyle: React.CSSProperties = {
    marginBottom: "20px",
    borderRadius: "10px",
    ...style,
  };

  return (
    <div style={combinedStyle} className="my_team_header">
      {title}
    </div>
  );
};

export default TitleHeader;
