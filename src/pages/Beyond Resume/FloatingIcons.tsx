import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faLaptopCode,
  faUserTie,
  faWrench,
  faChartLine,
  faTruck,
  faGraduationCap,
  faStethoscope,
  faHammer,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";

const icons = [
  faBriefcase,
  faLaptopCode,
  faUserTie,
  faWrench,
  faChartLine,
  faTruck,
  faGraduationCap,
  faStethoscope,
  faHammer,
  faPalette,
];

const colors = ["#4dccf5", "#5697fb", "#67cff7", "#1a3b70"];

const FloatingIcons: React.FC = () => {
  const iconRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const iconData = icons.map(() => ({
      top: Math.random() * 80 + 10,
      left: Math.random() * 80 + 10,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
    }));

    const animate = () => {
      iconData.forEach((icon, i) => {
        icon.top += icon.vy;
        icon.left += icon.vx;

        // Bounce off bounds (5% to 95%)
        if (icon.top < 5 || icon.top > 95) icon.vy *= -1;
        if (icon.left < 5 || icon.left > 95) icon.vx *= -1;

        const el = iconRefs.current[i];
        if (el) {
          el.style.transform = `translate(${icon.left}vw, ${icon.top}vh)`;
        }
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "90vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {icons.map((icon, index) => (
        <Box
          key={index}
          ref={(el: HTMLDivElement | null) => {
            if (el) iconRefs.current[index] = el;
          }}
          sx={{
            position: "absolute",
            willChange: "transform",
            zIndex: 1,
            opacity: 0.55,
            background: colors[index % colors.length],
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "30px",
            height: "30px",
            padding: "10px",
            fontSize: "24px",
            boxShadow: `-4px -4px 10px rgba(253, 253, 253, 0.59) inset, 0px 0px 20px rgba(0, 0, 0, 0.19) `,
            pointerEvents: "none",
            transform: "translate(0, 0)",
          }}
        >
          <FontAwesomeIcon icon={icon} color="white" />
        </Box>
      ))}
    </Box>
  );
};

export default FloatingIcons;
