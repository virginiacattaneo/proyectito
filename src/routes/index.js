const express = require('express');
const router = express.Router();
var body_parser = require('body-parser');
router.use(body_parser.urlencoded({extended:true}));

const fs = require('fs');
const {uuid} = require('uuidv4');
const { Console } = require('console');

router.get('/', (req, res) => {
  res.render('index', { dats:'Examenes Online 2021'});
});

router.get('/listadoexamen', (req, res) => {
  const data = fs.readFileSync('src/listaexamen.json', 'utf-8');
  var json = JSON.stringify(JSON.parse(data)); //convert it back to json
  const dataA = fs.readFileSync('src/alumnos.json', 'utf-8');
  var jsonA = JSON.stringify(JSON.parse(dataA)); //convert it back to json
  res.render('listadoexamen', { dats: json , datsA:jsonA});
})


router.get('/pregseccion', (req, res) => {
  const data = fs.readFileSync('src/datospreguntas.json', 'utf-8');
  var json = JSON.stringify(JSON.parse(data)); //convert it back to json
  //const dataA = fs.readFileSync('src/alumnos.json', 'utf-8');
  //var jsonA = JSON.stringify(JSON.parse(dataA)); //convert it back to json
  res.render('pregseccion', { dats: json});
  
})

router.post('/generarexamenfinal', (req, res) => {
  var obje = {
    examen: []
  };
  var elObj = {};
  var elObjex = {
    examenes : []
  };
  var elObjexamen = {
    id: uuid(), fecha: new Date(), examenes: [],
  };
  const dato = fs.readFileSync('src/examen.json', 'utf-8');
  obje = JSON.parse(dato); //now it an object
  var objex = {
    examen: []
  };
  long=obje.examen.length;
  for (i=0; i<long; i++){  
        elObj = {
          seccion: obje.examen[i].seccion,
          title: obje.examen[i].title,
          //puntaje?????
          puntaje: req.body.puntaje[i],
          descripcion: obje.examen[i].descripcion,
          opciones: obje.examen[i].opciones,
          archivossubidos: obje.examen[i].archivossubidos,
          imagensubida: obje.examen[i].imagensubida,
          urlsubida: obje.examen[i].urlsubida,
          checkboxtitleopcion: obje.examen[i].checkboxtitleopcion,
          titleopcion: obje.examen[i].titleopcion,
      }
      objex.examen.push(elObj);
      elObjexamen.examenes.push(elObj);// {examenes: [{id, fecha, examenes:{preguntas},{preguntas},...}]}    
      
  }
  if (req.body.guardar == 'Agregar más secciones'){
    var jsonex = JSON.stringify(objex); //convert it back to json
    fs.writeFileSync('src/examen.json', jsonex, 'utf-8'); // write it back
    const datas = fs.readFileSync('src/secciones.json', 'utf-8');
    var jsons = JSON.stringify(JSON.parse(datas)); //convert it back to json
    res.render('mostrarexamen', { dats: jsons });
  }else{
    //limpiar examen.json
    var obje = {
      examen: []
    };
    var jsonex = JSON.stringify(obje); //convert it back to json
    fs.writeFileSync('src/examen.json', jsonex, 'utf-8'); // write it back
    //guardar para listar el examen 
    const datos = fs.readFileSync('src/listaexamen.json', 'utf-8');
    elObjex = JSON.parse(datos); //now it an object
    elObjex.examenes.push(elObjexamen); //add some data
    var jsonexam = JSON.stringify(elObjex); //convert it back to json
    fs.writeFileSync('src/listaexamen.json', jsonexam, 'utf-8'); // write it back
    res.render('index', { dats: jsonex });//ver esto despues
  }
  
});


router.post('/generarexamen', (req, res) => {
  var obj = {
    table: []
  };
  var newobj = {
    seccionespreguntas: []
  };
  var elObj = {};
  const data = fs.readFileSync('src/datospreguntas.json', 'utf-8');
  obj = JSON.parse(data); //now it an object
  long=obj.table.length;
  for (j=0; j<long; j++){
    if(obj.table[j].seccion == req.body.nombre){//todas las seciones que tiene el mismo nombre
      elObj = {
        seccion: obj.table[j].seccion,
        id: obj.table[j].id,
        title: obj.table[j].title,
        descripcion: obj.table[j].descripcion,
        opciones: obj.table[j].opciones,
        archivossubidos: obj.table[j].archivossubidos,
        imagensubida: obj.table[j].imagensubida,
        urlsubida: obj.table[j].urlsubida,
        checkboxtitleopcion: obj.table[j].checkboxtitleopcion,
        titleopcion: obj.table[j].titleopcion,
      };
      newobj.seccionespreguntas.push(elObj);//guardo los objetos preguntas [{pregunta},{pregunta}...]
    }
  }
  //sacar la longitud del arreglo creado y recorrerlo con un número aleatorio y cantidad de preguntas ingresadas
  max=req.body.cantpreguntas;
  var obje = {
    examen: []
  };
  const dato = fs.readFileSync('src/examen.json', 'utf-8');
  obje = JSON.parse(dato); //now it an object
  longseccpreg=newobj.seccionespreguntas.length;
  let randomIndex;
  min=0;
  cont=0;
  if (longseccpreg>=max){
    for (i=0; i<max; i++){
      randomIndex = Math.floor(Math.random() * (longseccpreg - min)) + min;// Retorna un entero aleatorio entre min (incluido) y max (excluido)// ¡Usando Math.round() te dará una distribución no-uniforme!
      console.log(randomIndex);
      if (newobj.seccionespreguntas[randomIndex] != null){
        obje.examen.push(newobj.seccionespreguntas[randomIndex]);
        newobj.seccionespreguntas.splice(randomIndex, 1);//borra la pregunta en la posición randomIndex del arreglo de preguntas//asi controla que no se repita el número aleatorio
        cont=cont+1;
      }
      longseccpreg=newobj.seccionespreguntas.length;
    }
    if (cont!=max){
      randomIndex = Math.floor(Math.random() * (longseccpreg - min)) + min;// Retorna un entero aleatorio entre min (incluido) y max (excluido)// ¡Usando Math.round() te dará una distribución no-uniforme!
      if (newobj.seccionespreguntas[randomIndex] != null){
        obje.examen.push(newobj.seccionespreguntas[randomIndex]);
        newobj.seccionespreguntas.splice(randomIndex, 1);//borra la pregunta en la posición randomIndex del arreglo de preguntas//asi controla que no se repita el número aleatorio
      }
    }
  } 
  //guardar el examen con las preguntas aleatorias 
  var jsonex = JSON.stringify(obje); //convert it back to json
  fs.writeFileSync('src/examen.json', jsonex, 'utf-8'); // write it back    
  res.render('mostrarexamfinal', { dats: jsonex });
});

router.get('/creaexamen', (req, res) => {
  const data = fs.readFileSync('src/secciones.json', 'utf-8');
  var json = JSON.stringify(JSON.parse(data)); //convert it back to json
  res.render('mostrarexamen', { dats: json });
});

router.get('/preguntas',(req, res) => {
  const data = fs.readFileSync('src/secciones.json', 'utf-8');
  var json = JSON.stringify(JSON.parse(data)); //convert it back to json
  res.render('preguntasinicio', { dats: json });
});

router.get('/creaseccion',(req, res) => {
  res.render('creaseccion',  { dats:'Generar seccion' });
});

router.post('/nuevaseccion',(req, res) => {
    const  { nombre }  =  req.body ;
    var obj = {
      secciones: []
    };
    var newObj = {
      id: uuid(),
      nombre,
    };
  
    //esta es para leer los datos que ya tengo en el archivo json
    const data = fs.readFileSync('src/secciones.json', 'utf-8');
    obj = JSON.parse(data); //now it an object
    obj.secciones.push(newObj); //add some data
    var json = JSON.stringify(obj); //convert it back to json
    fs.writeFileSync('src/secciones.json', json, 'utf-8'); // write it back 
    res.render('listadosecciones', { dats: json });
});

router.get('/borrar/:id', (req, res) => {
      console.log(req.params.id);
      var obj = {
        secciones: []
      };
      var newobj = {
        secciones: []
      };
      var elObj = {};
      const data = fs.readFileSync('src/secciones.json', 'utf-8')
      obj = JSON.parse(data); //now it an object
      console.log(obj);
      long=obj.secciones.length;
      for (j=0; j<long; j++){
        if(obj.secciones[j].id != req.params.id){
          elObj = {
            id: obj.secciones[j].id,
            nombre: obj.secciones[j].nombre,
          };
          newobj.secciones.push(elObj);
        }
      }
      const json_dats = JSON.stringify(newobj);
      fs.writeFileSync('src/secciones.json', json_dats, 'utf-8');
      res.render('listadosecciones', { dats: json_dats });
});

router.get('/borrarexamen/:id', (req, res) => {
  console.log(req.params.id);
  var obj = {
    examenes: []
  };
  var newobj = {
    examenes: []
  };
  var elObj = {};
  const data = fs.readFileSync('src/listaexamen.json', 'utf-8')
  obj = JSON.parse(data); //now it an object
  console.log(obj);
  long=obj.examenes.length;
  for (j=0; j<long; j++){
    if(obj.examenes[j].id != req.params.id){
      elObj = {
        id: obj.examenes[j].id,
        fecha:obj.examenes[j].fecha,
        //ver para borrar el arreglo de preguntas
        examenes:obj.examenes[j].examenes
        
      };
      newobj.examenes.push(elObj);
    }
  }

  const json_dats = JSON.stringify(newobj);
  fs.writeFileSync('src/listaexamen.json', json_dats, 'utf-8');
  res.render('listadoexamen', { dats: json_dats });
});


router.post('/nuevapregunta',(req, res) => {
  const  { seccion, title ,  descripcion, opciones, archivossubidos, imagensubida, urlsubida}  =  req.body ;
  var obj = {
    table: []
  };
  if (opciones =='Varias opciones'){
    var newObj = {
     id: uuid(), 
     seccion,
     title,  
     descripcion, 
     opciones,
     archivossubidos,
     imagensubida,
     urlsubida,
     checkboxtitleopcion: [],
     titleopcion: ['Opción 1'],
   };
  }else{
    var newObj = {
      id: uuid(), 
      seccion,
      title,  
      descripcion, 
      opciones,
      archivossubidos,
      imagensubida,
      urlsubida,
      checkboxtitleopcion: [],
      titleopcion: [],
    };
  }
  //ver las otras formas de respuesta
  /*obj.table.push(newObj);
  var json = JSON.stringify(obj);
  fs.writeFileSync('src/datospreguntas.json', json, 'utf-8');*/
  
  //esta es para leer los datos que ya tengo en el archivo json
  const data = fs.readFileSync('src/datospreguntas.json', 'utf-8')
  obj = JSON.parse(data); //now it an object
  obj.table.push(newObj); //add some data
  var json = JSON.stringify(obj); //convert it back to json
  fs.writeFileSync('src/datospreguntas.json', json, 'utf-8'); // write it back */
  if (opciones =='Varias opciones'){
      res.render('preguntas', { dats: json }); 
  }else{
      const dato = fs.readFileSync('src/secciones.json', 'utf-8');
      var jsondato = JSON.stringify(JSON.parse(dato)); //convert it back to json
      res.render('preguntasinicio', { dats: jsondato });
  }
});

router.post('/otras_respuesta/:id',(req, res) => {
  var obj = {
    table: []
  }; 
  var newobj = {
    table: []
  };
  var elObj = {};
  const data = fs.readFileSync('src/datospreguntas.json', 'utf-8')
  obj = JSON.parse(data); //now it an object
  long=obj.table.length;
  for (j=0; j<long; j++){
    if(obj.table[j].id == req.params.id){
      elObj = {
        id: req.params.id,
        seccion: req.body.seccion,
        title: req.body.title,
        descripcion: req.body.descripcion,
        opciones: 'Varias opciones', 
        archivossubidos: req.body.archivossubidos, 
        imagensubida: req.body.imagensubida,
        urlsubida: req.body.urlsubida,
        checkboxtitleopcion: req.body.checkboxtitleopcion,
        titleopcion: req.body.titleopcion,
      };
      newobj.table.push(elObj);
    }else{
      elObj = {
        id: obj.table[j].id,
        seccion: obj.table[j].seccion,
        title: obj.table[j].title,
        descripcion: obj.table[j].descripcion,
        opciones: 'Varias opciones', 
        archivossubidos: obj.table[j].archivossubidos, 
        imagensubida: obj.table[j].imagensubida,
        urlsubida: obj.table[j].urlsubida,
        checkboxtitleopcion: obj.table[j].checkboxtitleopcion,
        titleopcion: obj.table[j].titleopcion,
      };
      newobj.table.push(elObj);
    };
  };
  const json_dats = JSON.stringify(newobj);
  fs.writeFileSync('src/datospreguntas.json', json_dats, 'utf-8');
  if (req.body.resotro == 'Guardar'){// si decidio guardar
    const dato = fs.readFileSync('src/secciones.json', 'utf-8');
    var jsondato = JSON.stringify(JSON.parse(dato)); //convert it back to json
    res.render('preguntasinicio', { dats: jsondato });
  }else{// si decidio añadir
    res.render('preguntas', { dats: json_dats });
  };
  
});
/*
router.post('/nuevoexamen',(req, res) => {
  const  { nombre , contenido }  =  req.body ;
  var obj = {
    table: []
  };
  var newObj = {
    //nombreprof: Rita_Zabala, //estoal iniciar session
    id: uuid(),
    nombre,
    contenido,
    //opcionestudiantes:[],
    //fecha, //ver como colocar fecha.... 
    //estado:[], //verde para habilitado o algo asi....agregar todos los datos nuevos de ejs creaexamen
    
  };
  //esta es para la primera vez que cree el json, y borre manualmente el contenido
  /*obj.table.push(newObj);
  var json = JSON.stringify(obj);
  fs.writeFileSync('src/datos.json', json, 'utf-8');
  res.render('pagina', { dats: json });
  
  //esta es para leer los datos que ya tengo en el archivo json
  const data = fs.readFileSync('src/datos.json', 'utf-8')
  obj = JSON.parse(data); //now it an object
  obj.table.push(newObj); //add some data
  var json = JSON.stringify(obj); //convert it back to json
  fs.writeFileSync('src/datos.json', json, 'utf-8'); // write it back 
  res.render('pagina', { dats: json });
 })

router.get('/borrar/:id', (req, res) => {
  console.log(req.params.id);
  var obj = {
    table: []
  };
  var newobj = {
    table: []
  };
  var elObj = {};
  const data = fs.readFileSync('src/datos.json', 'utf-8')
  obj = JSON.parse(data); //now it an object
  console.log(obj);
  long=obj.table.length;
  for (j=0; j<long; j++){
    if(obj.table[j].id != req.params.id){
      elObj = {
        id: obj.table[j].id,
        nombre: obj.table[j].nombre,
        contenido: obj.table[j].contenido
      };
      newobj.table.push(elObj);
    }
  }
  const json_dats = JSON.stringify(newobj);
  fs.writeFileSync('src/datos.json', json_dats, 'utf-8');
  res.render('pagina', { dats: json_dats });
});


*/
module.exports = router;
