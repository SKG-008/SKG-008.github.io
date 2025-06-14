const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const LISTINGS_FILE = path.join(__dirname, 'data', 'listings.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize listings file if it doesn't exist
if (!fs.existsSync(LISTINGS_FILE)) {
  fs.writeFileSync(LISTINGS_FILE, JSON.stringify([]));
}

// Middleware
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(__dirname));

// Get all listings
app.get('/api/listings', (req, res) => {
  try {
    const listings = JSON.parse(fs.readFileSync(LISTINGS_FILE));
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve listings' });
  }
});

// Add a new listing
app.post('/api/listings', (req, res) => {
  try {
    const listings = JSON.parse(fs.readFileSync(LISTINGS_FILE));
    const newListing = {
      ...req.body,
      id: Date.now().toString()
    };
    listings.push(newListing);
    fs.writeFileSync(LISTINGS_FILE, JSON.stringify(listings));
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add listing' });
  }
});

// Delete a listing
app.delete('/api/listings/:id', (req, res) => {
  try {
    let listings = JSON.parse(fs.readFileSync(LISTINGS_FILE));
    listings = listings.filter(listing => listing.id !== req.params.id);
    fs.writeFileSync(LISTINGS_FILE, JSON.stringify(listings));
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

// Update a listing
app.put('/api/listings/:id', (req, res) => {
  try {
    let listings = JSON.parse(fs.readFileSync(LISTINGS_FILE));
    const index = listings.findIndex(listing => listing.id === req.params.id);
    if (index !== -1) {
      listings[index] = { ...listings[index], ...req.body };
      fs.writeFileSync(LISTINGS_FILE, JSON.stringify(listings));
      res.json(listings[index]);
    } else {
      res.status(404).json({ error: 'Listing not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});