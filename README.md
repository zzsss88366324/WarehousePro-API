# Assignment 2: WarehousePro Inventory API

A RESTful API built with Node.js, Express, and MongoDB for managing product inventory.

## Project Overview

This API provides complete CRUD (Create, Read, Update, Delete) operations for an inventory management system. It uses the native MongoDB driver to interact with a cloud-hosted database on MongoDB Atlas.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete inventory items
- **MongoDB Atlas Integration**: Cloud-hosted database
- **Input Validation**: Validates required fields and data types
- **Duplicate Prevention**: Prevents duplicate SKU entries
- **Secure Configuration**: Environment variables for sensitive data
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **RESTful Design**: Follows REST API best practices

## Technologies Used

- Node.js
- Express.js
- MongoDB (native driver)
- dotenv (environment variables)

## Data Model

Each inventory item has the following structure:

```javascript
{
  "_id": ObjectId,           // Auto-generated MongoDB ID
  "name": String,            // Product name
  "sku": String,             // Unique product identifier
  "quantity": Number,        // Stock quantity
  "price": Number,           // Product price
  "createdAt": Date,         // Creation timestamp
  "updatedAt": Date          // Last update timestamp
}
```

## API Endpoints

### 1. Create Item
- **Endpoint**: `POST /api/items`
- **Description**: Creates a new inventory item
- **Request Body**:
  ```json
  {
    "name": "Red Running Shoes",
    "sku": "SHOE-RED-10",
    "quantity": 50,
    "price": 89.99
  }
  ```
- **Response**: `201 Created` - Returns the created item with `_id`

### 2. Get All Items
- **Endpoint**: `GET /api/items`
- **Description**: Retrieves all inventory items
- **Response**: `200 OK` - Returns array of all items

### 3. Get Single Item
- **Endpoint**: `GET /api/items/:id`
- **Description**: Retrieves a specific item by ID
- **Response**: `200 OK` - Returns the item object

### 4. Update Item
- **Endpoint**: `PUT /api/items/:id`
- **Description**: Updates an existing item
- **Request Body**: (partial updates supported)
  ```json
  {
    "quantity": 75,
    "price": 79.99
  }
  ```
- **Response**: `200 OK` - Returns the updated item

### 5. Delete Item
- **Endpoint**: `DELETE /api/items/:id`
- **Description**: Deletes an item by ID
- **Response**: `200 OK` - Returns success message

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- API testing tool (Postman, Thunder Client, or similar)

### Step 1: Install Dependencies

```bash
cd assignment2-inventory-api
npm install
```

### Step 2: Set Up MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

### Step 3: Configure Environment Variables

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   PORT=3000
   ```

   **Important**: Replace `username`, `password`, and `cluster` with your actual credentials.

### Step 4: Run the Application

**Production mode:**
```bash
npm start
```

**Development mode (with auto-reload):**
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Testing the API

### Using Postman

1. **Create an Item**:
   - Method: POST
   - URL: `http://localhost:3000/api/items`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "name": "Laptop Stand",
       "sku": "DESK-STAND-001",
       "quantity": 100,
       "price": 49.99
     }
     ```

2. **Get All Items**:
   - Method: GET
   - URL: `http://localhost:3000/api/items`

3. **Get Single Item**:
   - Method: GET
   - URL: `http://localhost:3000/api/items/<item_id>`

4. **Update Item**:
   - Method: PUT
   - URL: `http://localhost:3000/api/items/<item_id>`
   - Body:
     ```json
     {
       "quantity": 150,
       "price": 44.99
     }
     ```

5. **Delete Item**:
   - Method: DELETE
   - URL: `http://localhost:3000/api/items/<item_id>`

## Project Structure

```
assignment2-inventory-api/
├── server.js              # Main application file with all routes
├── package.json           # Project dependencies and scripts
├── .env.example           # Environment variable template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Error Handling

The API includes comprehensive error handling:

- `400 Bad Request`: Invalid input or malformed ID
- `404 Not Found`: Item or endpoint not found
- `409 Conflict`: Duplicate SKU
- `500 Internal Server Error`: Server-side errors

## Security Best Practices

- MongoDB connection string stored in environment variables
- `.env` file excluded from version control
- Input validation on all endpoints
- Graceful error handling without exposing sensitive information

## Submission Checklist

- [ ] All five CRUD endpoints implemented and tested
- [ ] MongoDB Atlas connection working
- [ ] Environment variables properly configured
- [ ] `.env` file NOT included in repository
- [ ] `README.md` includes setup instructions
- [ ] Code is clean and well-commented
- [ ] GitHub repository is private (with instructor access)

## Common Issues & Troubleshooting

**Issue**: "MongoServerError: bad auth"
- **Solution**: Check your username and password in the connection string

**Issue**: "Connection timeout"
- **Solution**: Verify your IP address is whitelisted in MongoDB Atlas

**Issue**: "Cannot find module 'dotenv'"
- **Solution**: Run `npm install` to install all dependencies

## Credits

Created for Web Data Management and Application Course - Assignment 2
Covers: Chapters 1-4 (Back-End Development, Express, MongoDB, CRUD)

---

**Note**: This is an educational project. For production use, implement additional security measures such as authentication, rate limiting, and input sanitization.
