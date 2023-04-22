FROM continuumio/miniconda3

WORKDIR /app

# Create the environment:
COPY environment.yml .
RUN conda env create -f environment.yml

# Make RUN commands use the new environment:
SHELL ["conda", "run", "-n", "smart_env", "/bin/bash", "-c"]

# Demonstrate the environment is activated:
RUN echo "source activate smart_env"

# Copy your project files (if necessary)
COPY . .

# Expose any ports your app needs (optional)
EXPOSE 5000

# Define the command to run your app (optional)
ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "smart_env","waitress-serve","--call", "server:smart_backend"]