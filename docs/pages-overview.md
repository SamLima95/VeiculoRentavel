# Mapa de Páginas e Fluxos

Visão geral das páginas do sistema, agrupadas por módulo, com breve descrição e fluxo de navegação/uso esperado.

## Módulo de Veículos
- **Listagem de Veículos** (`/vehicles`): consulta/gestão da frota com filtros e ações.
- **Cadastro/Edição de Veículo** (`/vehicles/create` ou `/vehicles/{id}/edit`): formulário completo de dados, documentação, seguro/sinistros e fotos.
- **Detalhes do Veículo** (`/vehicles/{id}`): visão 360º do veículo, resumo, timeline de reservas/locações/manutenções e links para editar.
- **Gestão de Manutenção** (`/maintenances` ou dentro da timeline): agenda manutenções preventivas/corretivas, registra conclusão e custos.

**Fluxo sugerido:** Listagem de Veículos → Cadastro/Edição de Veículo → Detalhes do Veículo → Gestão de Manutenção (pela timeline ou tela dedicada).

## Módulo de Reservas
- **Listagem de Reservas** (`/reservations`): visão geral de reservas, status e filtros.
- **Cadastro/Edição de Reserva** (`/reservations/create` ou `/reservations/{id}/edit`): criação/ajuste de reservas com seleção de veículo e datas.
- **Detalhes da Reserva** (`/reservations/{id}`): status, histórico e ações (confirmar, cancelar).

**Fluxo sugerido:** Listagem → Criar/Editar → Detalhes (confirmação/cancelamento).

## Módulo de Locações
- **Listagem de Locações** (`/rentals`): contratos em andamento, devoluções pendentes e histórico.
- **Cadastro/Edição de Locação** (`/rentals/create` ou `/rentals/{id}/edit`): abertura/ajuste de contratos.
- **Detalhes da Locação** (`/rentals/{id}`): acompanhamento, cobranças, check-in/out.

**Fluxo sugerido:** Listagem → Criar/Editar → Detalhes (check-in/out e cobrança).

## Módulo de Clientes
- **Listagem de Clientes** (`/clients`): cadastro e gestão de clientes.
- **Detalhes do Cliente** (`/clients/{id}`): dados, documentos e histórico de reservas/locações.

**Fluxo sugerido:** Listagem → Detalhes → Ações relacionadas (reservas/locações).

## Módulo Financeiro
- **Painel Financeiro** (`/finance`): visão de recebíveis, despesas e status de pagamentos.
- **Detalhes/Lançamentos** (`/finance/entries`): inclusão/edição de lançamentos (a definir conforme regras).

**Fluxo sugerido:** Painel → Lançamentos → Conciliação/relatórios.

## Módulo de Administração
- **Administração** (`/admin`): configurações avançadas, perfis e permissões (a definir).

## Módulo de Autenticação
- **Login** (`/login`): acesso de funcionários/administradores.
- **Registro** (`/register`): criação de nova conta.
- **Recuperação de Senha** (`/forgot-password`, `/reset-password`): fluxo de redefinição.

**Fluxo sugerido:** Login → (caso necessário) Registro → Acesso aos módulos conforme permissão.
