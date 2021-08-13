const express = require('express');
const router = express.Router();
var body_parser = require('body-parser');
router.use(body_parser.urlencoded({extended:true}));

const fs = require('fs');
const {uuid} = require('uuidv4');
const { Console } = require('console');

router.get('/', (req, res) => {
  res.render('usuario', { dats:'Examenes Online 2021'});
});

router.get('/index', (req, res) => {
  res.render('index', { dats:'Examenes Online 2021'});
});

router.get('/alumno', (req, res) => {
  res.render('usuarioalumno', { dats:'Examenes Online 2021'});
});

router.get('/about', (req, res) => {
  res.render('about', { dats:'Examenes Online 2021'});
});

router.get('/aceptarmensaje', (req, res) => {
  res.render('index', { dats:'Examenes Online 2021'});
});
router.get('/error', (req, res) => {
  res.render('creaseccion', { dats:'error, sección ya existe '});
});

router.get('/usuario', (req, res) => {
  res.render('usuario', { dats:'Examenes Online 2021'});
});


//EXAMENES
router.get('/asignarexamen', (req, res) => {
  const data = fs.readFileSync('src/listaexamen.json', 'utf-8');
  var json = JSON.stringify(JSON.parse(data)); //convert it back to json
  const dataA = fs.readFileSync('src/alumnos.json', 'utf-8');
  var jsonA = JSON.stringify(JSON.parse(dataA)); //convert it back to json
  res.render('listadoexamenesasignados', { dats: json , datsA:jsonA});
})

router.post('/asignaralumno', (req, res) => {
   const  { alumnoasignado }  =  req.body;
   const {idexamen}=req.body;
    var obj = {
    examenes: []
  };
  
  //esta es para leer los datos que ya tengo en el archivo json
  const data = fs.readFileSync('src/listaexamen.json', 'utf-8');
  obj = JSON.parse(data); //now it an object
  long=obj.examenes.length;

  for (j=0; j<long; j++){
    if(obj.examenes[j].id == idexamen){
        obj.examenes[j].alumnoasignado =alumnoasignado;
    }
  }
  var json = JSON.stringify(obj); //convert it back to json
  fs.writeFileSync('src/listaexamen.json', json, 'utf-8'); // write it back
  fs.writeFileSync('src/public/examenalumno.json', json, 'utf-8'); // write it back
  
  const dataA = fs.readFileSync('src/alumnos.json', 'utf-8');
  var jsonA = JSON.stringify(JSON.parse(dataA)); //convert it back to json
  res.render('listadoexamen', { dats: json , datsA:jsonA});
  
})


router.get('/listadoexamen', (req, res) => {
  const data = fs.readFileSync('src/listaexamen.json', 'utf-8');
  var json = JSON.stringify(JSON.parse(data)); //convert it back to json
  const dataA = fs.readFileSync('src/alumnos.json', 'utf-8');
  var jsonA = JSON.stringify(JSON.parse(dataA)); //convert it back to json
  res.render('listadoexamen', { dats: json , datsA:jsonA});
})

router.post('/generarexamenfinal', (req, res) => {
  var obje = {
    examen: []
  };
  var elObj = {};
  var elObjex = {
    examenes : []
  };
  var objFecha = new Date();
  var fechaA=objFecha.toLocaleDateString();
  var elObjexamen = {
    id: uuid(), fecha: fechaA, alumnoasignado:"", examenes: [],
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
          puntaje: req.body.puntaje[i],
          descripcion: obje.examen[i].descripcion,
          opciones: obje.examen[i].opciones,
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
    fs.writeFileSync('src/public/examenalumno.json', jsonexam, 'utf-8'); // write it back
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
      console.log(newobj.seccionespreguntas[randomIndex]);
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
    //guardar el examen con las preguntas aleatorias 
    var jsonex = JSON.stringify(obje); //convert it back to json
    fs.writeFileSync('src/examen.json', jsonex, 'utf-8'); // write it back    
    res.render('mostrarexamfinal', { dats: jsonex });
  }else{
    res.render('mensaje', { dats: '¡No existe la cantidad de preguntas seleccionadas para la sección elegida!' });  
  }
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

//SECCIONES 
router.get('/creaseccion',(req, res) => {
  const data = fs.readFileSync('src/secciones.json', 'utf-8');
  var json = JSON.stringify(JSON.parse(data)); //convert it back to json
  res.render('creaseccion',  { dats: json });
});

router.post('/nuevaseccion',(req, res) => {
    const  { nombre }  =  req.body ;
    var obj = {
      secciones: []
    };
    var newObj = {};
    //esta es para leer los datos que ya tengo en el archivo json
    const data = fs.readFileSync('src/secciones.json', 'utf-8');
    obj = JSON.parse(data); //now it an object
    long=obj.secciones.length;
    cont=0;
    for (j=0; j<long; j++){
         if (obj.secciones[j].nombre == req.body.nombre){
            cont=cont+1;
         }
    };//end for
    if (cont>=1){  
        res.render('error', { dats: 'Sección duplicada!!!!' });
      }else{
        newObj = {
          id: uuid(),
          nombre,
        };
        obj.secciones.push(newObj);
        //add some data
        var json = JSON.stringify(obj); //convert it back to json
        fs.writeFileSync('src/secciones.json', json, 'utf-8'); // write it back 
        res.render('listadosecciones', { dats: json });
    };  
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




//SECCIONES 
router.get('/pregseccion', (req, res) => {
  const data = fs.readFileSync('src/datospreguntas.json', 'utf-8');
  var json = JSON.stringify(JSON.parse(data)); //convert it back to json
  const dataS = fs.readFileSync('src/secciones.json', 'utf-8');
  var jsonS = JSON.stringify(JSON.parse(dataS)); //convert it back to json
  res.render('pregseccion', { dats: json, dataS: jsonS});
  
})
 
 

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
        
      }};
      newobj.examenes.push(elObj);
    
  }

  const json_dats = JSON.stringify(newobj);
  fs.writeFileSync('src/listaexamen.json', json_dats, 'utf-8');
  res.render('listadoexamen', { dats: json_dats });
});


router.post('/nuevapregunta',(req, res) => {
  const  { seccion, title ,  descripcion, opciones}  =  req.body ;
  var obj = {
    table: []
  };
  var newObj = {};
  if (opciones =='Varias opciones'){
    newObj = {
     id: uuid(), 
     seccion,
     title,  
     descripcion, 
     opciones,
     checkboxtitleopcion: [],
     titleopcion: ['Opción 1'],
   };
  }else{
    newObj = {
      id: uuid(), 
      seccion,
      title,  
      descripcion, 
      opciones,
      checkboxtitleopcion: [],
      titleopcion: [],
    };
  }

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
      console.log(req.body.checkboxtitleopcion);
      if (req.body.checkboxtitleopcion==''){
        elObj = {
          id: req.params.id,
          seccion: req.body.seccion,
          title: req.body.title,
          descripcion: req.body.descripcion,
          opciones: 'Varias opciones', 
          checkboxtitleopcion: [],
          titleopcion: req.body.titleopcion,
        };
      }else{
        elObj = {
          id: req.params.id,
          seccion: req.body.seccion,
          title: req.body.title,
          descripcion: req.body.descripcion,
          opciones: 'Varias opciones', 
          checkboxtitleopcion: req.body.checkboxtitleopcion,
          titleopcion: req.body.titleopcion,
        };
      }
      newobj.table.push(elObj);
    }else{
      elObj = {
        id: obj.table[j].id,
        seccion: obj.table[j].seccion,
        title: obj.table[j].title,
        descripcion: obj.table[j].descripcion,
        opciones: 'Varias opciones', 
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
module.exports = router;
