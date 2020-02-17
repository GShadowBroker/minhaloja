var express = require('express');
var dotenv = require('dotenv').config();
var createError = require('http-errors');
var path = require('path');
var csurf = require('csurf');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var app = express();

const csrfMiddleware = csurf({
	cookie: true
});

var flash = require('connect-flash');
var passport = require('passport');
var Sequelize = require('sequelize') //added manually
var session = require('express-session');

var SequelizeStore = require('connect-session-sequelize')(session.Store);

var init = require('./config/passport-config');
init(passport);
// var init = require('./config/passport');
// init(passport)

var indexRouter = require('./routes/index');
var authenticationRouter = require('./routes/authentication');
var usersRouter = require('./routes/tests'); // REMOVE IN PRODUCTION!
var profileRouter = require('./routes/profile');
var dashboardRouter = require('./routes/dashboard');
var productsRouter = require('./routes/products');
var cartRouter = require('./routes/shoppingcart');
var favoritesRouter = require('./routes/favorites');
var apiRouter = require('./routes/api');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json()); //substitutes Body-Parser
app.use(express.urlencoded({ extended: true })); //substitutes Body-Parser
app.use(cookieParser());
// csrf protection
app.use(csrfMiddleware);
app.use(sassMiddleware({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: false, // true = .sass and false = .scss
	sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

var db = new Sequelize(
	process.env.DB_NAME,
	'postgres',
	process.env.DB_PASSWORD, {
		host: 'localhost',
		dialect: 'postgres'
	}
);
var sessionStore = new SequelizeStore({
	db: db
});
app.use(session({
	secret: process.env.SESSION_SECRET,
	store: sessionStore,
	resave: false,
	proxy: true,
	saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) { // Allows me to access objects without passing them to the view explicitly
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
	res.locals.user = req.user;
	res.locals.cart = req.session.cart;
	res.locals.favorites = req.session.favorites;
	next();
});

app.use('/', indexRouter);
app.use('/autenticacao', authenticationRouter);
app.use('/testes', usersRouter); // REMOVE IN PRODUCTION!
app.use('/minhaconta', profileRouter);
app.use('/painel-de-controle', dashboardRouter);
app.use('/produtos', productsRouter);
app.use('/carrinho', cartRouter);
app.use('/favoritos', favoritesRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
