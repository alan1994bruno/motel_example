# Usa uma imagem que já tem Maven e Java 21
FROM maven:3.9-eclipse-temurin-21

WORKDIR /app

# Copia tudo do seu projeto para dentro do container
COPY . .

# Comando para rodar o Spring Boot
CMD ["mvn", "spring-boot:run"]