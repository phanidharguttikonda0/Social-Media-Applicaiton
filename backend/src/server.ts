
import express from 'express' ;
import cors from 'cors' ;
import profileRouter from './routes/Profile' ;
import authenticationRouter from './routes/Authentication' ;
import postsRouter from './routes/Posts' ;
import storiesRouter from './routes/Stories' ;
import OtherRoutes from './routes/OtherRoutes' ;

const app = express() ;
app.use(cors()) ;
app.use(express.json()) ;

app.use('/profile',profileRouter) ;
app.use('/authentication', authenticationRouter) ;
app.use('/posts', postsRouter) ;
app.use('/stories', storiesRouter) ;
app.use('/', OtherRoutes) ;

// pending are messages and going Live part



app.listen(10000, () => console.log(`The app was listening on the port ${10000}`))