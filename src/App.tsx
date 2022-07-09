import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Box from '@mui/material/Box';

import Search from './views/Search';
import DrugShow from './views/DrugShow';
import Header from './components/Header';

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <BrowserRouter>
        <Header />
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
