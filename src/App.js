import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidenav from './components/Sidenav';
import GererComptes from './components/GererComptes';
import GererTransactions from './components/GererTransactions';
import { Box } from '@mui/material';

const App = () => (
  <Router>
    <Box sx={{ display: 'flex' }}>
      <Sidenav />
      <Box sx={{ flexGrow: 1, paddingLeft: '200px' }}> {/* Add padding to the left */}
        <Routes>
          <Route path="/comptes" element={<GererComptes />} />
          <Route path="/transactions" element={<GererTransactions />} />
        </Routes>
      </Box>
    </Box>
  </Router>
);

export default App;
