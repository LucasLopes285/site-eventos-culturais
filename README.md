# Site de Eventos Culturais STM

## 📝 Descrição

**Eventos Culturais STM** é uma aplicação web full-stack desenvolvida como um hub centralizado para a descoberta, criação e gerenciamento de eventos culturais na região de Santarém, Pará. A plataforma atende tanto ao público geral que busca atividades culturais, quanto aos organizadores de eventos e administradores do site, oferecendo diferentes níveis de acesso e funcionalidades.

Este projeto foi desenvolvido como um trabalho acadêmico, demonstrando competências em desenvolvimento full-stack com tecnologias modernas.

---

## ✨ Funcionalidades

### Para Todos os Visitantes:
* 🖼️ **Carrossel de Destaques:** Um banner visualmente atraente na página inicial que rotaciona automaticamente entre os próximos eventos mais importantes.
* 🔍 **Busca e Filtro:** Ferramentas poderosas para pesquisar eventos por nome e filtrar por categoria.
* 📄 **Paginação:** Navegação eficiente para listas longas de eventos.
* ℹ️ **Página de Detalhes:** Cada evento possui sua própria página com design profissional, contendo todas as informações relevantes.

### Para Usuários Cadastrados (Comuns e Admins):
* 👤 **Sistema de Autenticação:** Fluxo completo de Cadastro, Login e Logout com tokens JWT seguros.
* ➕ **Criação de Eventos:** Qualquer usuário cadastrado pode criar novos eventos através de um formulário completo e dinâmico, incluindo upload de imagem.
* ✏️ **Gerenciamento de Conteúdo Próprio:** Usuários podem editar e excluir apenas os eventos que eles mesmos criaram.
* ✔️ **Sistema de Inscrição:** Usuários podem se inscrever e cancelar a inscrição em eventos.
* 🎫 **Simulação de Pagamento:** Janela modal que simula um fluxo de compra de ingresso.
* 📂 **Página "Meus Eventos":** Área pessoal onde o usuário visualiza listas separadas de eventos que criou e eventos nos quais está inscrito.

### Para Administradores:
* 📊 **Dashboard do Administrador:** Página de visão geral com métricas chave da plataforma (total de eventos, usuários, inscrições, etc.).
* 🗑️ **Poderes de Moderação:** Administradores têm permissão para excluir qualquer evento da plataforma.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com tecnologias modernas, separadas em três partes principais:

* **Frontend:**
    * **React.js (Vite):** Para a construção de uma interface de usuário dinâmica e reativa.
    * **React Router:** Para o gerenciamento de rotas em uma Single-Page Application (SPA).
    * **Context API:** Para o gerenciamento de estado global de autenticação.
    * **Axios:** Para realizar as requisições HTTP para o backend.

* **Backend:**
    * **Node.js & Express.js:** Para a construção de uma API RESTful rápida e robusta.
    * **Prisma:** Como ORM moderno para uma interação segura e tipada com o banco de dados.
    * **JWT & Bcrypt.js:** Para a implementação de autenticação segura e hashing de senhas.
    * **Multer:** Como middleware para o tratamento de upload de arquivos (imagens dos eventos).

* **Banco de Dados:**
    * **PostgreSQL:** Um sistema de banco de dados relacional poderoso e de código aberto.

---

## 🚀 Como Rodar o Projeto Localmente

Para executar este projeto em sua máquina, você precisará ter o Node.js e o PostgreSQL instalados.

1.  **Clone o Repositório:**
    ```bash
    git clone [COLE A URL DO SEU REPOSITÓRIO DO GITHUB AQUI]
    cd nome-da-pasta-do-projeto
    ```

2.  **Configuração do Backend:**
    ```bash
    # Entre na pasta do backend
    cd backend

    # Instale as dependências
    npm install

    # Crie um arquivo .env e configure a string de conexão do seu banco
    # DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/eventos_db"
    # JWT_SECRET="seu_segredo_pessoal_aqui"

    # Execute as migrações para criar as tabelas no banco de dados
    npx prisma migrate dev
    ```

3.  **Configuração do Frontend:**
    ```bash
    # Volte para a raiz e entre na pasta do frontend
    cd ../frontend

    # Instale as dependências
    npm install
    ```

4.  **Executando a Aplicação:**
    Você precisará de dois terminais abertos.

    * **No Terminal 1 (Backend):**
        ```bash
        cd backend
        npm run dev
        ```
        *O servidor backend rodará em `http://localhost:3001`.*

    * **No Terminal 2 (Frontend):**
        ```bash
        cd frontend
        npm run dev
        ```
        *A aplicação frontend estará acessível em `http://localhost:5173` (ou a porta que o Vite indicar).*

---


