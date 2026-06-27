import { Request, Response, NextFunction } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import candidateRoutes from './routes/candidateRoutes';
import positionRoutes from './routes/positionRoutes';
import { uploadFile } from './application/services/fileUploadService';
import cors from 'cors';

dotenv.config();

export const app = express();
export default app;

app.use(helmet());
app.use(express.json());

// Request logging middleware — sanitize CR/LF to prevent log forging
app.use((req, res, next) => {
  const sanitize = (s: string) => s.replace(/[\r\n]/g, '');
  console.log(`${new Date().toISOString()} - ${sanitize(req.method)} ${sanitize(req.path)}`);
  next();
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }),
);

// Import and use candidateRoutes
app.use('/candidates', candidateRoutes);

// Import and use positionRoutes
app.use('/positions', positionRoutes);

// Route for file uploads
app.post('/upload', uploadFile);



const port = 3010;

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500).send('Something broke!');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
