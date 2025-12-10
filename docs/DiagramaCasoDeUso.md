# Diagrama de Caso de Uso - SamProject

Este documento apresenta o Diagrama de Caso de Uso do sistema, baseando-se nos Requisitos Funcionais (RFs) definidos no projeto.

## Atores
*   **Funcionário:** Responsável pelas operações diárias da locadora, como cadastro de clientes, veículos, realização de reservas e locações.
*   **Administrador:** Possui todas as permissões do Funcionário, além de acesso a configurações sensíveis, relatórios financeiros e gestão de usuários.

## Diagrama (Mermaid)

```mermaid
usecaseDiagram
    actor "Funcionário" as F
    actor "Administrador" as A

    %% Administrador herda permissões de Funcionário
    A --|> F

    package "Gestão de Frota e Clientes" {
        usecase "Cadastrar/Editar Veículos" as UC1
        usecase "Cadastrar/Editar Clientes" as UC2
        usecase "Consultar Histórico Veículo" as UC19
        usecase "Busca Avançada" as UC17
    }

    package "Operacional (Reservas e Locações)" {
        usecase "Gerenciar Reservas" as UC3
        usecase "Realizar Retirada (Check-in)" as UC4a
        usecase "Realizar Devolução (Check-out/Combustível)" as UC4b
        usecase "Gerar/Assinar Contrato Digital" as UC13
        usecase "Realizar Checklist/Fotos" as UC20
        usecase "Visualizar Dashboard Operacional" as UC16
    }

    package "Manutenção e Sinistros" {
        usecase "Registrar Manutenção" as UC5
        usecase "Registrar Sinistro/Seguro" as UC12
    }

    package "Administrativo e Financeiro" {
        usecase "Gerar Relatórios Gerenciais/Exportar" as UC6
        usecase "Gerenciar Usuários e Permissões" as UC7
        usecase "Consultar Logs de Auditoria" as UC8
        usecase "Configurar Taxas e Tarifas" as UC11
        usecase "Gerenciar Multas e Infrações" as UC15
        usecase "Receber Alertas de Documentos Vencidos" as UC18
    }

    %% Conexões do Funcionário
    F --> UC1
    F --> UC2
    F --> UC3
    F --> UC4a
    F --> UC4b
    F --> UC16
    F --> UC5
    F --> UC12
    F --> UC13
    F --> UC17
    F --> UC19
    F --> UC20

    %% Conexões Exclusivas do Administrador
    A --> UC6
    A --> UC7
    A --> UC8
    A --> UC11
    A --> UC15
    A --> UC18
```

## Descrição dos Casos de Uso

| ID | Caso de Uso | Atores | RF Relacionado |
| :--- | :--- | :--- | :--- |
| **UC1** | Cadastrar/Editar Veículos | Funcionário, Admin | RF001 |
| **UC2** | Cadastrar/Editar Clientes | Funcionário, Admin | RF002 |
| **UC3** | Gerenciar Reservas | Funcionário, Admin | RF003 |
| **UC4a** | Realizar Retirada (Check-in) | Funcionário, Admin | RF004 |
| **UC4b** | Realizar Devolução (Check-out) | Funcionário, Admin | RF004, RF014 |
| **UC5** | Registrar Manutenção | Funcionário, Admin | RF005 |
| **UC6** | Gerar Relatórios Gerenciais | Admin | RF006, RF010 |
| **UC7** | Gerenciar Usuários | Admin | RF007 |
| **UC8** | Consultar Logs de Auditoria | Admin | RF008 |
| **UC11** | Configurar Taxas e Tarifas | Admin | RF011 |
| **UC12** | Registrar Sinistro/Seguro | Funcionário, Admin | RF012 |
| **UC13** | Gerar Contrato Digital | Funcionário, Admin | RF013 |
| **UC15** | Gerenciar Multas | Admin | RF015 |
| **UC16** | Visualizar Dashboard | Funcionário, Admin | RF016 |
| **UC17** | Busca Avançada | Funcionário, Admin | RF017 |
| **UC18** | Alertas Doc. Vencidos | Admin | RF018 |
| **UC19** | Histórico Veículo | Funcionário, Admin | RF019 |
| **UC20** | Checklist Digital | Funcionário, Admin | RF020 |
