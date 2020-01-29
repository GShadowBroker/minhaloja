var express = require('express');
var dotenv = require('dotenv').config();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var app = express();

var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');
// var init = require('./config/passport-config');
// init(passport);
var init = require('./config/passport');
init(passport)

var indexRouter = require('./routes/index');
var authenticationRouter = require('./routes/authentication');
var usersRouter = require('./routes/users');
var profileRouter = require('./routes/profile.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json()); //substitutes Body-Parser
app.use(express.urlencoded({ extended: true })); //substitutes Body-Parser
app.use(cookieParser());
app.use(sassMiddleware({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: false, // true = .sass and false = .scss
	sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: "keyboard cat",
	resave: true,
	saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/autenticacao', authenticationRouter);
app.use('/usuarios', usersRouter);
app.use('/minhaconta', profileRouter);

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
