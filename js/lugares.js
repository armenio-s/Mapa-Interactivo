const lugaresModulo = (function() {
  let servicioLugares; // Servicio para obtener lugares cercanos e información de lugares(como fotos, puntuación del lugar,etc).

  function autocompletar() {
    let autocomplete = new google.maps.places.Autocomplete(
      $("#direccion,#desde,#hasta")[0],
      { types: ["geocode"] }
    );
    autocomplete.bindTo("bounds", mapa);
    autocomplete.setOptions({ strictBounds: true });

    let areaLimite = new google.maps.Circle({
      center: posicionCentral,
      radius: 20000
    });

    autocomplete.setBounds(areaLimite.getBounds());
  }

  function autocompletarDesde() {
    let autocomplete = new google.maps.places.Autocomplete($("#desde")[0], {
      types: ["geocode"]
    });
    autocomplete.bindTo("bounds", mapa);
    autocomplete.setOptions({ strictBounds: true });

    let areaLimite = new google.maps.Circle({
      center: posicionCentral,
      radius: 20000
    });

    autocomplete.setBounds(areaLimite.getBounds());
  }

  function autocompletarHasta() {
    let autocomplete = new google.maps.places.Autocomplete($("#hasta")[0], {
      types: ["geocode"]
    });
    autocomplete.bindTo("bounds", mapa);
    autocomplete.setOptions({ strictBounds: true });

    let areaLimite = new google.maps.Circle({
      center: posicionCentral,
      radius: 20000
    });

    autocomplete.setBounds(areaLimite.getBounds());
  }

  function autocompletarAgregar() {
    let autocomplete = new google.maps.places.Autocomplete($("#agregar")[0], {
      types: ["geocode"]
    });
    autocomplete.bindTo("bounds", mapa);
    autocomplete.setOptions({ strictBounds: true });

    let areaLimite = new google.maps.Circle({
      center: posicionCentral,
      radius: 20000
    });

    autocomplete.setBounds(areaLimite.getBounds());
  }

  function inicializar() {
    this.servicioLugares = new google.maps.places.PlacesService(mapa);
    autocompletar();
    autocompletarDesde();
    autocompletarHasta();
    autocompletarAgregar();
  }

  // Busca lugares con el tipo especificado en el campo de TipoDeLugar

  function buscarCerca(posicion) {
    let request = {
      location: posicion,
      radius: parseInt($("#radioS").text()).toString(),
      types: [$("#tipoDeLugar")[0].value]
    };

    this.servicioLugares.nearbySearch(request, marcadorModulo.marcarLugares);
  }

  return {
    inicializar,
    buscarCerca
  };
})();
