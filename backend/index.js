
const express = require('express')
const admin = require('firebase-admin')



const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "quasarinsta-58153.appspot.com"
  
})

const db = admin.firestore();
let bucket = admin.storage().bucket();
let Busboy = require('busboy');
 inspect = require('util').inspect;
let path = require('path');
let os = require('os');
let fs = require('fs')
let UUID = require('uuid-v4');

const app = express()

app.get('/posts', (req, res) => {
res.header('Access-Control-Allow-Origin','*')

  let posts = []
  db.collection('posts').orderBy('date', 'desc').get().then(snapshot => {
    snapshot.forEach(doc => {
      posts.push(doc.data())
    })
    res.send(posts)
  })
})

app.post('/createPost', (req, res) => {
  res.set('Access-Control-Allow-Origin','*')
  let uuid = UUID();

    let busboy = new Busboy({ headers: req.headers });
    let fields = {};
    let fileData = {};
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      let filePath = path.join(os.tmpdir(), filename);
      file.pipe(fs.createWriteStream(filePath))
      fileData ={filePath, mimetype}

    });
    busboy.on('field', function(fieldname, val, filenameTruncated, valTruncated, encoding, mimetype) {
      fields[fieldname] = val;
    });
    busboy.on('finish', function() {

      bucket.upload(
        fileData.filePath,
        {
          uploadType: 'media',
          metadata:{
            metadata:{
              contentType:fileData.mimetype,
              firebaseStorageDownloadTokens: uuid
            },
          }
        },
        (err, uploadedFile) =>{
          if(!err){
            createDocument(uploadedFile);
          }
        }
      )
      function createDocument(uploadedFile){
        db.collection('posts').doc(fields.id).set({
          id: fields.id,
          caption: fields.caption,
        location: fields.location,
        date: parseInt(fields.date),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`
      }).then(() => {
        res.send('Post added: '+ fields.id)
      });
    }
      // res.writeHead(303, { Connection: 'close', Location: '/' });
    });
    req.pipe(busboy);
   

  })

app.listen(process.env.PORT || 3000)