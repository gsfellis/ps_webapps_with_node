const express = require('express');
const chalk = require('chalk'); // colors in console
const debug = require('debug')('app');
const morgan = require('morgan'); // middleware HTTPS logger
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;


// init morgan logging middleware
app.use(morgan('tiny'));

// init bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// init auth middleware
app.use(cookieParser());
app.use(session({ secret: 'library' }));

require('./src/config/passport.js')(app);


// setup static folder for express
app.use(express.static(path.join(__dirname, 'public')));

// setup static CSS route to use node_modules for bootstrap and jquery
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' },
];

const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'views', 'index.html'));
  res.render(
    'index',
    {
      nav,
      title: 'Library',
    },
  );
});

app.listen(port, () => {
  debug(`listening on ${chalk.green(port)}`); // string templating
});
