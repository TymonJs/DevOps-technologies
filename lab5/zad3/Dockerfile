ARG PY_VER=latest
FROM python:${PY_VER}
WORKDIR /myapp
COPY ./myapp ./
RUN pip install -r requirements.txt
CMD ["python","app.py"]

