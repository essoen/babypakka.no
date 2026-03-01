FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Pre-built JAR — run `./gradlew shadowJar` before `docker compose build`
COPY build/libs/*-all.jar app.jar

RUN chown -R appuser:appgroup /app

USER appuser
EXPOSE 8080

ENV JAVA_OPTS="-XX:MaxRAMPercentage=80"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
