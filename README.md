# 🔧 Resolução do Problema de CORS

## 🔍 1. Descrição do Erro e Sua Causa

### Erro Encontrado
Durante a integração entre o frontend e o backend, foi identificado o seguinte erro no console do navegador:

```
Access to XMLHttpRequest at 'http://localhost:8080/api/tarefas' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### Causa do Problema
O **CORS (Cross-Origin Resource Sharing)** é um mecanismo de segurança implementado pelos navegadores que bloqueia requisições HTTP entre diferentes origens (domínios, portas ou protocolos).

No nosso caso:
- **Frontend**: Rodando em `http://localhost:5173` (Vite/React)
- **Backend**: Rodando em `http://localhost:8088` (Spring Boot)

Como as portas são diferentes (5173 ≠ 8088), o navegador considera isso uma **requisição cross-origin** e, por segurança, bloqueia o acesso caso o servidor não autorize explicitamente essa comunicação.

---

## 🛠️ 2. Código Alterado e Explicação da Correção

### Solução Implementada: Configuração Global de CORS

Foi criada uma classe de configuração centralizada para gerenciar as políticas de CORS da aplicação.

**Arquivo**: `src/main/java/br/com/tarefas/api/config/WebConfig.java`

```java
package br.com.tarefas.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Aplica a todas as rotas que começam com /api/
            .allowedOrigins("http://localhost:5173") // Autoriza requisições do frontend
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos HTTP permitidos
            .allowedHeaders("*") // Permite todos os cabeçalhos nas requisições
            .allowCredentials(true); // Permite envio de cookies/credenciais
    }
}
```

### 📝 Explicação da Correção

| Configuração | Descrição |
|--------------|-----------|
| `@Configuration` | Indica que esta classe contém configurações do Spring |
| `addMapping("/api/**")` | Define que a política de CORS se aplica a todas as rotas da API |
| `allowedOrigins()` | Especifica quais origens (URLs) podem acessar a API |
| `allowedMethods()` | Define os métodos HTTP aceitos (GET, POST, PUT, DELETE, OPTIONS) |
| `allowedHeaders("*")` | Permite qualquer cabeçalho HTTP nas requisições |
| `allowCredentials(true)` | Permite envio de cookies e credenciais de autenticação |

### ✅ Por que escolhemos a Configuração Global?

- ✔️ **Centralizada**: Toda a configuração CORS em um único lugar
- ✔️ **Fácil manutenção**: Alterações futuras são feitas em apenas um arquivo
- ✔️ **Escalável**: Facilita adicionar novas rotas ou origens
- ✔️ **Boa prática**: Separação de responsabilidades (configuração separada da lógica de negócio)

---

## 🚀 3. Passo a Passo para Executar a Aplicação

### Pré-requisitos
- ☕ Java 21
- 📦 Maven instalado
- 🟢 Node.js e npm instalados
- 🗄️ Banco de dados configurado (MySQL/PostgreSQL/H2)

### 📍 Passo 1: Executar o Backend

```bash
# Navegue até a pasta do backend
cd backend

# Compile e execute o projeto Spring Boot
mvn spring-boot:run
```

✅ O backend estará rodando em: `http://localhost:8088`

Para verificar se está funcionando, acesse: `http://localhost:8088/api/tarefas`

### 📍 Passo 2: Executar o Frontend (Vue.js)

Abra um **novo terminal** e execute:

```bash
# Navegue até a pasta do frontend
cd frontend

# Instale as dependências (apenas na primeira vez)
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

✅ O frontend Vue.js estará rodando em: `http://localhost:5173`

> **Nota**: O Vite (build tool do Vue 3) utiliza a porta 5173 por padrão.

### 📍 Passo 3: Testar a Integração

1. Abra o navegador em `http://localhost:5173`
2. Abra o **DevTools** (F12) e vá até a aba **Console**
3. Tente realizar uma operação (criar, listar, editar ou deletar tarefa)
4. Verifique se **não há mais erros de CORS** no console
5. As requisições devem aparecer com status **200 OK** na aba **Network**

---

## 🎯 Resultado Esperado

Após implementar a configuração de CORS:
- ✅ O frontend consegue se comunicar com o backend sem bloqueios
- ✅ Todas as operações CRUD funcionam corretamente
- ✅ Não há mais erros de CORS no console do navegador
- ✅ As requisições HTTP são processadas normalmente

---

## 📚 Referências

- [Spring Boot - CORS Configuration](https://spring.io/guides/gs/rest-service-cors/)
- [MDN Web Docs - CORS](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS)
- [Entendendo CORS](https://web.dev/cross-origin-resource-sharing/)

---

## ⚠️ Nota Importante para Produção

A configuração atual permite acesso apenas de `http://localhost:5173`. 

**Antes de fazer deploy em produção**, você deve:
1. Substituir `http://localhost:5173` pela URL real do seu frontend
2. Considerar usar variáveis de ambiente para configurar as origens permitidas
3. Revisar as políticas de segurança conforme as necessidades do projeto

```java
// Exemplo com variável de ambiente
.allowedOrigins(System.getenv("FRONTEND_URL"))
```
