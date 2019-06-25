geocodificadorModulo = (function() {
  var geocodificador;

  function usaDireccion(direccion, funcionALlamar) {
    geocodificador.geocode(
      {
        address: direccion
      },

      function(results, status) {
        if (status == "OK") {
          funcionALlamar(direccion, results[0].geometry.location);
        } else {
          swal("No se pudo mostrar la dirección. Error: " + status);
        }
      }
    );
  }

  function inicializar() {
    var that = this;
    geocodificador = new google.maps.Geocoder();

    document
      .querySelector("#direccion")
      .addEventListener("keypress", function(e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
          var direccion = document.getElementById("direccion").value;
          that.usaDireccion(
            direccion,
            direccionesModulo.agregarDireccionYMostrarEnMapa
          );
        }
      });
  }

  return {
    usaDireccion,
    inicializar
  };
})();
