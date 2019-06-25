marcadorModulo = (function() {
  var miMarcador; // El marcador de la direccion buscada
  var marcadores = []; // Todos los marcadores de la búsqueda
  var marcadoresRuta = []; // Los marcadores de la ruta
  var limites; // Límites del mapa
  var infoVentana; // La ventana con información

  function mostrarMiMarcador(ubicacion) {
    miMarcador = new google.maps.Marker({
      position: ubicacion,
      map: mapa,
      animation: google.maps.Animation.DROP,
      title: document.getElementById("direccion").value
    });
  }

  function agregarDireccionMarcador(marcador) {
    var marcadorLatLng = new google.maps.LatLng({
      lat: marcador.getPosition().lat(),
      lng: marcador.getPosition().lng()
    });
    direccionesModulo.agregarDireccion(marcador.getTitle(), marcadorLatLng);
  }

  function marcadoresEnMapa(marcadores, mapa) {
    for (var i = 0; i < marcadores.length; i++) {
      marcadores[i].setMap(mapa);
    }
  }

  function mostrarMarcadores(marcadores) {
    marcadoresEnMapa(marcadores, mapa);
  }

  function noMostrarMarcadores(marcadores) {
    marcadoresEnMapa(marcadores, null);
  }

  function borrarMarcadores(marcadores) {
    noMostrarMarcadores(marcadores);
    marcadores = [];
  }

  function borrarMarcadoresRuta(marcadores) {
    borrarMarcadores(marcadoresRuta);
  }

  function borrarMarcadoresLugares(marcadores) {
    borrarMarcadores(marcadoresLugares);
  }

  var tipoDeLugar = document.getElementById("tipoDeLugar");
  tipoDeLugar.addEventListener("change", function() {
    if (tipoDeLugar.value != "") {
      marcadorModulo.marcar();
    }
  });

  var rango = document.getElementById("radio");
  rango.addEventListener("change", function() {
    marcadorModulo.marcar();
  });

  rango.addEventListener("input", function() {
    mostrarValor(rango.value);
  });

  crearMarcador = function(lugar) {
    var icono = {
      url: lugar.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var marcador = new google.maps.Marker({
      map: mapa,
      position: lugar.geometry.location,
      title: lugar.name + "\n" + lugar.vicinity,
      icon: icono
    });
    marcadores.push(marcador);

    google.maps.event.addListener(marcador, "dblclick", function() {
      agregarDireccionMarcador(marcador);
    });

    google.maps.event.addListener(marcador, "rightclick", function() {
      var indice;
      for (var i = 0; i < marcadores.length; i++) {
        if (marcadores[i] == marcador) {
          marcadores[i].setMap(null);
          indice = i;
          marcadores.splice(indice, 1);
        }
      }
    });

    var lugarLoc = lugar.geometry.location;
    google.maps.event.addListener(marcador, "click", function() {
      streetViewModulo.fijarStreetView(lugarLoc);
      var valuacion = "No tiene";
      if (lugar.rating) {
        valuacion = lugar.rating.toString();
      }

      if (lugar.photos) {
        var url = lugar.photos[0].getUrl({
          maxWidth: 80,
          maxHeight: 80
        });
      }
      var nombre = lugar.name;
      var nombreLugar = lugar.vecinity;
      if (url) {
        if (nombreLugar) {
          infoVentana.setContent(
            "<h3>" +
              nombre +
              "</h3>" +
              "<img src=" +
              url +
              ">" +
              "<p> Rating: " +
              valuacion +
              "</p>" +
              "<p> Direccion: " +
              nombreLugar +
              "</p>"
          );
        } else {
          infoVentana.setContent(
            "<h3>" +
              nombre +
              "</h3>" +
              "<img src=" +
              url +
              ">" +
              "<p> Rating: " +
              valuacion +
              "</p>"
          );
        }
      } else {
        infoVentana.setContent("<h3>" + nombre + "</h3>");
      }

      infoVentana.open(mapa, this);
    });
  };

  function extenderLimites(lugar) {
    if (lugar.geometry.viewport) {
      limites.union(lugar.geometry.viewport);
    } else {
      limites.extend(lugar.geometry.location);
    }
    mapa.fitBounds(limites);
  }

  function inicializar() {
    $("#direccion").keypress(function(e) {
      if (e.keyCode == 13) {
        marcadorModulo.mostrarMiMarcador();
      }
    });
    infoVentana = new google.maps.InfoWindow();
    limites = new google.maps.LatLngBounds();
  }

  function existeMiMarcador() {
    return miMarcador != undefined;
  }

  function darPosicion() {
    return miMarcador.getPosition();
  }

  function agregarMarcadorRuta(direccion, letra, esInicial) {
    borrarMarcadores(marcadoresRuta);

    var zIndice = 1;
    if (esInicial) {
      zIndice = 2;
    }

    function agregarMarcadorConStreetView(direccion, ubicacion) {
      var marcador = new google.maps.Marker({
        map: mapa,
        position: ubicacion,
        label: letra,
        animation: google.maps.Animation.DROP,
        draggable: false,
        zIndex: zIndice
      });
      limites.extend(ubicacion);
      google.maps.event.addListener(marcador, "click", function() {
        streetViewModulo.fijarStreetView(marcador.position);
      });

      marcadoresRuta.push(marcador);
    }
    geocodificadorModulo.usaDireccion(direccion, agregarMarcadorConStreetView);
    mapa.fitBounds(limites);
  }

  function marcarLugares(resultados, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < resultados.length; i++) {
        crearMarcador(resultados[i]);
        extenderLimites(resultados[i]);
      }
    }
  }

  function marcar() {
    borrarMarcadores(marcadores);
    console.log("lugar: " + document.getElementById("tipoDeLugar").value);
    if (marcadorModulo.existeMiMarcador()) {
      var miPosicion = marcadorModulo.darPosicion();
    } else {
      miPosicion = posicionCentral;
    }
    lugaresModulo.buscarCerca(miPosicion);
    mapa.panTo(miPosicion);
  }

  return {
    inicializar,
    existeMiMarcador,
    darPosicion,
    mostrarMiMarcador,
    agregarMarcadorRuta,
    borrarMarcadores,
    marcarLugares,
    marcar
  };
})();
