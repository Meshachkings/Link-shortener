require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const short = require('./models/short')

const app = express();
mongoose.connect(process.env.DB_URL);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res)=>{
    const shorturls = await short.find()
    let i = 1;
    res.render('index', {shorturls, i});
})

app.post('/short', async (req, res)=>{
    await short.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shorturl', async (req, res)=> {
    const shorturl = await short.findOne({short : req.params.shorturl})

    if(shorturl == null) return res.sendStatus(404)

    shorturl.clicks++;
    shorturl.save();

    res.redirect(shorturl.full);
})

app.listen(5000);
