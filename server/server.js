const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');
require('dotenv').config()
require('multer');
// require('./config/database').connect()

/* SQL */
// const { connect } = require('./config/database');


const authRoutes = require('./routes/authen')
const questionRoutes = require('./routes/question')
const categoryRoutes = require('./routes/category')
const reviewRoutes = require('./routes/review')
const uploadFileRoutes = require('./routes/uploadFile')

const app = express()
// ตรงนี้คือการกำหนด middleware ที่จะทำงานกับทุกร้อยของ request
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
})

app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


//adding Socket
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5000'], 
    methods: ['GET', 'POST' , 'PUT' ,'DELETE'], 
  },
});


app.use('/auth', authRoutes)
app.use('/question' , questionRoutes)
app.use('/category' , categoryRoutes)
app.use('/review' , reviewRoutes)
app.use('/upload' , uploadFileRoutes)

const PORT = process.env.PORT || 5000;
io.on('connection', (socket) => {
  socket.on('question',(msg)=>{
    console.log('new Question Socket Server',msg)
    io.emit('new-question', msg)
  })
  socket.on('comment',(msg)=>{
    console.log('new Comment Socket Server',msg)
    io.emit('new-comment', msg)
  })
  socket.on('review',(msg)=>{
    console.log('new Review Socket Server',msg)
    io.emit('new-review', msg)
  })
  socket.on('uploadFile',(msg)=>{
    console.log('new uploadFile Socket Server',msg)
    io.emit('new-uploadFile', msg)
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



