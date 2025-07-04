import React, { useState, useRef } from 'react';
import {
  TextField,
  Popper,
  Paper,
  MenuItem,
  ClickAwayListener,
  Box
} from '@mui/material';

interface CountrySelectOption {
  name: string;
}

interface CountrySelectWithSearchProps {
  label: string;
  options: CountrySelectOption[];
  defaultValue?: string;
  onSelectionChange: (value: string) => void;
}

const CountrySelectWithSearch: React.FC<CountrySelectWithSearchProps> = ({
  label,
  options,
  defaultValue,
  onSelectionChange
}) => {
  const [searchTerm, setSearchTerm] = useState(defaultValue || '');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedValue, setSelectedValue] = useState(defaultValue || '');
  const textFieldRef = useRef<HTMLElement | null>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setAnchorEl(textFieldRef.current);
  };

  const handleOptionClick = (optionName: string) => {
    setSelectedValue(optionName);
    setSearchTerm(optionName);
    onSelectionChange(optionName);
    setAnchorEl(null);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        <TextField
          inputRef={textFieldRef}
          label={`Search & select ${label}`}
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          autoComplete="off"
        />

        <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start" style={{ zIndex: 1 }}>
          <Paper>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <MenuItem
                  key={option.name as React.Key}  // Assert the type here
                  onClick={() => handleOptionClick(option.name)}
                >
                  {option.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No options available</MenuItem>
            )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default CountrySelectWithSearch;
