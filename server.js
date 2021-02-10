const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000;
const API_PATH = '/api';

const direcciones = [
   'https://www.fravega.com/l/tv-y-video/tv/',
   'https://www.fravega.com/l/celulares/celulares-liberados/',
   "https://www.fravega.com/l/audio/radios-y-audio-portatil/",
   "https://www.fravega.com/l/?categorias=informatica%2Fgaming-pc"
]

app.get(API_PATH + '/fravega', async function(req, res){
   const productos = [];

   for (let i = 0; i < direcciones.length; i++) {
      const dir = direcciones[i];
      
      let a = await fravega(dir)
      productos.push(a)
   }
   res.json(productos)
});

const fravega = function(direccion){
   return new Promise((resolve, reject) => {
      request(direccion, (error, response, html)=>{
         if (error) return console.error(error);
         if(!error && response.statusCode == 200){
            const $ = cheerio.load(html)
   
            const productos = [];
   
            $('li').find('div > a').each(function (i, e) {
               let titulo = $(this).find('article div h4').text();
               let href = $(this).attr('href');
               let precioFinal = $(this).find('article div div span').text();
   
               productos.push({'titulo': titulo, 'Precio final': precioFinal, 'link': 'fravega.com' + href})
            });
            resolve(productos);
         }
      })
   })
   
}

const garbarino = function(direccion){
   console.log(direccion)
   request(direccion, (error, response, html)=>{
      if (error) return console.error(error);
      if(!error && response.statusCode == 200){
         const $ = cheerio.load(html)
         const productos = [];

         $('.itemBox--info').each(function(i, e){
            let titulo = $(this).find('a h3').text();
            let precioFinal = $(this).find('a div .value-item').text();
            let link = $(this).find('a').attr('href');

            precioFinal = precioFinal.replace("$","")
            productos.push({'titulo': titulo, 'Precio final': precioFinal, 'link': 'garbarino.com' + link})
         })
         console.table(productos)
      }
   })
}



const direccionesGarbarino = [
   "https://www.garbarino.com/productos/tv-led-y-smart-tv/4342"
]

// app.use(express.static(__dirname + '/public/'));

// app.use(function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", '*');
//    res.header("Access-Control-Allow-Credentials", true);
//    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
//    next();
// });

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.listen(port, function() {
   console.log("Server corriendo en el puerto: " + port)
   // var job = new cronJob({ 
   //    cronTime:'0 * * * * *', 
   //    onTick: function(){
   //       // for (let i = 0; i < direcciones.length; i++) {
   //       //    const element = direcciones[i];
   //       //    fravega(element)
   //       // }
         
   //       for (let i = 0; i < direccionesGarbarino.length; i++) {
   //          const element = direccionesGarbarino[i];
   //          garbarino(element)
   //       }
   //    },
   //    start:true,
   //    timeZone:'Asia/Kolkata'
   // });
   // job.start();
});