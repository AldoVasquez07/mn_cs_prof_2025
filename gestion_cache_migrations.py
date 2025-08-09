import os
import shutil

ruta = input("Ruta a limpiar: ")

carpetas_a_eliminar = ["__pycache__", "migrations"]

if os.path.exists(ruta):
    for ruta_actual, carpetas, archivos in os.walk(ruta):
        for carpeta in carpetas:
            if carpeta in carpetas_a_eliminar:
                carpeta_a_borrar = os.path.join(ruta_actual, carpeta)
                shutil.rmtree(carpeta_a_borrar)
                print(f"Carpeta eliminada: {carpeta_a_borrar}")
else:
    print("La ruta no existe.")
