document.addEventListener("DOMContentLoaded", function () {
    // Toggle del formulario de búsqueda en móviles
    const searchButton = document.querySelector('#content nav form .form-input button');
    const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
    const searchForm = document.querySelector('#content nav form');

    if (searchButton && searchButtonIcon && searchForm) {
        searchButton.addEventListener('click', function (e) {
            if (window.innerWidth < 576) {
                e.preventDefault();
                searchForm.classList.toggle('show');
                if (searchForm.classList.contains('show')) {
                    searchButtonIcon.classList.replace('bx-search', 'bx-x');
                } else {
                    searchButtonIcon.classList.replace('bx-x', 'bx-search');
                }
            }
        });
    }

    // Dark Mode Switch (SIN localStorage)
    const switchMode = document.getElementById('switch-mode');

    if (switchMode) {
        switchMode.addEventListener('change', function () {
            if (this.checked) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        });
    }

    // Profile Menu Toggle
    const profileIcon = document.querySelector('.profile');
    const profileMenu = document.querySelector('.profile-menu');

    if (profileIcon && profileMenu) {
        profileIcon.addEventListener('click', function (e) {
            e.preventDefault();
            profileMenu.classList.toggle('show');
        });
    }

    // Cerrar menú de perfil al hacer clic fuera
    window.addEventListener('click', function (e) {
        if (!e.target.closest('.profile')) {
            if (profileMenu) {
                profileMenu.classList.remove('show');
            }
        }
    });

    // ===================================
    // FUNCIONALIDAD DE CARGA DE ARCHIVOS
    // ===================================
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const btnSelectFile = document.getElementById('btnSelectFile');
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const btnRemoveFile = document.getElementById('btnRemoveFile');
    const uploadContent = uploadArea ? uploadArea.querySelector('.upload-content') : null;

    let selectedFile = null;

    // Abrir selector de archivos
    if (btnSelectFile) {
        btnSelectFile.addEventListener('click', function () {
            fileInput.click();
        });
    }

    // Manejar selección de archivo
    if (fileInput) {
        fileInput.addEventListener('change', function (e) {
            const file = e.target.files[0]; // ✅ CORRECTO: se usa e.target, no e.dataTransfer
            if (file) {
                handleFile(file);
            }
        });
    }



    // Drag and Drop
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', function (e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', function (e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');

            const file = e.dataTransfer.files[0];
            if (file) {
                handleFile(file);
            }
        });
    }

    // Función para manejar archivo seleccionado
    function handleFile(file) {
        console.log('Archivo seleccionado:', file.name, 'Tipo:', file.type);

        const validExtensions = ['.jpg', '.jpeg', '.png', '.dcm'];
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

        if (!validExtensions.includes(ext)) {
            alert('Por favor, selecciona un archivo válido (.jpg, .jpeg, .png, .dcm)');
            return;
        }

        selectedFile = file;
        fileName.textContent = file.name;
        uploadContent.style.display = 'none';
        filePreview.style.display = 'flex';

        const imgPreview = document.getElementById('imgPreview');

        // Si es imagen, mostrar preview
        if (ext !== '.dcm' && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imgPreview.src = e.target.result;
                imgPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            imgPreview.style.display = 'none';
            console.log('Archivo DICOM cargado (sin preview visual)');
        }
    }



    // Remover archivo
    if (btnRemoveFile) {
        btnRemoveFile.addEventListener('click', () => {
            selectedFile = null;
            fileInput.value = '';
            uploadContent.style.display = 'flex';
            filePreview.style.display = 'none';
            fileName.textContent = '';
            const img = filePreview.querySelector('.image-preview');
            if (img) img.remove();
            console.log('Archivo eliminado.');
        });
    }

    // ===================================
    // FUNCIONALIDAD DEL FORMULARIO
    // ===================================
    const patientForm = document.getElementById('patientForm');
    const resultsSection = document.getElementById('resultsSection');
    const resultPercentage = document.getElementById('resultPercentage');
    const resultDescription = document.getElementById('resultDescription');

    if (patientForm) {
        patientForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            console.log('Formulario enviado');

            // Validar que se haya subido un archivo
            const fileInputElement = document.getElementById('fileInput');
            if (!fileInputElement || !fileInputElement.files || fileInputElement.files.length === 0) {
                alert('Por favor, sube una ecografía de cerebro antes de realizar la predicción.');
                if (uploadArea) {
                    uploadArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            console.log('Archivo en input:', fileInputElement.files[0].name);

            // Crear FormData directamente del formulario
            const formData = new FormData(patientForm);

            // Verificar que la imagen esté en el FormData
            console.log('FormData contiene:');
            for (let pair of formData.entries()) {
                if (pair[1] instanceof File) {
                    console.log(pair[0], ':', pair[1].name, '(', pair[1].size, 'bytes)');
                } else {
                    console.log(pair[0], ':', pair[1]);
                }
            }

            // Realizar predicción
            await realizarPrediccion(formData);
        });
    }

    // Función para realizar la predicción
    async function realizarPrediccion(formData) {
        const btnPredict = patientForm ? patientForm.querySelector('.btn-predict') : null;

        if (!btnPredict) {
            console.error('Botón de predicción no encontrado');
            return;
        }

        const originalHTML = btnPredict.innerHTML;

        try {
            // Mostrar loading
            btnPredict.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Procesando...';
            btnPredict.disabled = true;

            console.log('Enviando petición a la API...');

            // Llamada al backend Django
            const url = window.location.origin + "/profesionales/prediction-acv-option/realizar/";
            console.log("➡ Fetch a:", url);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'X-CSRFToken': getCookie('csrftoken') },
                body: formData
            });


            console.log('Respuesta recibida:', response.status);

            // Verificar si la respuesta es JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("La respuesta del servidor no es JSON");
            }

            const data = await response.json();
            console.log('Datos recibidos:', data);

            // Restaurar botón
            btnPredict.innerHTML = originalHTML;
            btnPredict.disabled = false;

            if (data.success) {
                mostrarResultados(data.result);
            } else {
                alert('Error: ' + (data.error || 'Error desconocido'));
                console.error('Error en la respuesta:', data);
            }

        } catch (error) {
            console.error('Error completo:', error);
            alert('Ocurrió un error al realizar la predicción: ' + error.message);

            // Restaurar botón
            if (btnPredict) {
                btnPredict.innerHTML = originalHTML;
                btnPredict.disabled = false;
            }
        }
    }

    // Función para mostrar los resultados
    function mostrarResultados(result) {
        console.log('Mostrando resultados:', result);

        const resultIcon = document.querySelector('.result-icon i');
        const probability = parseFloat(result.hybrid_probability) || 0;

        // Actualizar porcentaje principal
        if (resultPercentage) {
            resultPercentage.textContent = `${probability.toFixed(2)}%`;
        }

        // Crear descripción detallada con todos los datos
        let descriptionHTML = `
        <div style="margin-bottom: 15px;">
            <strong>Análisis Completo:</strong><br>
            • Probabilidad Clínica: ${(result.clinical_probability || 0).toFixed(2)}%<br>
            • Probabilidad de Imagen: ${(result.image_probability || 0).toFixed(2)}%<br>
            • Probabilidad Híbrida: ${(result.hybrid_probability || 0).toFixed(2)}%<br>
            • Confianza del Modelo: ${(result.confidence || 0).toFixed(2)}%
        </div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
            <strong>Predicción: ${result.prediction || 'Sin ACV'}</strong><br>
    `;

        // Determinar el nivel de riesgo y actualizar descripción
        if (result.prediction === 'Sin ACV' || probability < 30) {
            descriptionHTML += `Riesgo bajo de ACV. Se recomienda mantener hábitos saludables y realizar chequeos periódicos.`;
            if (resultIcon) {
                resultIcon.className = 'bx bx-check-circle';
                resultIcon.style.color = '#27ae60';
            }
            const resultCard = document.querySelector('.result-card');
            if (resultCard) {
                resultCard.style.borderLeft = '4px solid #27ae60';
            }
        } else if (probability >= 30 && probability < 70) {
            descriptionHTML += `Riesgo moderado de ACV. Se recomienda consultar con un especialista para evaluar medidas preventivas.`;
            if (resultIcon) {
                resultIcon.className = 'bx bx-error-circle';
                resultIcon.style.color = '#f39c12';
            }
            const resultCard = document.querySelector('.result-card');
            if (resultCard) {
                resultCard.style.borderLeft = '4px solid #f39c12';
            }
        } else {
            descriptionHTML += `Riesgo alto de ACV. Es fundamental consultar inmediatamente con un especialista.`;
            if (resultIcon) {
                resultIcon.className = 'bx bx-error-circle';
                resultIcon.style.color = '#e74c3c';
            }
            const resultCard = document.querySelector('.result-card');
            if (resultCard) {
                resultCard.style.borderLeft = '4px solid #e74c3c';
            }
        }

        descriptionHTML += '</div>';

        if (resultDescription) {
            resultDescription.innerHTML = descriptionHTML;
        }

        // Mostrar la sección de resultados
        if (resultsSection) {
            resultsSection.style.display = 'block';
            // Hacer scroll suave hacia los resultados
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        console.log('Resultados mostrados correctamente');
    }

    // Función auxiliar para obtener el CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

});