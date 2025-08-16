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


document.addEventListener("DOMContentLoaded", function(){
    const selectProfesion = document.getElementById("select-profesion");
    const selectEspecialidad = document.getElementById("select-especialidad");

    selectProfesion.addEventListener("change", function(){
        const especialidadesData = this.options[this.selectedIndex].dataset.codigo;
        
        selectEspecialidad.innerHTML = `<option value="">Seleccionar</option>`;

        if (!especialidadesData) return;

        // Parsear siempre como JSON
        const especialidades = JSON.parse(especialidadesData);

        especialidades.forEach(esp => {
            const option = document.createElement("option");
            option.value = esp.id;
            option.textContent = esp.nombre;
            selectEspecialidad.appendChild(option);
        });
    });
});
