import {
  faCog,
  faFileAlt,
  faFlag,
  faGift,
  faHeadset,
  faNewspaper,
  faPeopleGroup,
  faShieldAlt,
  faSignInAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
} from "@mui/material";
import { useHistory } from "react-router";
import { handleNavClick } from "../../util/CommonFunctions";

const MenuHoverItem = ({
  isLogout,
  anchorEl,
  onClose,
}: {
  isLogout: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}) => {
  const history = useHistory();
  const open = Boolean(anchorEl);

  const hoverItems = [
    {
      title: isLogout ? "Logout" : "Login",
      icon: faSignInAlt,
      url: "/login",
    },
    ...(isLogout
      ? [
          { title: "Account", icon: faCog, url: "/account" },
          { title: "Referral", icon: faGift, url: "/referral" },
        ]
      : []),
    { title: "Contact Us", icon: faHeadset, url: "/contact-us" },
    { title: "Register Complaint", icon: faFlag, url: "/complaint-register" },
    { title: "About Us", icon: faUsers, url: "/about-us" },
    { title: "Our Team", icon: faPeopleGroup, url: "/our-team" },
    { title: "Privacy Policy", icon: faShieldAlt, url: "/privacy-and-policy" },
    {
      title: "Terms and Conditions",
      icon: faFileAlt,
      url: "/terms-and-conditions",
    },
    {
      title: "Anti Discrimination Policy",
      icon: faNewspaper,
      url: "/anti-discrimination-policy",
    },
  ];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Card sx={{ minWidth: 250, bgcolor: "#0a5c6b", color: "white" }}>
        <List>
          {hoverItems.map((item, index) => (
            <ListItem
              sx={{ "& .MuiListItemIcon-root": { minWidth: "30px" } }}
              key={index}
              onClick={() => {
                handleNavClick(history, () => {}, item.url);
                onClose();
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <FontAwesomeIcon icon={item.icon} />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </Card>
    </Popover>
  );
};

export default MenuHoverItem;
