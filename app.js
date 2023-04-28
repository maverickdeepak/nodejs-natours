const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorHandler');

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log('HEADERS 🟩', req.headers);
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  // const err = new Error(`Can't find # ${req.originalUrl} # on this server`);
  // err.status = 'failed';
  // err.statusCode = 404;
  next(new AppError(`Can't find # ${req.originalUrl} # on this server`, 404));
});

app.use(globalErrorHandler);

// 4) START SERVER
module.exports = app;
