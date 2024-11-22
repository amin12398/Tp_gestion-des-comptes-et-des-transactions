import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_COMPTES, ADD_TRANSACTION } from '../graphql/transactions';

import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  MenuItem,
} from '@mui/material';

const GererTransactions = () => {
  const { loading, error, data } = useQuery(GET_ALL_COMPTES);  // Récupérer tous les comptes
  const [saveTransaction] = useMutation(ADD_TRANSACTION, { refetchQueries: [{ query: GET_ALL_COMPTES }] }); // Mutation pour ajouter une transaction

  const [formData, setFormData] = useState({
    compteId: '',
    type: '',
    montant: ''
  });

  if (loading) return <Typography>Chargement...</Typography>;
  if (error) return <Typography color="error">Erreur : {error.message}</Typography>;

  const handleAddTransaction = () => {
    const parsedMontant = parseFloat(formData.montant);
    if (isNaN(parsedMontant) || parsedMontant <= 0) {
      alert('Le montant doit être un nombre valide et positif.');
      return;
    }

    const transactionData = {
      compteId: formData.compteId,
      type: formData.type,
      montant: parsedMontant,
    };

    saveTransaction({ variables: { ...transactionData } });
    setFormData({ compteId: '', type: '', montant: '' });
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: 'black', color: 'white' }}>
      <Typography variant="h4" gutterBottom>
        Gérer les Transactions
      </Typography>

      {/* Formulaire d'ajout de transaction */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          marginBottom: 4,
          background: '#333',  // Fond légèrement plus clair que noir
          padding: 2,
          borderRadius: 2,
        }}
      >
        <TextField
          select
          label="Compte"
          value={formData.compteId}
          onChange={(e) => setFormData({ ...formData, compteId: e.target.value })}
          fullWidth
          sx={{ backgroundColor: 'white', color: 'black' }}
        >
          {data.allComptes.map((compte) => (
            <MenuItem key={compte.id} value={compte.id}>
              {compte.type} - Solde: {compte.solde} €
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Type de transaction"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          fullWidth
          sx={{ backgroundColor: 'white', color: 'black' }}
        >
          <MenuItem value="DEPOT">Dépôt</MenuItem>
          <MenuItem value="RETRAIT">Retrait</MenuItem>
        </TextField>

        <TextField
          label="Montant (€)"
          value={formData.montant}
          onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
          fullWidth
          sx={{ backgroundColor: 'white', color: 'black' }}
        />

        <Button
          variant="contained"
          onClick={handleAddTransaction}
          sx={{
            backgroundColor: 'black', // Fond du bouton en noir
            color: 'white', // Texte du bouton en blanc
            '&:hover': {
              backgroundColor: '#333', // Noir plus foncé lors du survol
            }
          }}
        >
          Ajouter Transaction
        </Button>
      </Box>

      {/* Liste des comptes avec fond rouge */}
      <Grid container spacing={2}>
        {data.allComptes.map((compte) => (
          <Grid item xs={12} sm={6} md={4} key={compte.id}>
            <Card sx={{ backgroundColor: 'red' }}> {/* Fond rouge pour chaque carte */}
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white' }}>{compte.type}</Typography>
                <Typography sx={{ color: 'white' }}>Solde : {compte.solde} €</Typography>
                <Typography sx={{ color: 'white' }}>Date de création : {compte.dateCreation}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GererTransactions;
