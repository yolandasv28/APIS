 
window.addEventListener('load',function(){

  // firebase
  firebase.initializeApp(config);
  // variable de mapas

 var map; 
 var marker;

 var btnPosicion=document.getElementById('btnPosicion');
 var btnBorrarPosicion=document.getElementById("btnBorrarPosicion");
 var btnGetCanchas=document.getElementById("btnGetCanchas");
 var divCanchas=document.getElementById("canchas");
 var btnCrearCanchas=document.getElementById("btnCrearCanchas");
 var canchasFirebase=[];
 var marcadorFirebase=[];

 var cargando=document.createElement("img");
 cargando.setAttribute("src","./img/cargando.gif");

 //1. crear la referencia al nodo en firebase
 var referencia=firebase.database().ref('canchitas');

 btnGetCanchas.addEventListener('click',()=>{
  // //1. crear la referencia al nodo en firebase
  //   var referencia=firebase.database().ref('canchitas');
  //2. usar funcion de obtencion d eregistros[on, once]
    referencia.once('value',(data)=>{
      // console.log(data);
      // data.forEach((fila)=>{
      //   console.log(`ID ${fila.key}`);
      //   console.log(`Nombre ${fila.val().nombre}`);
      //   console.log(`Direccion ${fila.val().direccion}`);
      //   console.log("-------------------------------");

      // });
      llenarcanchas(data);
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

 let getLocation = ()=>{
 	if(navigator.geolocation){
 		//significa que el navegador tiene disponible la geolocalización
 		navigator.geolocation.getCurrentPosition((position)=>{
 			// console.log("latitud: "+position.coords.latitude);
 			// console.log("longitud: "+position.coords.longitude);
 			miPosicion.lat=position.coords.latitude;
 			miPosicion.lng=position.coords.longitude;
 			// map.setCenter(miPosicion);
 			initMap();
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
                              fila.val().telefono));          
      });

      console.log(canchasFirebase);
      // creando la tabla de canchas
      let tabla=document.createElement("table");
      tabla.setAttribute('class','table');
      canchasFirebase.forEach((cancha)=>{

        let tr=document.createElement("tr");
        let tdId=document.createElement("td");
        tdId.innerHTML=cancha.id;
        let tdNombre=document.createElement("td");
        tdNombre.innerHTML=cancha.nombre;
        tr.append(tdId,tdNombre);
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
    //generando un id nuevo para la cancha
    const nuevakey=referencia.push().key;
    //funcion set en firebase
    // set asigna valores a un determinado nodo o child o ref, set toma la data de un JSON
    referencia.child(nuevakey).set({
      direccion:$('#inputDireccion').val(),
      nombre:$('#inputNombre').val(),
      telefono:$('#inputTelefono').val(),
      lat:-16.405600,
      lng:-71.557362,
    });
  })
      
});
