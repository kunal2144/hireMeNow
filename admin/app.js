const session = require('express');
const session = require('express-sessiom');
const app = express();

app.get('/login', (req, res) => {
    res.render(login.html)
})

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

app.listen(3000);