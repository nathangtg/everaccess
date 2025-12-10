FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN chmod +x start.sh
RUN pip install --no-cache-dir .

EXPOSE 8000

CMD ["./start.sh"]
