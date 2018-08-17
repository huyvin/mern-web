const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/user');
const profiles = require('./routes/api/profile');
const posts = require('./routes/api/post');

const app = express();

// db conf
const db = require('./config/keys').mongoURI;

// connection
mongoose.connect(db,{ useNewUrlParser: true }).then(() => console.log('Database connected')).catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World !!')); 
 
// routes
app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

