const express = require('express');
const multer = require('multer');
const path = require('path');
const { getItems, addItem, getMyItems, deleteItem } = require('../controllers/itemsListController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();
const sharp = require('sharp');
const { processImage } = require('../utils/imgProcessor');
const { db } = require('../config/db');
const { fs } = require('fs');


//multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});

const upload = multer({storage});



router.get('/', getItems);
router.get('/my-items', authenticateToken, getMyItems);

router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const newItem = await addItem(req, res); // controller handles everything
        res.status(201).json({ message: 'Item added successfully', item: newItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Item creation failed', error: err.message });
    }
});

router.delete('/:id', authenticateToken, deleteItem);

module.exports = router;