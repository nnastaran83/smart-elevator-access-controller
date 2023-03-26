## Smart

A face recognition system for elevator

## Installation

Open the terminal in the project's directory:

```bash
cd frontend
npm create vite@latest .
npm install $(cat package-list.txt)
```

## Docker

Build the docker file:

```bash
docker build -t smart-frontend .\frontend
```

To check Docker Image, execute:

```bash
docker images
```

Run the Docker Container:

```bash
docker run -d --rm -p 5173:5173 --name smart-frontend-container smart-frontend
```