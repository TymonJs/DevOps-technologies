FROM python:latest
WORKDIR /app
COPY ./server.py .
COPY requirements.txt .
RUN pip install -r requirements.txt
EXPOSE 8080