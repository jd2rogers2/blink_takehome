import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import Header from '../components/Header';

const searchButtonColor = 'rgb(219, 55, 76)';

function Search() {
  const [searchText, setSearchText] = React.useState<string>('');
  const [drugs, setDrugs] = React.useState<any[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setSearchText(event.target.value);
  }

  const handleSearchClick = async (): Promise<void> => {
    fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${searchText}`, {
      method: 'GET',
    }).then(response => response.json())
      .then(data => {
        setDrugs(data);
      });
  };
  console.log('\n\n');
  console.log('drugs', drugs);
  console.log('\n\n');

  return (
    <Box>
      <Header />
      <Box sx={{ display: 'flex', marginTop: '30px', justifyContent: 'center' }}>
        <FormControl sx={{ width: '90%', m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-getDrugs">Search by drug name (E.g. Lipitor)</InputLabel>
          <OutlinedInput
            fullWidth
            id="outlined-adornment-getDrugs"
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            endAdornment={
              <InputAdornment position="end">
                <Button
                  onClick={handleSearchClick}
                  onMouseDown={handleSearchClick}
                  endIcon={<SearchRoundedIcon />}
                  variant="contained"
                  size="large"
                >
                  Find the lowest price
                </Button>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
    </Box>
  );
}

export default Search;
