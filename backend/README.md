# Backend

## Secrets
Create `firebase.config.js` inside the `backend` directory and copy in the following:
```
const FIREBASE_CONFIGS = {
    apiKey: "XXXXX",
    authDomain: "XXXXX",
    databaseURL: "XXXXX",
    projectId: "XXXXX",
    storageBucket: "XXXXX",
    messagingSenderId: "XXXXX",
    appId: "XXXXX",
    measurementId: "XXXXX"
};

module.exports = FIREBASE_CONFIGS;
```

Create `mongo.config.js` inside the `backend` directory and copy in the following:
```
const MONGO_CONFIGS = {
  environment: "Development | Production",
  mongoPassword: "XXXXX",
  mongoUsername: "XXXXX"
}

exports.module = MONGO_CONFIGS;
```

Message a member of the Fall 2019 team for the actual secrets.
