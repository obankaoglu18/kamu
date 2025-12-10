import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import authRouter from './routes/auth';
import placesRouter from './routes/places';
import reviewsRouter from './routes/reviews';
import usersRouter from './routes/users';
import uploadRouter from './routes/upload';
import photosRouter from './routes/photos';
import bookmarksRouter from './routes/bookmarks';

const app = express();
const port: number = parseInt(process.env.PORT || '3002', 10);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth', authRouter);
app.use('/places', placesRouter);
app.use('/reviews', reviewsRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);
app.use('/photos', photosRouter);
app.use('/bookmarks', bookmarksRouter);

app.get('/', (req, res) => {
  res.send('Kamu API is running');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Network: http://192.168.1.103:${port}`);
});
