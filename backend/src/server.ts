
import express from 'express' ;
import cors from 'cors' ;
import profileRouter from './routes/Profile' ;
import authenticationRouter from './routes/Authentication' ;

const app = express() ;
app.use(cors());

app.use('/profile',profileRouter) ;
app.use('/authentication', authenticationRouter) ;




app.listen(10000, () => console.log(`The app was listening on the port ${10000}`))