const express = require('express');
const path = require('path');
var DOMParser = require('dom-parser');
const { isMainThread } = require('worker_threads');
const app = express();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

var nodemailer = require('nodemailer');

//DB
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://Emanuele:h297k1fklCm2SMfp@animedata.dsmjr.mongodb.net/test?authSource=admin&replicaSet=atlas-mud1pv-shard-0&readPreference=primary&ssl=true";

//mail di benvenuto
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'animecrowdinfo@gmail.com',
        pass: 'tiuxjtzynjiycmrt'
    },
    tls: {
        rejectUnauthorized: false
    }
});
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}




app.get('/', (request, response) => {
    const head = request.headers;
    const string = toString(head)
    console.log(request.headers["X-API-Key"])
    return response.send(request.headers["X-API-Key"]);
});

/*app.get('/allanime', (request, response) => {
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
*/

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

    let codiceSegretogenerato = generateString(20)

    //db
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("animeDB");
        dbo.collection("Users").insertOne({NomeUtente: datiaccount1, Email: datiaccount2, Password: datiaccount3, Avatar: "https://i.imgur.com/WMw4pS1.png", DataAccount: finalDate, CodiceRipristino:  codiceSegretogenerato, Amici: [{Amico: ""}]}, function(err, res) {
            if (err) throw err;
            console.log("registato")


            var mailOptions = {
                from: ' "AnimeCrowd" <animecrowdinfo@gmail.com>',
                to: datiaccount2,
                subject: 'Benvenuto su AnimeCrowd!',
                text: 'Ciao '+ datiaccount1 +'! Benvenuto su AnimeCrowd.it 😄,\nda adesso in poi puoi accedere a tutti i servizi presenti sul sito.\nNon riceverai più email, quindi per restare aggiornato seguici sul nostro canale Telegram: https://t.me/+Bosmk92oY_AzYzM0.\nCodice ripristino password: '+ codiceSegretogenerato +'\nAttenzione! Se non ricordi più la tua password o hai qualunque altro problema contatta https://t.me/emaaahhh e fornisci questo codice.\nA presto👋\nIl team di AnimeCrowd.it.'
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email inviata a '+ datiaccount2 +': ' + info.response);
                }
            });

            return response.send("registato");
            db.close();
        });
    });

});
app.get('/check/:datiaccount1', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    
    //email
    var datiaccount1 = request.params.datiaccount1;
    
    //db
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("animeDB");
        dbo.collection("Users").find({Email: datiaccount1}).toArray(function(err, result) {
            if (err) throw err;
                return response.send(result);

                
            db.close();
        });
    });

});


app.get('/background/:link/:email/:pass', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    
    
    var link = request.params.link;
    var email = request.params.email;
    var pass = request.params.pass;

    console.log(request.headers["X-API-Key"])

    //db
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("animeDB");
        dbo.collection("Users").updateOne({Email: email, Password: pass}, {$set: {Sfondo: link}})

    });

});


app.get('/trovautente/:tag', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    
    
    var tag = ObjectId(request.params.tag)

    if(tag != undefined) {
        //db
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            var dbo = db.db("animeDB");
            dbo.collection("Users").find({_id : ObjectId(tag)}).toArray(function(err, result) {
                if (err) throw err;
                    
                    return response.send([{Tag: tag, NomeUtente: result[0].NomeUtente, Avatar: result[0].Avatar, DataAccount: result[0].DataAccount}]);
                    
                db.close();
            });
        });
    }else{
        return
    }

});


app.get('/pinUser/:myemail/:mypass/:userid', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    
    
    var myemail = request.params.myemail;
    var mypass = request.params.mypass;
    var userid = request.params.userid;
    
    //db
    MongoClient.connect(uri, function(err, db) {
        
        if (err) throw err;
        var dbo = db.db("animeDB");
                
        dbo.collection("Users").find({Email: myemail, Password: mypass}).toArray(function(err, result) {
            if (err) throw err;

            var oldPinUserArr = result[0].Amici
            

            dbo.collection("Users").find({_id : ObjectId(userid)}).toArray(function(err, resultuser) {
                oldPinUserArr.push({_id: userid});

                dbo.collection("Users").updateOne({Email: myemail, Password: mypass}, {$set: {Amici: oldPinUserArr}})

                return response.send(resultuser[0].NomeUtente);
                db.close();
            });
                        
        });
    });

});
app.get('/removepinUser/:myemail/:mypass/:userid', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    
    
    var myemail = request.params.myemail;
    var mypass = request.params.mypass;
    var userid = request.params.userid;
    
    //db
    MongoClient.connect(uri, function(err, db) {
        
        if (err) throw err;
        var dbo = db.db("animeDB");
                
        dbo.collection("Users").find({Email: myemail, Password: mypass}).toArray(function(err, result) {
            if (err) throw err;

            var oldPinUserArr = result[0].Amici
            

            dbo.collection("Users").find({_id : ObjectId(userid)}).toArray(function(err, resultuser) {

                function arrayRemove(arr, value) { 
    
                    return arr.filter(function(ele){ 
                        return ele != value; 
                    });
                }

                var result = arrayRemove(oldPinUserArr, userid);


                dbo.collection("Users").updateOne({Email: myemail, Password: mypass}, {$set: {Amici: result}})
                

                return response.send(resultuser[0].NomeUtente);
                db.close();
            });
                        
        });
    });

});



app.listen(process.env.PORT || 5000, () => {
    console.log('App is listening on port 5000');
});
