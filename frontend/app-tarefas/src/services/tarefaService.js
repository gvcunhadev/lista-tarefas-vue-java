import axios from "axios";

// Instância do Axios com baseURL centralizada
const apiClient = axios.create({
  baseURL: "http://localhost:8088/api", // URL base da API CORRIGIDA
  headers: {
    "Content-Type": "application/json",
  },
});

// Exporta funções específicas para cada endpoint
export default {
  getTarefas() {
    return apiClient.get("/tarefas");
  },
  addTarefa(tarefa) {
    return apiClient.post("/tarefas", tarefa);
  },
  deleteTarefa(id) {
    return apiClient.delete(`/tarefas/${id}`);
  },
};
