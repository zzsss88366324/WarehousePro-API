require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;
let itemsCollection;

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB Atlas');

        db = client.db('warehousepro');
        itemsCollection = db.collection('inventory');

        console.log('Database and collection initialized');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Initialize database connection
connectDB();

// ===== API ENDPOINTS =====

// CREATE - POST /api/items
// Creates a new item in the inventory
app.post('/api/items', async (req, res) => {
    try {
        const { name, sku, quantity, price } = req.body;

        // Validation
        if (!name || !sku || quantity === undefined || price === undefined) {
            return res.status(400).json({
                error: 'Missing required fields. Please provide name, sku, quantity, and price.'
            });
        }

        // Check for duplicate SKU
        const existingItem = await itemsCollection.findOne({ sku });
        if (existingItem) {
            return res.status(409).json({
                error: 'An item with this SKU already exists.'
            });
        }

        // Create new item
        const newItem = {
            name,
            sku,
            quantity: Number(quantity),
            price: Number(price),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await itemsCollection.insertOne(newItem);

        // Fetch the created item to return with _id
        const createdItem = await itemsCollection.findOne({ _id: result.insertedId });

        res.status(201).json(createdItem);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// READ ALL - GET /api/items
// Retrieves all items in the inventory
app.get('/api/items', async (req, res) => {
    try {
        const items = await itemsCollection.find({}).toArray();
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// READ ONE - GET /api/items/:id
// Retrieves a single item by its _id
app.get('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid item ID format' });
        }

        const item = await itemsCollection.findOne({ _id: new ObjectId(id) });

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// UPDATE - PUT /api/items/:id
// Updates an existing item by its _id
app.put('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid item ID format' });
        }

        // Remove _id from updates if present
        delete updates._id;

        // Add updatedAt timestamp
        updates.updatedAt = new Date();

        // If SKU is being updated, check for duplicates
        if (updates.sku) {
            const existingItem = await itemsCollection.findOne({
                sku: updates.sku,
                _id: { $ne: new ObjectId(id) }
            });

            if (existingItem) {
                return res.status(409).json({
                    error: 'An item with this SKU already exists.'
                });
            }
        }

        // Convert numeric fields if present
        if (updates.quantity !== undefined) {
            updates.quantity = Number(updates.quantity);
        }
        if (updates.price !== undefined) {
            updates.price = Number(updates.price);
        }

        const result = await itemsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updates },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json(result.value);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE - DELETE /api/items/:id
// Deletes an item by its _id
app.delete('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid item ID format' });
        }

        const result = await itemsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item deleted successfully',
            deletedId: id
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'WarehousePro Inventory API',
        version: '1.0.0',
        endpoints: {
            'POST /api/items': 'Create a new item',
            'GET /api/items': 'Get all items',
            'GET /api/items/:id': 'Get item by ID',
            'PUT /api/items/:id': 'Update item by ID',
            'DELETE /api/items/:id': 'Delete item by ID'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`WarehousePro Inventory API running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});
