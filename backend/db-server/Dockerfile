# Use the official Miniconda3 base image
FROM continuumio/miniconda3

# Set the working directory
WORKDIR /app

# Copy the environment.yml file to the container
COPY environment.yml ./

# Create the Conda environment
RUN conda env create -f environment.yml

# Activate the Conda environment
RUN echo "source activate smart_env" > ~/.bashrc

# Make sure the environment is activated when running the container
ENV PATH /opt/conda/envs/smart_env/bin:$PATH

# Copy your project files (if necessary)
COPY . .

# Expose any ports your app needs (optional)
EXPOSE 5000

# Define the command to run your app (optional)
CMD ["waitress-serve","--call", "server:smart_backend"]