<script setup>
import { ref, onMounted } from "vue";
// Importa o serviço de API, não o axios diretamente
import tarefaService from "./services/tarefaService";

const tarefas = ref([]);
const novaTarefaTitulo = ref("");
const erro = ref(null);

async function carregarTarefas() {
  try {
    erro.value = null;
    const response = await tarefaService.getTarefas();
    tarefas.value = response.data;
  } catch (e) {
    erro.value = "Falha ao carregar tarefas.";
    console.error(e);
  }
}

async function adicionarTarefa() {
  if (!novaTarefaTitulo.value.trim()) return;

  const novaTarefa = {
    titulo: novaTarefaTitulo.value,
    concluida: false,
  };

  try {
    erro.value = null;
    const response = await tarefaService.addTarefa(novaTarefa);
    tarefas.value.push(response.data);
    novaTarefaTitulo.value = "";
  } catch (e) {
    erro.value = "Falha ao adicionar tarefa.";
    console.error(e);
  }
}

async function removerTarefa(id) {
  try {
    erro.value = null;
    await tarefaService.deleteTarefa(id);
    tarefas.value = tarefas.value.filter((t) => t.id !== id);
  } catch (e) {
    erro.value = "Falha ao remover tarefa.";
    console.error(e);
  }
}

onMounted(carregarTarefas);
</script>

<template>
  <main>
    <h1>Lista de Tarefas</h1>
    <div class="form-container">
      <input
        v-model="novaTarefaTitulo"
        @keyup.enter="adicionarTarefa"
        placeholder="Adicionar uma nova tarefa"
      />
      <button @click="adicionarTarefa">Adicionar</button>
    </div>

    <p v-if="erro" class="erro"></p>

    <ul>
    <li v-for="tarefa in tarefas" :key="tarefa.id">

      <span>{{ tarefa.titulo }}</span>

      <button @click="removerTarefa(tarefa.id)" class="btn-remover">X</button>
  </li>
    </ul>
  </main>
</template>

<style scoped>
/* Estilos para melhor visualização */
.erro {
  color: red;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #ccc;
}
.btn-remover {
  background-color: #ff4d4d;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
