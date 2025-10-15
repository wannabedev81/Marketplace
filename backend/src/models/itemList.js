const db = require('../config/db');

class itemList {
    static async findAll() {
        return await db.items.findAll();
    }

    static async create(newItem) {
        if (!newItem?.title || newItem?.price) {
            throw new Error('Missing required fields');
        }

        console.log('Creating item: ', newItem); // to debug creation of new item

        return await db.items.create(newItem);
    }
}

module.exports = itemList;