var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
const {cloudConnect} = require('./config/cloudinary')
const fileUpload = require('express-fileupload')
require('dotenv').config()

var indexRouter = require('./routes/index');
var authRouter = require('./routes/Auth')
var profileRouter = require('./routes/Profile');
var productRouter = require('./routes/products/Product')
var createProductRouter = require('./routes/products/CreateProduct')
const cartRouter = require('./routes/products/cart')

var app = express();
app.use(express.json())
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

// Database connect
mongoose.connect(process.env.MONGODB)
.then(()=>{console.log("Database Connect.")})
.catch(()=>{console.log("DB not Connected.")})

// cloudinary connect
cloudConnect();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/profile', profileRouter);
app.use('/product', productRouter);
app.use('/createproduct', createProductRouter)
app.use('/auth', authRouter)
app.use('/cart', cartRouter)



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
