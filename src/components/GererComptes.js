import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_COMPTES, ADD_COMPTE, DELETE_COMPTE } from '../graphql/comptes';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  MenuItem,
} from '@mui/material';

const GererComptes = () => {
  const { loading, error, data } = useQuery(GET_ALL_COMPTES);
  const [addCompte] = useMutation(ADD_COMPTE, { refetchQueries: [{ query: GET_ALL_COMPTES }] });

  // Mutation pour supprimer un compte
  const [deleteCompte] = useMutation(DELETE_COMPTE, {
    update(cache, { data: { deleteCompte } }) {
      const existingComptes = cache.readQuery({ query: GET_ALL_COMPTES });
      const updatedComptes = existingComptes.allComptes.filter(compte => compte.id !== deleteCompte.id);
      cache.writeQuery({
        query: GET_ALL_COMPTES,
        data: { allComptes: updatedComptes },
      });
    },
  });

  const [formData, setFormData] = useState({ solde: '', dateCreation: '', type: '' });

  if (loading) return <Typography>Chargement...</Typography>;
  if (error) return <Typography color="error">Erreur : {error.message}</Typography>;

  const handleAddCompte = () => {
    const parsedSolde = parseFloat(formData.solde);
    if (isNaN(parsedSolde)) {
      alert('Le solde doit être un nombre valide.');
      return;
    }

    const compteData = {
      solde: parsedSolde,
      dateCreation: formData.dateCreation,
      type: formData.type,
    };

    addCompte({ variables: { compte: compteData } });
    setFormData({ solde: '', dateCreation: '', type: '' });
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: 'black', color: 'white' }}>
      <Typography variant="h4" gutterBottom>
        Gérer les Comptes
      </Typography>

      {/* Formulaire d'ajout de compte */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          marginBottom: 4,
          background: '#333',  // Fond légèrement plus sombre que noir
          padding: 2,
          borderRadius: 2,
        }}
      >
        <TextField
          label="Solde (€)"
          value={formData.solde}
          onChange={(e) => setFormData({ ...formData, solde: e.target.value })}
          fullWidth
          sx={{ backgroundColor: 'white', color: 'black' }}
        />
        <TextField
          label="Date de Création"
          type="date"
          value={formData.dateCreation}
          onChange={(e) => setFormData({ ...formData, dateCreation: e.target.value })}
          InputLabelProps={{ shrink: true }}
          fullWidth
          inputProps={{
            pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}",
            title: "Please enter a date in the format YYYY-MM-DD",
          }}
          sx={{ backgroundColor: 'white', color: 'black' }}
        />
        <TextField
          select
          label="Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          fullWidth
          sx={{ backgroundColor: 'white', color: 'black' }}
        >
          <MenuItem value="COURANT">COURANT</MenuItem>
          <MenuItem value="EPARGNE">EPARGNE</MenuItem>
        </TextField>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCompte}
          sx={{
            backgroundColor: 'black',  // Fond noir pour le bouton
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',  // Couleur plus foncée au survol
            },
          }}
        >
          Ajouter Compte
        </Button>
      </Box>

      {/* Liste des comptes */}
      <Grid container spacing={2}>
        {data.allComptes.map((compte) => (
          <Grid item xs={12} sm={6} md={4} key={compte.id}>
            <Card sx={{ backgroundColor: 'red' }}> {/* Fond rouge pour chaque carte */}
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white' }}>{compte.type}</Typography>
                <Typography sx={{ color: 'white' }}>Solde : {compte.solde} €</Typography>
                <Typography sx={{ color: 'white' }}>Date de création : {compte.dateCreation}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => deleteCompte({ variables: { id: compte.id } })}
                >
                  Supprimer
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GererComptes;
