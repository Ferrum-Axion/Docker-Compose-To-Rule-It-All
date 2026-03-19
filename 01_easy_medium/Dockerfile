FROM python:bookworm

RUN pip install flask psycopg2

WORKDIR /app

COPY ./app .

EXPOSE 5000

CMD ["python", "main.py"]