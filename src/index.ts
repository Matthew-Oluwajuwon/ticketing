import { dbConnection } from './db';
import express, { Request, Response } from 'express'; 
import { port } from './utils/envConfig';
import cors from "cors"
import ticketRouter from './router/ticket';
import bookingRouter from './router/booking';

const app = express();

app.use(cors())
app.use(express.json())

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to ticket booking RESTful APIs');
});

app.use("/api/", ticketRouter)
app.use("/api/booking/", bookingRouter)

dbConnection()

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 