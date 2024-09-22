import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Select, MenuItem, FormControl, InputLabel, Chip, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [filters, setFilters] = useState([]);
  const [error, setError] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      const parsedInput = JSON.parse(input);
      const res = await axios.post(`${API_URL}/bfhl`, parsedInput);
      setResponse(res.data);
    } catch (err) {
      setError('Invalid input or server error');
    }
  };

  const handleFilterChange = (event) => {
    setFilters(event.target.value);
    setIsSelectOpen(false); // Close the dropdown after selection
  };

  const handleDeleteFilter = (filterToDelete) => {
    setFilters((prevFilters) => prevFilters.filter((filter) => filter !== filterToDelete));
  };

  const handleClearAllFilters = () => {
    setFilters([]);
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    return filters.map(filter => (
      <Box key={filter} mt={1}>
        <Typography variant="body2">{filter.charAt(0).toUpperCase() + filter.slice(1)}: {Array.isArray(response[filter]) ? response[filter].join(', ') : response[filter]}</Typography>
      </Box>
    ));
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <TextField
        fullWidth
        multiline
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"data":["M","1","334","4","B"]}'
        variant="outlined"
        label="API Input"
        sx={{
          marginBottom: 2,
          '& .MuiOutlinedInput-root': {
            fontSize: '1rem',
            '& fieldset': {
              borderColor: '#ccc',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '1rem',
          },
        }}
      />
      <Button 
        variant="contained" 
        onClick={handleSubmit} 
        fullWidth 
        sx={{ 
          textTransform: 'none',
          backgroundColor: '#1976d2',
          marginBottom: 2,
          '&:hover': {
            backgroundColor: '#1565c0',
          }
        }}
      >
        Submit
      </Button>
      
      {error && <Typography color="error" variant="body2">{error}</Typography>}
      
      {response && (
        <Box sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 1 }}>
          <FormControl fullWidth size="small" sx={{ marginBottom: 1 }}>
            <InputLabel id="multi-filter-label" sx={{ fontSize: '1rem' }}>Multi Filter</InputLabel>
            <Select
              labelId="multi-filter-label"
              multiple
              open={isSelectOpen}
              onOpen={() => setIsSelectOpen(true)}
              onClose={() => setIsSelectOpen(false)}
              value={filters}
              onChange={handleFilterChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={value} 
                      size="small" 
                      onDelete={() => handleDeleteFilter(value)}
                      deleteIcon={<CloseIcon />}
                      sx={{
                        color: 'black',
                        borderRadius: '3px',
                        '& .MuiChip-deleteIcon': {
                          color:'black',
                        },
                      }}
                    />
                  ))}
                </Box>
              )}
              sx={{
                fontSize: '1rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ccc'
                },
              }}
              endAdornment={
                <IconButton 
                  size="large" 
                  onClick={handleClearAllFilters}
                  sx={{ visibility: filters.length > 0 ? 'visible' : 'hidden' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              <MenuItem value="numbers">Numbers</MenuItem>
              <MenuItem value="alphabets">Alphabets</MenuItem>
              <MenuItem value="highest_lowercase_alphabet">Highest Lower Alphabet</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>Filtered Response</Typography>
          {renderFilteredResponse()}
        </Box>
      )}
    </Box>
  );
}

export default App;