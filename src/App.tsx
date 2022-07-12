import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Box from '@mui/material/Box';

import { DrugShow, Search } from './views';

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <BrowserRouter>
        <Routes>
          <Route path="/drugs/search" element={<Search />} />
          <Route path="/drugs/:drugName" element={<DrugShow />} />
          <Route
            path="*"
            element={<Navigate to="/drugs/search" replace />}
          />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
