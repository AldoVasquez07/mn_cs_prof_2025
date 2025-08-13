document.addEventListener("DOMContentLoaded", function () {
    const selectCiudad = document.getElementById("select-ciudad");
    const selectCodigo = document.getElementById("select-codigo");

    selectCiudad.addEventListener("change", function () {
        const codigo = this.options[this.selectedIndex].dataset.codigo;
        if (codigo) {
            // Limpiamos y ponemos la nueva opción
            selectCodigo.innerHTML = `<option value="${codigo}" selected>${codigo}</option>`;
        } else {
            selectCodigo.innerHTML = `<option value="">Seleccione un código</option>`;
        }
    });
});