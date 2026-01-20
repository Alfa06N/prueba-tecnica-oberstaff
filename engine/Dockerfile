FROM python:3.11-slim

WORKDIR /app

# Instalamos dependencias para compilación de extensiones de C (uvloop)
RUN apt-get update && apt-get install -y gcc python3-dev

# Copiamos solo el requirements primero para aprovechar la cache de Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Deshabilitamos el buffer de Python para ver los logs en tiempo real
ENV PYTHONUNBUFFERED=1

CMD ["python", "main.py"]