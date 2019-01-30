 
window.addEventListener('load',function(){

  // firebase
  firebase.initializeApp(config);
  // variable de mapas

 var map; 
 var marker;

 var btnPosicion=document.getElementById('btnPosicion');
 var btnBorrarPosicion=document.getElementById("btnBorrarPosicion");
 var btnGetCanchas=document.getElementById("btnGetCanchas");

 btnGetCanchas.addEventListener('click',()=>{
  //1. crear la referencia al nodo en firebase
    var referencia=firebase.database().ref('canchitas');
  //2. usar funcion de obtencion d eregistros[on, once]
    referencia.once('value',(data)=>{
      // console.log(data);
      data.forEach((fila)=>{
        console.log(`ID ${fila.key}`);
        console.log(`Nombre ${fila.val().nombre}`);
        console.log(`Direccion ${fila.val().direccion}`);
        console.log("-------------------------------");

      });
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

      
  });
