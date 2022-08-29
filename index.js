const express = require('express');
const path = require('path');
var DOMParser = require('dom-parser');
const { isMainThread } = require('worker_threads');
const app = express();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));



//DB
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://Emanuele:h297k1fklCm2SMfp@animedata.dsmjr.mongodb.net/test?authSource=admin&replicaSet=atlas-mud1pv-shard-0&readPreference=primary&ssl=true";



app.get('/', (request, response) => {
    return response.send('OK');
});

app.get('/allanime', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    
    
    //db
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("animeDB");
        dbo.collection("Anime").find({}).toArray(function(err, result) {
            if (err) throw err;
                return response.send(result);
            db.close();
        });
    });

});

app.get('/nuovianime', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    
    
    //db
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("animeDB");
        dbo.collection("Anime").find({}).sort({_id:-1}).limit(6).toArray(function(err, result) {
            if (err) throw err;
                return response.send(result);
            db.close();
        });
    });

});

app.get('/animeid/:idanime', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);

    var idanime = request.params.idanime;
    var o_id = new ObjectId(idanime);

    
    //db
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("animeDB");
    dbo.collection("Anime").find({"_id" : o_id}).toArray(function(err, result) {
            if (err) throw err;
                return response.send(result);
            db.close();
        });
    });

});

app.get('/cerca/:nomeanime', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);

    var animedacercare = request.params.nomeanime;

    
    //db
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("animeDB");
        dbo.collection("Anime").find({"Nome" : {$regex : animedacercare, $options: 'i'}}).toArray(function(err, result) {
                if (err) throw err;
                    return response.send(result);
                db.close();
            });
        });

});

app.get('/notizie', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);

    fetch('https://anime.everyeye.it/notizie/')
        .then(res => res.text())
        .then(text => {
            var parser = new DOMParser();
	        var doc = parser.parseFromString(text, 'text/html');
            var newsRow = parser.parseFromString(doc.getElementsByClassName('contenuti')[0].innerHTML, 'text/html');
            return response.send(newsRow);
            //notizieRow = .getElementsByClassName('col-news');;
            //return response.send(notizieRow);
        });

    //let boxNotizie = doc.getElementById('news-row');

});

app.get('/nuoviepisodi', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    
    var dati;
    var primoDaultimo;
    var secondoDaultimo;
    var terzoDaultimo;
    var quartoDaultimo;
    var quintoDaultimo;
    var sestoDaultimo;
    var settimoDaultimo;
    var finale = [];
    var risultatofiltrato = [];
    
    //db
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("animeDB");
        dbo.collection("NuoviEpisodi").find({}).toArray(function(err, result) {
            if (err) throw err;
                dati = result.slice(-6)
                primoDaultimo = dati[dati.length -1]
                secondoDaultimo = dati[dati.length - 2]
                terzoDaultimo = dati[dati.length - 3]
                quartoDaultimo = dati[dati.length - 4]
                quintoDaultimo = dati[dati.length - 5]
                sestoDaultimo = dati[dati.length - 6]
                finale.push({Nome: primoDaultimo.Nome}, {Nome: secondoDaultimo.Nome}, {Nome: terzoDaultimo.Nome}, {Nome: quartoDaultimo.Nome}, {Nome: quintoDaultimo.Nome}, {Nome: sestoDaultimo.Nome});
                cercaManda()
        });

        function cercaManda(){

                finale.map(function(element){
                    dbo.collection("Anime").find({"Nome" : element.Nome}).toArray(function(err, result) {
                        if (err) throw err;

                        risultatofiltrato.push({Nome: result[0].Nome, Copertina: result[0].Copertina, _id: result[0]._id, Ep: result[0].Episodi.length-1 });

                        if(finale.length === risultatofiltrato.length+1){
                            risultatofiltrato.push({Nome: result[0].Nome, Copertina: result[0].Copertina, _id: result[0]._id, Ep: result[0].Episodi.length-1  });
                            return response.send(risultatofiltrato);
                        }
                    });
                });                
                
        }
        
    });

    
    

});


app.get('/account/:datiaccount1/:datiaccount2', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    
    //email
    var datiaccount1 = request.params.datiaccount1;
    //pass
    var datiaccount2 = request.params.datiaccount2;
    
    //db
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("animeDB");
        dbo.collection("Users").find({Email: datiaccount1, Password: datiaccount2}).toArray(function(err, result) {
            if (err) throw err;
                return response.send(result);

                
            db.close();
        });
    });

});
app.get('/register/:datiaccount1/:datiaccount2/:datiaccount3', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    
    //username
    var datiaccount1 = request.params.datiaccount1;
    //email
    var datiaccount2 = request.params.datiaccount2;
    //pass
    var datiaccount3 = request.params.datiaccount3;

    // current timestamp in milliseconds
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    let finalDate = year + "-" + month + "-" + date;

    //db
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("animeDB");
        dbo.collection("Users").insertOne({NomeUtente: datiaccount1, Email: datiaccount2, Password: datiaccount3, Avatar: "https://i.imgur.com/WMw4pS1.png", DataAccount: finalDate, Amici: [{Amico: ""}]}, function(err, res) {
            if (err) throw err;
            console.log("registato")
            return response.send("registato");
            db.close();
        });
    });

});



app.listen(process.env.PORT || 5000, () => {
    console.log('App is listening on port 5000');
});