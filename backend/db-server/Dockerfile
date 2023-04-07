# Use the official Miniconda3 image as the base image
FROM continuumio/miniconda3

# Set the working directory to /app
WORKDIR /app

# Copy the environment.yml file into the working directory
COPY environment.yml .

# Create the Conda environment
RUN conda env create -f environment.yml

# Activate the Conda environment
RUN echo "conda activate smart-backend" >> ~/.bashrc
ENV PATH /opt/conda/envs/smart-backend/bin:$PATH

# Copy the current directory contents into the container at /app
COPY . /app

# Expose the port your app will run on (if applicable)
EXPOSE 5000

# Start the application using the waitress-serve command
CMD ["waitress-serve", "--call", "server:smart_backend"]