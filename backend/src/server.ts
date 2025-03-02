
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

app.use('/profile',profileRouter) ; // has been completed
app.use('/authentication', authenticationRouter) ; // has been completed
app.use('/posts', postsRouter) ; // done completing except few
app.use('/stories', storiesRouter) ; // done completing except few
app.use('/', OtherRoutes) ; // done completing except few

// pending are messages and going Live part

// and also posting a profile picture, post image or reel in aws S3 and getting back url

// change the notification to seen , when user clicked on notifications

app.listen(10000, () => console.log(`The app was listening on the port ${10000}`))