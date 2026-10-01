import axios from 'axios';

// Define o endereço base da sua API Java Spring Boot que está rodando na porta 8080
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

export default api;
