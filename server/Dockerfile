# Step 1: Build with Maven
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copy the pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Step 2: Run the app
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Note: This 'cp' line ensures we find the jar even if the name changes slightly
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]