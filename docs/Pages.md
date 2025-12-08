# Estrutura de Páginas e Fluxos do Sistema

Este documento descreve as páginas da aplicação e o fluxo de navegação, baseando-se nos Requisitos Funcionais (RF) e Não Funcionais (RNF).

## 1. Módulo de Autenticação (Acesso Público)

### 1.1. Login
- **Objetivo:** Permitir acesso de funcionários e administradores.
- **Funcionalidades:**
  - Campos de E-mail e Senha.
  - Botão "Entrar".
  - Link "Esqueci minha senha".
- **Requisitos:** RNF005 (Autenticação Segura).

### 1.2. Recuperação de Senha
- **Objetivo:** Redefinir senha de acesso.
- **Fluxo:** Solicitar e-mail -> Enviar link/token -> Definir nova senha.

---

## 2. Módulo de Dashboard (Home)

### 2.1. Dashboard Operacional
- **Objetivo:** Visão geral imediata da operação.
- **Funcionalidades:**
  - Cards de resumo: Veículos Disponíveis, Locações Ativas, Reservas Hoje, Veículos em Manutenção.
  - **Alertas:** Documentos vencendo (RF018), Manutenções atrasadas (RF009).
  - Gráficos rápidos de ocupação da frota.
- **Requisitos:** RF016, RF018, RF009.

---

## 3. Módulo de Veículos

### 3.1. Listagem de Veículos
- **Objetivo:** Consultar e gerenciar a frota.
- **Funcionalidades:**
  - Tabela com: Modelo, Placa, Status (Disponível, Locado, Manutenção), Categoria.
  - **Filtros:** Por placa, status, categoria (RF017).
  - Ações: Visualizar, Editar, Inativar.
- **Requisitos:** RF001.

### 3.2. Cadastro/Edição de Veículo
- **Objetivo:** Adicionar ou alterar dados de um veículo.
- **Funcionalidades:**
  - Formulário: Dados do carro, Seguro (RF012), Documentação.
  - Upload de fotos.
- **Requisitos:** RF001, RF012.

### 3.3. Detalhes do Veículo (Timeline)
- **Objetivo:** Visão 360º do histórico do veículo.
- **Funcionalidades:**
  - Dados cadastrais.
  - **Timeline:** Histórico de reservas, locações, manutenções, sinistros e multas (RF019).
- **Requisitos:** RF019.

### 3.4. Gestão de Manutenção
- **Objetivo:** Controlar manutenções preventivas e corretivas.
- **Funcionalidades:**
  - Agendar manutenção (bloqueia agenda).
  - Registrar conclusão e custos.
- **Requisitos:** RF005, RN003.

---

## 4. Módulo de Clientes

### 4.1. Listagem de Clientes
- **Objetivo:** Gerenciar base de clientes.
- **Funcionalidades:**
  - Tabela com: Nome, CPF, Telefone, Status.
  - Filtros de busca (RF017).
- **Requisitos:** RF002.

### 4.2. Cadastro/Edição de Cliente
- **Objetivo:** Registrar dados do cliente.
- **Funcionalidades:**
  - Dados Pessoais, Endereço, CNH (com validade).
  - Histórico de locações e multas associadas (RF015).
- **Requisitos:** RF002.

---

## 5. Módulo de Reservas

### 5.1. Calendário/Listagem de Reservas
- **Objetivo:** Visualizar ocupação futura.
- **Funcionalidades:**
  - Visualização em Lista ou Calendário.
  - Status: Confirmada, Pendente, Cancelada.
- **Requisitos:** RF003.

### 5.2. Nova Reserva
- **Objetivo:** Criar uma intenção de locação.
- **Funcionalidades:**
  - Seleção de Período (Data/Hora Retirada e Devolução).
  - Seleção de Veículo (apenas disponíveis - RN002).
  - Seleção de Cliente.
  - Estimativa de valor (baseado em tarifas - RF011).
- **Requisitos:** RF003, RN002.

---

## 6. Módulo de Locações (Operação)

### 6.1. Listagem de Locações
- **Objetivo:** Controle de contratos ativos.
- **Funcionalidades:**
  - Filtros: Em andamento, Finalizadas, Atrasadas.
- **Requisitos:** RF004.

### 6.2. Realizar Retirada (Check-in)
- **Objetivo:** Efetivar a entrega do carro ao cliente.
- **Fluxo:**
  1. Confirmar Reserva ou criar nova locação balcão.
  2. **Vistoria Digital:** Fotos e checklist (RF020).
  3. Registro de Combustível e KM (RF014).
  4. **Contrato:** Geração e Assinatura Digital (RF013).
- **Requisitos:** RF004, RF013, RF014, RF020.

### 6.3. Realizar Devolução (Check-out)
- **Objetivo:** Receber o carro e encerrar contrato.
- **Fluxo:**
  1. **Vistoria de Retorno:** Comparar com retirada (RF020).
  2. Conferência de Combustível (Cálculo de taxa se necessário - RF014).
  3. Registro de KM (Cálculo de excedente).
  4. Verificação de Avarias/Sinistros (RF012).
  5. **Fechamento Financeiro:** Cálculo final com multas/atrasos (RF004, RN004).
  6. Emissão de Recibo.
- **Requisitos:** RF004, RF014, RF015.

---

## 7. Módulo Financeiro e Relatórios

### 7.1. Configuração de Tarifas
- **Objetivo:** Definir preços.
- **Funcionalidades:**
  - Tabela de preços por categoria (Diária, KM livre/controlado, Taxas).
  - Promoções sazonais.
- **Requisitos:** RF011.

### 7.2. Relatórios Gerenciais
- **Objetivo:** Análise de dados.
- **Funcionalidades:**
  - Relatórios de Receita, Ocupação, Manutenções.
  - Exportação PDF/CSV (RF010).
- **Requisitos:** RF006, RF010.

---

## 8. Módulo Administrativo

### 8.1. Gestão de Usuários
- **Objetivo:** Controle de acesso ao sistema.
- **Funcionalidades:**
  - Criar usuários (Admin/Funcionário).
  - Redefinir senhas.
- **Requisitos:** RF007, RNF006.

### 8.2. Auditoria (Logs)
- **Objetivo:** Rastreabilidade.
- **Funcionalidades:**
  - Listagem de ações críticas (Quem fez o que e quando).
- **Requisitos:** RF008, RN007.
