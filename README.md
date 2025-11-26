````md
# Flask Hybrid App / Django Backend

Este proyecto utiliza un backend Django.  
Aquí encontrarás los pasos para configurar el entorno local, crear variables de entorno, ejecutar el servidor y usar Docker (incluyendo descarga desde Docker Hub).

---

# 📥 1. Clonar el repositorio

```bash
git clone https://github.com/AldoVasquez07/sv_cs_prof_2025.git
cd tu_repo
````

---

# 🧱 2. Crear y activar entorno virtual

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

# 📦 3. Instalar dependencias

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

# 🔐 4. Crear archivo `.env`

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

> ⚠ Importante: Asegúrate de NO subir este archivo a GitHub.

---

# 🗃️ 5. Migraciones (solo la primera vez)

```bash
python manage.py migrate
```

---

# ▶️ 6. Ejecutar el servidor local

```bash
python manage.py runserver
```

La app estará disponible en:

* [http://127.0.0.1:8000](http://127.0.0.1:8000)
* [http://localhost:8000](http://localhost:8000)

---

# 🐳 7. Ejecutar con Docker (local)

## 🔨 Construir la imagen

```bash
docker build -t flask-hybrid-app .
```

## ▶️ Correr el contenedor

```bash
docker run -p 8000:8000 flask-hybrid-app
```

---

# 📦 8. Descargar la imagen desde Docker Hub

Si quieres ejecutar el proyecto **sin clonar el código**, solo desde la imagen:

```bash
docker pull aldovasquez07/flask-hybrid-app:latest
```

---

# ▶️ 9. Ejecutar la imagen descargada desde Docker Hub

```bash
docker run -p 8000:8000 aldovasquez07/flask-hybrid-app:latest
```

Esto iniciará el backend listo para usar en:

👉 [http://localhost:8000](http://localhost:8000)

---

# 🛑 10. Detener el contenedor

Encuentra el ID del contenedor:

```bash
docker ps
```

Detenlo:

```bash
docker stop <container_id>
```

---

# 🧹 11. Eliminar contenedor/imágenes (opcional)

Eliminar contenedor:

```bash
docker rm <container_id>
```

Eliminar imagen:

```bash
docker rmi aldovasquez07/flask-hybrid-app:latest
```

