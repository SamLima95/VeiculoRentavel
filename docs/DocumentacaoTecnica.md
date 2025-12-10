# 5. DOCUMENTAÇÃO TÉCNICA

## 5.1 Arquitetura do Sistema

O sistema adota uma **Arquitetura Monolítica Modular** integrada através do **Inertia.js**, que permite a construção de uma aplicação Single Page Application (SPA) moderna utilizando o roteamento e controladores do backend clássico.

Esta abordagem elimina a necessidade de uma API REST completa para o consumo interno, permitindo que o frontend (React) e o backend (Laravel) coexistam no mesmo repositório, compartilhando lógica de validação e estado de forma eficiente. O acoplamento é feito via protocolo Inertia, que trafega dados em formato JSON sem recarregar a página, mantendo a experiência fluida de uma SPA com a produtividade de um Monolito.

### 5.1.1 Segmentação de Arquitetura

A arquitetura é segmentada em três camadas principais, com responsabilidades bem definidas:

*   **Camada de Apresentação (Frontend - Client-Side):**
    *   **Responsabilidade:** Renderização da interface do usuário, gestão de estado local e interatividade.
    *   **Tecnologia:** React 19, TypeScript e Tailwind CSS.
    *   **Estrutura:** Localizada em `resources/js`, contendo `Pages` (telas), `Components` (elementos reutilizáveis) e `Layouts` (estruturas mestras). O `app.tsx` serve como ponto de entrada.
    *   **Funcionamento:** As páginas recebem dados (props) diretamente dos controladores do Laravel via Inertia, eliminando a necessidade de chamadas `fetch/axios` manuais para renderização inicial.

*   **Camada de Aplicação e Domínio (Backend - Server-Side):**
    *   **Responsabilidade:** Processamento de regras de negócios, autenticação, autorização, validação de dados e orquestração de persistência.
    *   **Tecnologia:** Laravel 12 (PHP 8.2+).
    *   **Estrutura:** O núcleo reside no diretório `app/`.
        *   `Http/Controllers`: Gerenciam as requisições e retornam respostas Inertia.
        *   `Models`: Representam as entidades de negócio (User, Vehicle, Rental, etc.) e contêm a lógica de relacionamento via Eloquent ORM.
        *   `Services/Repositories` (se aplicável): Encapsulam lógica de negócios complexa.
    *   **Funcionamento:** Intercepta rotas web (`routes/web.php`), processa a lógica de segurança e devolve a View correspondente com os dados contextualizados.

*   **Camada de Persistência (Banco de Dados):**
    *   **Responsabilidade:** Armazenamento persistente e integridade dos dados relacionais.
    *   **Tecnologia:** SQLite (Ambiente de Desenvolvimento) / Compatível com MySQL/PostgreSQL (Produção).
    *   **Estrutura:** Definida através de *Migrations* em `database/migrations`, garantindo versionamento do esquema do banco.
    *   **Entidades Principais:** Usuários, Veículos, Clientes, Reservas, Locações, Manutenções e Entradas Financeiras.

## 5.2 Tecnologias Utilizadas

### 5.2.1 Frontend

*   **React 19:** Biblioteca JavaScript principal para construção de interfaces. Utilizado na versão 19 para aproveitar as novas features de concorrência e otimização de renderização. **Justificativa:** Padrão de mercado para SPAs, robustez e rico ecossistema.
*   **Inertia.js v2:** Biblioteca que conecta o React ao Laravel. **Justificativa:** Permite desenvolver SPAs sem a complexidade de gerenciar uma API REST separada e roteamento no cliente.
*   **TypeScript:** Superset do JavaScript que adiciona tipagem estática. **Justificativa:** Aumenta a segurança do código, previne erros em tempo de execução e melhora a manutenibilidade com autocompletar inteligente nos editores.
*   **Tailwind CSS v4:** Framework CSS utility-first. **Justificativa:** Acelera o desenvolvimento de interfaces customizadas e responsivas diretamente no markup, garantindo consistência visual.
*   **Vite:** Ferramenta de build e bundler. **Justificativa:** Oferece Hot Module Replacement (HMR) extremamente rápido e builds otimizados para produção.
*   **Shadcn/ui (Radix UI):** Coleção de componentes acessíveis e customizáveis. **Justificativa:** Acelera a criação de UI consistente (Modais, Dropsdowns, Dialogs) com acessibilidade garantida.
*   **Lucide React:** Biblioteca de ícones. **Justificativa:** Ícones vetoriais leves e consistentes para a interface.

### 5.2.2 Backend

*   **Laravel 12:** Framework PHP robusto e moderno. **Justificativa:** Fornece toda a infraestrutura necessária (Auth, ORM, Queue, Validation) "out-of-the-box", acelerando o desenvolvimento seguro e escalável.
*   **PHP 8.2+:** Linguagem de programação do backend. **Justificativa:** Versão moderna com melhorias de performance, tipagem forte e features como *readonly classes*.
*   **Eloquent ORM:** Mapeamento Objeto-Relacional do Laravel. **Justificativa:** Abstrai a complexidade do SQL, permitindo manipulação segura e expressiva do banco de dados.

### 5.2.3 Banco de Dados

*   **SQLite (Dev):** Banco de dados relacional embarcado. **Justificativa:** Configuração zero e armazenamento em arquivo local, ideal para agilidade no desenvolvimento e testes.
*   **Estrutura Relacional:** O banco segue modelagem relacional estrita com chaves estrangeiras (Constraints) garantindo a integridade dos dados entre tabelas como `rentals` -> `vehicles` e `rentals` -> `clients`.

### 5.2.4 Ferramentas de Apoio

*   **Composer:** Gerenciador de dependências do PHP.
*   **NPM/Node.js:** Gerenciador de pacotes e runtime para o ecossistema JavaScript/Frontend.
*   **Git:** Controle de versão distribuído.
*   **Prettier & ESLint:** Ferramentas de formatação e análise estática de código para garantir padronização (configurados no `package.json`).

### 5.2.5 Padrões Adotados

*   **MVC (Model-View-Controller):** Padrão arquitetural base do Laravel.
    *   **Model:** Eloquent Models (`app/Models`).
    *   **View:** React Components (`resources/js/Pages`).
    *   **Controller:** Lógica de fluxo (`app/Http/Controllers`).
*   **Inertia Protocol:** Padrão de comunicação onde o servidor define o estado inicial da View via JSON.
*   **Repository Pattern (Opcional/Híbrido):** Uso de abstrações para lógica de dados complexa nos controllers.

### 5.2.6 Boas Práticas e Convenções

*   **Type Safety:** Uso rigoroso de TypeScript no frontend e Type Hints no PHP para garantir previsibilidade dos dados.
*   **Componentização:** Interface dividida em pequenos componentes reutilizáveis (`resources/js/Components`), favorecendo a manutenção.
*   **Mapeamento de Rotas:** Uso de `route()` helper do Ziggy/Inertia para referenciar rotas nomeadas no frontend, evitando hardcoding de URLs.
*   **Validação Back-end First:** Toda entrada de dados é validada via `FormRequest` ou `$request->validate()` no Laravel antes de qualquer processamento.

### 5.2.7 Requisitos de Infraestrutura

*   **Servidor Web:** Compatível com Apache ou Nginx.
*   **Runtime:** PHP 8.2 ou superior com extensões padrão (BCMath, Ctype, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML).
*   **Node.js:** Versão 20+ para o build dos assets via Vite.
*   **Banco de Dados:** SQLite (arquivo com permissão de escrita) ou servidor MySQL 8.0+/PostgreSQL.

### 5.2.8 APIs e Integrações

*   **API Interna (Inertia):** O backend expõe endpoints que retornam respostas Inertia (JSON com propriedades do componente e dados).
*   **Autenticação:** Baseada em Sessão (Cookies), gerenciada nativamente pelo Laravel (Starter Kit), incluindo proteção contra CSRF.

### 5.2.9 Caracterização da API

Embora a aplicação seja primariamente um Monolito SPA (Inertia), os endpoints seguem semântica RESTful:

*   **Verbos HTTP:** GET (Leitura), POST (Criação), PUT/PATCH (Atualização), DELETE (Remoção).
*   **Endpoints:**
    *   `GET /vehicles` - Listagem de veículos.
    *   `POST /rentals` - Criação de nova locação.
    *   `PATCH /vehicles/{id}` - Atualização de dados do veículo.
*   **Payload:** JSON.
*   **Autenticação:** Middleware `auth` protege rotas sensíveis, redirecionando para `/login` se não autenticado.

## 5.3 Repositório e Código-Fonte

O código-fonte é organizado seguindo a estrutura de diretórios padrão do Framework Laravel com Inertia, garantindo familiaridade para mantenedores.

*   **Raiz:** Configurações de ambiente e dependências.
*   **app/**: Coração da lógica de negócio.
*   **resources/js/**: Código fonte da interface React.
*   **database/**: Definições de esquema e seeds.
*   **routes/**: Definição de endpoints web e API.

O versionamento é gerido via Git, com commits semânticos refletindo as funcionalidades implementadas (ex: `feat`, `fix`, `docs`).
