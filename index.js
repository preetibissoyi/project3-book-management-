const express = require('express');

const route = require('./routes/routes.js');
const mongoose  = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://group4:group4@cluster0.dknd8jj.mongodb.net/group23Database", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )



app.use('/', route);

app.use('/*', function (req, res) {
    return res.status(400).send({ status: false, msg: 'Page Not Found' })
 })

app.listen(3000, function () {
    console.log('Express app running on port ' +3000)
});
