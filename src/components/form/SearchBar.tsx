import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search Products",
  sx = {},
}) => {
  return (
    <TextField
      placeholder={placeholder}
      variant="outlined"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon
            //   style={{
            //     color: "#0a5c6b",
            //   }}
              icon={faSearch}
            />
          </InputAdornment>
        ),
        sx: {
          borderRadius: "44px",
          backgroundColor: "#f5f5f5",
        },
      }}
      sx={{
        width: "100%",
        m: "auto",
        "& .MuiOutlinedInput-root": {
          borderRadius: "44px",
          backgroundColor: "#f5f5f5",
          "&.Mui-focused fieldset": {
            borderColor: "#0a5c6b",
          },
        },
        "& .MuiOutlinedInput-input": {
          padding: "10px 14px",
        },
        ...sx,
      }}
    />
  );
};

export default SearchBar;
