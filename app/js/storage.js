const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
    constructor(opts) {
        // Rnderer process has to get 'app' module via 'remote', whereas the main process can get it directly
        // app.getPath('userData') will retrn a string of user's app data direcory path.
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');

        // We'll use the 'configName' property to set the file name and path.join to bring it all together as a string
        this.path = path.join(userDataPath, opts.configName + '.json');

        this.data = parseDataFile(this.path, opts.defaults);
    }

    // this will just return the property on the 'data' object
    get(key) {
        return this.data[key];
    }

    // .. and this will set it
    set(key, val) {
        this.data[key] = val;
        // Wait,  thought using the node.js was bad form?
        // We are notwriting a server so there's not nearly the same IO demand on the process.
        // Also if we used an async API and our app was quit before the asynchronous write had a chance to comple,
        // we might lose thatdata. Note that in a real app, we would try/catch this.
        fs.writeFileSync(this.path, JSON.stringify(this.data));

    }

    append(key, value) {
        var freshData = {
            hash: crypto.getRandomBytes(10).toString('hex'),
            description: value,
            dateCreated: Date.getTime()
        };

        this.data[key].append(freshData);
        fs.writeFileSync(this.path, JSON.stringify(this.data));

        return freshData;
    }
}

function parseDataFile(filePath, defaults) {
    // We will try/catch it in case the file doesn't exist yet, which will be the ase on the first application run.
    // 'fs.readFileSync' will return a JSON string which we then parse into a Javascript object
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch(error) {
        // if thre was some kind of error, return the passed in defaults instead
        return defaults;
    }
}

module.exports = Store;