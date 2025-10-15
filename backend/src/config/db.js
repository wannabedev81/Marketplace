const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const ITEM_PATH = path.join(DATA_DIR, 'listItems.json');
const USERS_PATH = path.join(DATA_DIR, 'users.json');

const ensureDataDir = () => {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdir(DATA_DIR, {recursive: true});
    }
};

const readJsonFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};


module.exports = {
    //attempt to initialize data
    init: () => {
        try { ensureDataDir();
            if (!fs.existsSync(ITEM_PATH)) {
                writeJsonFile(ITEM_PATH, []);
            }
            if (!fs.existsSync(USERS_PATH)) {
                writeJsonFile(USERS_PATH, []);
            }
            console.log('Data files successfully initialized.');
        } catch (err) {
            console.error('Failed to load data files.', err);
        }
    },
    
    //items
    getItems: () => {
        return readJsonFile(ITEM_PATH);
    },
    saveItems: (items) => {
        writeJsonFile(ITEM_PATH, items);
    },

    //users
    getUsers: () => {
        return readJsonFile(USERS_PATH);
    },
    saveUsers: (users) => {
        writeJsonFile(USERS_PATH, users);
    },

    //List Item operations
    items: {
        findAll: async() => {
            const data = await readFileAsync(ITEM_PATH, 'utf-8');
            return JSON.parse(data);
        },
        create: async (newItem) => {
            const items = await this.items.findAll();
            items.push({ id: Date.now(), ...newItem });
            await writeFileAsync(ITEM_PATH, JSON.stringify(items, null, 2));
        }
    },

    users: {
        findAll: async() => {
            const data = await readFileAsync(USERS_PATH, 'utf-8');
            return JSON.parse(data);
        },
        create: async (newUser) => {
            const users = await this.users.findAll();
            users.push(newUser);
            await writeFileAsync(USERS_PATH, JSON.stringify(users, null, 2));
            return newUser;
        }
    }

};
