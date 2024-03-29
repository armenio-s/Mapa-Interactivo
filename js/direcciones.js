const direccionesModulo = (function() {
  var servicioDirecciones; // Servicio que calcula las direcciones
  var mostradorDirecciones; // Servicio muestra las direcciones

  function calcularRutasConClic() {
    document.getElementById("comoIr").addEventListener("change", function() {
      direccionesModulo.calcularYMostrarRutas();
    });

    document
      .getElementById("calcularMuchos")
      .addEventListener("click", function() {
        direccionesModulo.calcularYMostrarRutas();
      });

    var listasLugares = document.getElementsByClassName("lugares");
    for (var j = 0; j < listasLugares.length; j++) {
      listasLugares[j].addEventListener("change", function() {
        if (
          document.getElementById("desde").value != "" &&
          document.getElementById("desde").value != ""
        ) {
          direccionesModulo.calcularYMostrarRutas();
        }
      });
    }
  }

  // Agrega la dirección en las lista de Lugares Intermedios en caso de que no estén
  function agregarDireccionEnLista(direccion, coord) {
    var lugaresIntermedios = document.getElementById("puntosIntermedios");

    var haceFaltaAgregar = true;
    for (i = 0; i < lugaresIntermedios.length; ++i) {
      if (
        lugaresIntermedios.options[i].text.replace(/\r?\n|\r/g, " ") ===
        direccion.replace(/\r?\n|\r/g, " ")
      ) {
        haceFaltaAgregar = false;
      }
    }
    if (haceFaltaAgregar) {
      var opt = document.createElement("option");
      opt.value = coord;
      opt.innerHTML = direccion;
      lugaresIntermedios.appendChild(opt);
    }
  }

  // Agrega la dirección en las listas de puntos intermedios y lo muestra con el street view
  function agregarDireccionYMostrarEnMapa(direccion, ubicacion) {
    that = this;
    var ubicacionTexto = ubicacion.lat() + "," + ubicacion.lng();
    agregarDireccionEnLista(direccion, ubicacionTexto);
    mapa.setCenter(ubicacion);
    streetViewModulo.fijarStreetView(ubicacion);
    marcadorModulo.mostrarMiMarcador(ubicacion, direccion);
  }

  function agregarDireccion(direccion, ubicacion) {
    that = this;
    var ubicacionTexto = ubicacion.lat() + "," + ubicacion.lng();
    agregarDireccionEnLista(direccion, ubicacionTexto);
    mapa.setCenter(ubicacion);
  }

  function inicializar() {
    calcularRutasConClic();
    $("#agregar").keypress(function(e) {
      if (e.keyCode == 13) {
        var direccion = document.getElementById("agregar").value;
        geocodificadorModulo.usaDireccion(
          direccion,
          direccionesModulo.agregarDireccionYMostrarEnMapa
        );
      }
    });

    $("#desde").keypress(function(e) {
      if (e.keyCode == 13 && document.getElementById("hasta").value != "") {
        direccionesModulo.calcularYMostrarRutas();
      }
    });

    $("#hasta").keypress(function(e) {
      if (e.keyCode == 13 && document.getElementById("desde").value != "") {
        direccionesModulo.calcularYMostrarRutas();
      }
    });
    servicioDirecciones = new google.maps.DirectionsService();
    mostradorDirecciones = new google.maps.DirectionsRenderer({
      draggable: true,
      map: mapa,
      panel: document.getElementById("directions-panel-summary"),
      suppressMarkers: true
    });
  }

  function calcularYMostrarRutas() {
    const direccionOrigen = document.getElementById("desde").value;
    const direccionDestino = document.getElementById("hasta").value;
    const medioTransporte = document.getElementById("comoIr").value;
    const lugaresIntermedios = document.getElementById("puntosIntermedios");
    let travelMode = "";

    switch (medioTransporte) {
      case "Caminando":
        travelMode = "WALKING";
        break;
      case "Bus/Subterraneo/Tren":
        travelMode = "TRANSIT";
        break;
      case "Bicicleta":
        travelMode = "BICYCLING";
        break;
      default:
        travelMode = "DRIVING";
        break;
    }

    const waypoint = [];

    for (let i = 0; i < lugaresIntermedios.length; i++) {
      if (lugaresIntermedios[i].selected) {
        waypoint.push({
          location: lugaresIntermedios[i].value,
          stopover: true
        });
      }
    }

    const Request = {
      origin: direccionOrigen,
      destination: direccionDestino,
      waypoints: waypoint,
      travelMode: travelMode
    };

    servicioDirecciones.route(Request, function(result, status) {
      if (status == "OK") {
        mostradorDirecciones.setDirections(result);
      }
    });
  }

  return {
    inicializar,
    agregarDireccion,
    agregarDireccionEnLista,
    agregarDireccionYMostrarEnMapa,
    calcularYMostrarRutas
  };
})();
