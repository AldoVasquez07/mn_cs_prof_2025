```markdown
# Django Backend y Flask Hybrid App 

Este proyecto utiliza un backend Django con **Python 3.13.2 o superior**. Aquí encontrarás los pasos para configurar el entorno local, crear variables de entorno, ejecutar el servidor y usar Docker (incluyendo descarga desde Docker Hub).

---

## 📋 0. Requisitos previos

### ✅ Verificar versión de Python

Este proyecto requiere **Python 3.13.2 o superior**.

```bash
python --version
```

Si tu versión es inferior a 3.13.2, descarga la última versión desde [python.org](https://www.python.org/downloads/)

---

## 📥 1. Clonar el repositorio

```bash
git clone https://github.com/AldoVasquez07/mn_cs_prof_2025.git
cd mn_cs_prof_2025
```

---

## 🧱 2. Crear y activar entorno virtual

### ▶ Windows

```bash
python -m venv env
env\Scripts\activate
```

### ▶ macOS / Linux

```bash
python3 -m venv env
source env/bin/activate
```

---

## 📦 3. Instalar dependencias

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 🔐 4. Crear archivo `.env`

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres.ptzncgaabplduuxalpqy
DB_PASSWORD=Citas$123456
DB_HOST=aws-0-us-east-2.pooler.supabase.com
DB_PORT=6543
SECRET_KEY=123456
ALLOWED_HOSTS=127.0.0.1,localhost
DEBUG=True
```

> ⚠️ **Importante**: Asegúrate de NO subir este archivo a GitHub. Añádelo a tu `.gitignore`.

---

## ▶️ 5. Ejecutar el servidor local

```bash
python manage.py runserver
```

La app estará disponible en:
* [http://127.0.0.1:8000](http://127.0.0.1:8000)
* [http://localhost:8000](http://localhost:8000)

---

## 🐳 6. Ejecutar con Docker

### 🔨 Opción A: Construir la imagen manualmente

```bash
docker build -t flask-hybrid-app .
```

### ▶️ Correr el contenedor

```bash
docker run -p 8000:8000 flask-hybrid-app
```

### 🚀 Opción B: Usar Docker Compose (Recomendado) para la aplicación princiál

Si tienes un archivo `docker-compose.yml` en la raíz del proyecto, puedes ejecutar:

```bash
docker-compose up --build
```

Esto construirá la imagen y levantará el contenedor automáticamente. Para detenerlo:

```bash
docker-compose down
```

---

## 📦 7. Descargar la imagen desde Docker Hub

Si quieres ejecutar el proyecto **sin clonar el código**, solo desde la imagen:

```bash
docker pull aldovasquez07/flask-hybrid-app:latest
```

---

## ▶️ 8. Ejecutar la imagen descargada desde Docker Hub

```bash
docker run -p 8000:8000 aldovasquez07/flask-hybrid-app:latest
```

Esto iniciará el backend listo para usar en:

👉 [http://localhost:8000](http://localhost:8000)

---

## 🛑 9. Detener el contenedor

### Si usaste `docker run`:

Encuentra el ID del contenedor:

```bash
docker ps
```

Detenlo:

```bash
docker stop <CONTAINER_ID>
```

### Si usaste `docker-compose`:

```bash
docker-compose down
```

---

## 🧹 10. Eliminar contenedor/imágenes (opcional)

### Eliminar contenedor:

```bash
docker rm <CONTAINER_ID>
```

### Eliminar imagen:

```bash
docker rmi aldovasquez07/flask-hybrid-app:latest
```

### Limpiar contenedores y volúmenes de Docker Compose:

```bash
docker-compose down -v
```

---

## 📝 Notas adicionales

- Si encuentras problemas con la versión de Python, asegúrate de estar usando **3.13.2 o superior**
- Para verificar que tu entorno virtual está usando la versión correcta: `python --version` (con el entorno activado)
- Si usas Docker, la imagen ya incluye la versión correcta de Python
- **Docker Compose** simplifica el manejo de contenedores y es la forma recomendada para desarrollo local

---

## 🆘 Solución de problemas

### Error: "Python version not supported"
Actualiza Python a la versión 3.13.2 o superior desde [python.org](https://www.python.org/downloads/)

### Error de conexión a la base de datos
Verifica que las credenciales en el archivo `.env` sean correctas y que tengas acceso a Internet

### Puerto 8000 ya en uso
Detén cualquier otro proceso usando el puerto 8000 o usa un puerto diferente:
```bash
python manage.py runserver 8001
```
