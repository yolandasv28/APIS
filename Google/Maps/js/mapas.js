 
window.addEventListener('load',function(){

  // firebase
  firebase.initializeApp(config);
  //creando la referenci al storage de firebase
  firebase.storage().ref();
  // variable de mapas

 var map; 
 var mapLatLng;
 
 var marker;
 var markerLatLng;

 var btnPosicion=document.getElementById('btnPosicion');
 var btnBorrarPosicion=document.getElementById("btnBorrarPosicion");
 var btnGetCanchas=document.getElementById("btnGetCanchas");
 var divCanchas=document.getElementById("canchas");
 var btnCrearCanchas=document.getElementById("btnCrearCanchas");
 var inputLatitud=document.getElementById("inputLatitud");
 var inputLongitud=document.getElementById("inputLongitud");
 var btnSubirArchivo=document.getElementById("btnSubirArchivo");
 var inputPhoto;
 var canchasFirebase=[];
 var marcadoresFirebase=[];
 var urlPhoto;

 var cargando=document.createElement("img");
 cargando.setAttribute("src","./img/cargando.gif");
 

 //1. crear la referencia al nodo en firebase
 var referencia=firebase.database().ref('canchitas');
 //creando la referencia para firebase storage
 var referenciaStorage=firebase.storage().ref();

 btnSubirArchivo.addEventListener('click',()=>{
   inputPhoto=document.getElementById("photo");
   var archivo=inputPhoto.files[0];
   //asignando el nombre del archivo
   //el simbolo + sirve para transformar a entero el contenido al que haga referencia 
   var nombre=+(new Date())+'-'+archivo.name;
   //creando la variable que indicara el tipode contenido que se envia la servidor
   var metadata={
     contentType: archivo.type

   }

   //promesa: espera a funciones asincronas

   referenciaStorage.child(nombre)
                    .put(archivo,metadata)
                    .then((snapshot)=>{
                                    return snapshot.ref.getDownloadURL()
                                  }).then((url)=>{
                                    console.log(url);
                                    urlPhoto=url;
                                  }).catch((error)=>{
                                    console.log("error",error);
                                  });  

 });


 btnGetCanchas.addEventListener('click',()=>{
      //1. crear la referencia al nodo en firebase
      //   var referencia=firebase.database().ref('canchitas');
      //2. usar funcion de obtencion d eregistros[on, once]
      // ONCE:
      // referencia.once('value',(data)=>{
      // console.log(data);
      // data.forEach((fila)=>{
      //   console.log(`ID ${fila.key}`);
      //   console.log(`Nombre ${fila.val().nombre}`);
      //   console.log(`Direccion ${fila.val().direccion}`);
      //   console.log("-------------------------------");

      // });

      //ON: TRAE LA DATA CADA VEZ QUE ESTA ES ALTERADA
      divCanchas.innerHTML="";
      divCanchas.append(cargando);
      canchasFirebase=[];

      referencia.on('value',(data)=>{
      divCanchas.innerHTML="";
      llenarcanchas(data);
      canchasFirebase=[];
    })
 });

 btnPosicion.addEventListener('click',()=>{
 	  marker=new google.maps.Marker({
 		position:miPosicion,
 		map:map,
    draggable:true,
    icon:'./img/group.png'
 	})
 });

btnBorrarPosicion.addEventListener('click',()=>{
  marker.setMap(null);
});


 var div=document.getElementById('map');
 var miPosicion={
 	lat:0,
 	lng:0
 }

 //usando la geolocalizacion(nativo de javascript)
 function initMap() {
        map = new google.maps.Map(div, {
          // center: {lat: -34.397, lng: 150.644},
          center:miPosicion,
          zoom: 13
        });
      }

  function initMapLatLng(){
    mapLatLng = new google.maps.Map(document.getElementById("mapaLatLng"), {
      // center: {lat: -34.397, lng: 150.644},
      center:miPosicion,
      zoom: 13
    });

    mapLatLng.addListener('click',(coors)=>{

     
      inputLatitud.setAttribute("value",coors.latLng.lat());
      inputLongitud.setAttribute("value",coors.latLng.lng());
      markerLatLng=new google.maps.Marker({
        position:coors.latLng,
        map:mapLatLng,
        draggable:true,
        icon:'./img/marcador.png'
      })
    });

    var inputBusqueda=document.getElementById("inputBusqueda");
    //Creando un elemento de busquea de Google maps
    var searchBox=new google.maps.places.SearchBox(inputBusqueda);
    //inyectando y posicionando un elemento dentro del mapa de google
    mapLatLng.controls[google.maps.ControlPosition.TOP_LEFT].push(inputBusqueda);

    // mapLatLng.addListener('bounds_changed',()=>{
    //   searchBox.setBounds(mapLatLng.getBounds());
    // });
    searchBox.addListener("places_changed",()=>{
      var places=searchBox.getPlaces();
      if(places.length==0)
      {
        return;
      }
      places.forEach((place)=>{
        console.log(place.geometry.location.lat());
      });
    });
    
  }

 let getLocation = ()=>{
 	if(navigator.geolocation){
 		//significa que el navegador tiene disponible la geolocalización
 		navigator.geolocation.getCurrentPosition((position)=>{
       //se solicita al usuario permitir conocer su ubicacion
 			// console.log("latitud: "+position.coords.latitude);
 			// console.log("longitud: "+position.coords.longitude);
 			miPosicion.lat=position.coords.latitude;
 			miPosicion.lng=position.coords.longitude;
 			// map.setCenter(miPosicion);
       initMap();
       initMapLatLng();
 		},(error)=>{
 			console.log("error",error);
 		});	
  	}else{
  		//el navegador no soporta geolocalizacion
  		alert("Tu navegador no soporta geolocalizacion");
  	}
 }

	getLocation();    

  let llenarcanchas=(data)=>{
      if(data){
        divCanchas.innerHTML="";
      data.forEach((fila)=>{
        // console.log(`ID ${fila.key}`);
        // console.log(`Nombre ${fila.val().nombre}`);
        // console.log(`Direccion ${fila.val().direccion}`);
        // console.log("-------------------------------");
        //seeder
        canchasFirebase.push(new Cancha(fila.key,
                              fila.val().direccion,
                              fila.val().lat,
                              fila.val().lng,
                              fila.val().nombre,
                              fila.val().telefono,
                              fila.val().img));          
      });

      console.log(canchasFirebase);
      // creando la tabla de canchas
      let tabla=document.createElement("table");

      tabla.setAttribute('class','table');
      let trCabecera=document.createElement("tr");
      let thId=document.createElement("th");
      let thNombre=document.createElement("th");
      let thImg=document.createElement("th");
      thId.innerHTML="ID";
      thNombre.innerHTML="Nombre";
      thImg.innerHTML="Imagen";
      trCabecera.append(thId,thNombre,thImg);
      tabla.append(trCabecera);

      canchasFirebase.forEach((cancha)=>{

        let tr=document.createElement("tr");
        let tdId=document.createElement("td");
        tdId.innerHTML=cancha.id;
        let tdNombre=document.createElement("td");
        tdNombre.innerHTML=cancha.nombre;
        
        let tdImg=document.createElement("td");
        let img=document.createElement("img");
        img.setAttribute("src",cancha.img);
        tdImg.append(img);
        tr.append(tdId,tdNombre, tdImg);
        tabla.append(tr);

        //llenando marcadores en el mapa
        //creamos un marcador
        let marcadorTmp=new google.maps.Marker({
          position:{lat:cancha.lat,lng:cancha.lng},
          map:map,
          icon:'./img/marcador.png'
        });

        marcadoresFirebase.push(marcadorTmp);



      });
      divCanchas.append(tabla);     

    }else{
      divCanchas.innerHTML="<h2>No hay canchitas</h2>";
    }
  }

  btnCrearCanchas.addEventListener('click',()=>{

  //   inputPhoto=document.getElementById("photo");
  //  var archivo=inputPhoto.files[0];
  //  //asignando el nombre del archivo
  //  //el simbolo + sirve para transformar a entero el contenido al que haga referencia 
  //  var nombre=+(new Date())+'-'+archivo.name;
  //  //creando la variable que indicara el tipode contenido que se envia la servidor
  //  var metadata={
  //    contentType: archivo.type

  //  }

  //  //promesa: espera a funciones asincronas

  //  referenciaStorage.child(nombre)
  //                   .put(archivo,metadata)
  //                   .then((snapshot)=>{
  //                                   return snapshot.ref.getDownloadURL()
  //                                 }).then((url)=>{
  //                                   console.log(url);
  //                                   urlPhoto=url;
  //                                 }).catch((error)=>{
  //                                   console.log("error",error);
  //                                 });  


    //generando un id nuevo para la cancha
    const nuevakey=referencia.push().key;
    //funcion set en firebase
    // set asigna valores a un determinado nodo o child o ref, set toma la data de un JSON
    referencia.child(nuevakey).set({
      direccion:$('#inputDireccion').val(),
      nombre:$('#inputNombre').val(),
      telefono:$('#inputTelefono').val(),
      lat:$('#inputLatitud').val(),
      lng:$('#inputLongitud').val(),
      img:urlPhoto
    },(error)=>{
      if(error){

      }
    });
  })
      
});
