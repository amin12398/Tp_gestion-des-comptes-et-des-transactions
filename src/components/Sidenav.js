import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemText } from '@mui/material';

const Sidenav = () => (
  <Drawer
    variant="permanent"
    sx={{
      width: 190,
      flexShrink: 0,
      backgroundColor: 'white',  // La barre latérale est maintenant blanche
    }}
  >
    <Box sx={{ width: 200, height: '100%', backgroundColor: 'white' }}> {/* Fond blanc pour le contenu de la barre latérale */}
      <List>
        <ListItem button component={Link} to="/comptes">
          <ListItemText primary="Gérer les Comptes" />
        </ListItem>
        <ListItem button component={Link} to="/transactions">
          <ListItemText primary="Gérer les Transactions" />
        </ListItem>
      </List>
    </Box>
  </Drawer>
);

export default Sidenav;
