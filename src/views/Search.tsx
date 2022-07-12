import React from 'react';
import Box from '@mui/material/Box';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TextField from '@mui/material/TextField';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';

import { Header } from '../components';
import { getDrugs } from '../utils';

import type { Drug } from '../types';

// TODO breakout if reused
const SearchButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  color: theme.colors.primary,
}));

function Search() {
  const [searchText, setSearchText] = React.useState<string>('');
  const [drugs, setDrugs] = React.useState<Drug[]>([]);
  const [, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [noneFound, setNoneFound] = React.useState<boolean>(false);

  const anchorRef = React.useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setSearchText(event.target.value);
    setNoneFound(false);
  }

  const handleSearchClick = async (): Promise<void> => {
    if (!searchText) { return; }

    const drugs = await getDrugs(searchText);

    if (drugs.length) {
      setDrugs(drugs);
      setOpen(true);
    } else {
      const res = await fetch(`https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${searchText}`, {
        method: 'GET',
      })
      const data = await res.json();
      const firstSuggestion = data.suggestionGroup.suggestionList[0]?.suggestion || '';

      if (firstSuggestion) {
        const suggestedDrugs = await getDrugs(firstSuggestion);
        setDrugs(suggestedDrugs);
        setOpen(true);
      } else {
        setDrugs([]);
        setNoneFound(true);
        setOpen(false);
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrugClick = (drug: Drug) => {
    navigate(`/drugs/${encodeURIComponent(drug.name)}?rxcui=${drug.rxcui}&searchText=${searchText}`)
    handleClose();
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const handleSearchKey = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  }

  return (
    <Box>
      <Header />
      <Box sx={{ width: '70%', display: 'flex', margin: '20px auto 0', justifyContent: 'center', overflow: 'hidden', maxHeight: '500px' }} ref={anchorRef}>
        <TextField
          sx={{ width: '100%', marginTop: '10px' }}
          onChange={handleSearchChange}
          onFocus={(e) => setAnchorEl(e.currentTarget)}
          InputProps={{
            type: 'search',
          }}
          onKeyDown={handleSearchKey}
          label={noneFound ? 'None found' : undefined}
          error={noneFound}
          placeholder="Search by drug name (E.g. Lipitor)"
        />
        <SearchButton onClick={handleSearchClick}>
          <SearchRoundedIcon />
        </SearchButton>
      </Box>
      <Popper
        sx={{ width: '70%', maxHeight: '500px', overflow: 'scroll', borderBottom: '1px solid grey', borderRadius: 0 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  {drugs.map(d => (
                    <MenuItem key={d.name} onClick={() => handleDrugClick(d)}>{d.cleanName}</MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}

export default Search;
