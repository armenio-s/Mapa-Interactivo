streetViewModulo = (function() {
  var paronama; // 'Visor' de StreetView

  function inicializar() {
    panorama = new google.maps.StreetViewPanorama(
      document.getElementById("pano"),
      {
        position: posicionCentral,
        pov: {
          heading: 1,
          pitch: 1
        }
      }
    );
  }

  // Actualiza la ubicación del Panorama
  function fijarStreetView(ubicacion) {
    panorama.setPosition(ubicacion);

    mapa.setStreetView(panorama);
  }

  return {
    inicializar,
    fijarStreetView
  };
})();
