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

import Header from '../components/Header';
import { cleanName } from '../utils/cleanName';

// TODO breakout if reused
const SearchButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  color: theme.colors.primary,
}));

type Drug = {
  language: string;
  name: string;
  cleanName: string;
  rxcui: string;
  suppress: string;
  synonym: string;
  tty: string;
  umlscui: string;
};
type Response = {
  drugGroup: {
    conceptGroup?: {
      tty: string;
      conceptProperties?: Drug[]
    }[]
  }
};

const formatDrugs = (response: Response): Drug[] => {
  const flatDrugs = response.drugGroup.conceptGroup?.reduce<Drug[]>((acc, curr) => {
    acc.push(...(curr.conceptProperties || []));
    return acc;
  }, []) ?? [];
  const sanitizedDrugs = flatDrugs.map(d => ({ ...d, cleanName: cleanName(d.name) }))
  const sortedDrugs = sanitizedDrugs.sort((a,b) => a.cleanName > b.cleanName ? 1 : -1);
  return sortedDrugs;
}

const getDrugs = async (searchText: string): Promise<Drug[]> => {
  const res = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${searchText}`, {
    method: 'GET',
  })
  const data = await res.json();
  return formatDrugs(data);
};

function Search() {
  const [searchText, setSearchText] = React.useState<string>('');
  const [drugs, setDrugs] = React.useState<Drug[]>([]);
  const [, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);

  const anchorRef = React.useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setSearchText(event.target.value);
  }

  const handleSearchClick = async (): Promise<void> => {
    if (!searchText) { return; }

    const drugs = await getDrugs(searchText);

    if (drugs.length) {
      setDrugs(drugs);
    } else {
      const res = await fetch(`https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${searchText}`, {
        method: 'GET',
      })
      const data = await res.json();
      const firstSuggestion = data.suggestionGroup.suggestionList[0]?.suggestion || '';

      if (firstSuggestion) {
        const suggestedDrugs = await getDrugs(firstSuggestion);
        setDrugs(suggestedDrugs);
      } else {
        // error
      }
    }

    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrugClick = (drug: Drug) => {
    console.log(drug)
    navigate(`/drugs/${encodeURI(drug.name)}`)
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
      <Box sx={{ width: '70%', display: 'flex', margin: '30px auto 0', justifyContent: 'center', overflow: 'hidden', maxHeight: '500px' }} ref={anchorRef}>
        <TextField
          sx={{ width: '100%' }}
          onChange={handleSearchChange}
          onFocus={(e) => setAnchorEl(e.currentTarget)}
          InputProps={{
            type: 'search'
          }}
          onKeyDown={handleSearchKey}
        />
        <SearchButton
          onClick={handleSearchClick}
          onMouseDown={handleSearchClick}
        >
          <SearchRoundedIcon />
        </SearchButton>
      </Box>
      <Popper
        sx={{ width: '70%', maxHeight: '500px', overflow: 'scroll' }}
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
                  sx={{ border: '1px solid light-grey' }}
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
