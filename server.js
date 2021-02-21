const express = require('express');
// const uuid = require('uuid');
const app = express();
const fs = require('fs')

const PORT = process.env.PORT || 8080

// will share any static html files with the browser
app.use(express.static('public'));
// accept incoming POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


let counter = 1
app.post('/api/notes', function (req, res) {

    let dbFile = JSON.parse(fs.readFileSync('db/db.json'))
    console.log(dbFile.length)

    if (dbFile.length > 0) {

        counter = (parseInt(dbFile[dbFile.length - 1].id) + 1)

    }
    else {
        counter = 1
    }

    dbFile.push({ id: `${counter}`, title: `${req.body.title}`, text: `${req.body.text}` })

    console.log(dbFile)
    fs.writeFileSync('db/db.json', JSON.stringify(dbFile))

    counter++
})

app.get('/api/notes', function (req, res) {

    let dbFile = JSON.parse(fs.readFileSync('db/db.json'))
    // console.log(`get file ${dbFile}`)
    if (dbFile) {
        res.send(dbFile)
    }

})


app.delete('/api/notes/:id', (req, res) => {
    console.log(`id: ${req.params.id}`)
    console.log('API REQUEST: delete note \#', req.params.id);
    console.log(req.params);
    let dbData = JSON.parse(fs.readFileSync('db/db.json'));
    dbData = dbData.filter(entry => !(entry.id == req.params.id));
    fs.writeFileSync('db/db.json', JSON.stringify(dbData));
    res.end();
});


// Listener ==================================================
app.listen(PORT, function () {
    console.log(`Serving notes on PORT ${PORT}`)
});