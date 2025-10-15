const db = require('../config/db');
const path = require('path');
const { processImage } = require('../utils/imgProcessor');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

//public - - get all items for Marketplace
exports.getItems = (req, res) => {
    try {

    const items = db.getItems();
    console.log('Items from db:', items); 
    res.json(items);

    } catch (err) {
        console.error('Error fetching the items:', err);
        res.status(500).json({ message: 'Internal server error '});
    }
};


//private - - get all items for Profile page
exports.getMyItems = (req, res) => {
    try {
        const userEmail = req.user.email;
        const items = db.getItems();
        const userItems = items.filter(item => item.owner === userEmail);

        res.json(userItems);
    } catch (err) {
        console.error('Error fetching your items: ', err);
        res.status(500).json({ message: 'Internal server error.'});
    }
};

// itemsListController.js
exports.addItem = async (req, res) => {
    const { title, size, price, condition, style, location } = req.body;

    if (!title || !price) {
        return res.status(400).json({ message: 'Title and price are required' });
    }

    let images = [];
    if (req.file) {
        const baseName = path.parse(req.file.filename).name;
        images = await processImage(req.file.path, baseName);
    }

    const newItem = {
        id: uuidv4(),
        title,
        size,
        price,
        condition,
        imageUrl: images.length ? images[0].path : '',
        images,
        style,
        location,
        owner: req.user.email
    };

    const items = db.getItems();
    items.push(newItem);
    db.saveItems(items);

    return newItem;
};

exports.deleteItem = (req, res) => {
    try {
        const itemID = req.params.id;
        const items = db.getItems();

        const itemIndex = items.findIndex(item => String(item.id) === String(itemID) && item.owner === req.user.email);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found.'});
        }

        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        if (itemIndex === -1) {
            return res.status(403).json({ message: 'Not authorized or item not found' });
        }

        //delete images
        const item = items[itemIndex];
        if (item.images && item.images.length > 0) {
            item.images.forEach(img => {
                const filePath = path.join(__dirname, '../../', img.path);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            });
        } else if (item.imageUrl) {
            const filePath = path.join(__dirname, '../../', item.imageUrl);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        //removing from the db
        items.splice(itemIndex, 1);
        db.saveItems(items);

        res.json({ message: 'Item deleted successfully '});
    } catch (err) {
        console.error('Error deleting item. ', err);
        res.status(500).json({ message: 'Internal server error. '});
    }
};