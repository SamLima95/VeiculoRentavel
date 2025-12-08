# Documento de Especificação de Requisitos (ERS)

## 2.1. Requisitos Funcionais

**RF001 – Cadastro de Veículos**
- **Descrição:** Permitir cadastro completo de veículos (modelo, marca, ano, cor, placa, quilometragem atual, categoria, status de disponibilidade, dados de seguro). Permitir edição, consulta e inativação.
- **Atores:** Funcionário, Administrador
- **Entradas:** Modelo, marca, ano, placa, quilometragem, categoria, status, dados do seguro.
- **Regras / Processamento:** Validar placa única; controlar histórico de alterações.
- **Saídas:** Veículo registrado/atualizado.
- **Critérios de Aceitação:** Veículo salvo; placa única; possibilidade de marcar como em manutenção.
- **Prioridade:** Essencial

**RF002 – Cadastro de Clientes**
- **Descrição:** Registrar clientes (nome, CPF, CNH, telefone, endereço, e-mail), com histórico de locações e pendências.
- **Atores:** Funcionário, Administrador
- **Entradas:** Dados pessoais e documentos.
- **Regras:** Validar CPF/CNH formato; impedir duplicidade de cadastro.
- **Critérios de Aceitação:** Cliente salvo e pesquisável; bloqueio em caso de dados inválidos.
- **Prioridade:** Essencial

**RF003 – Controle de Reservas**
- **Descrição:** Criar/editar/cancelar reservas verificando disponibilidade por período. Registrar autor da operação.
- **Atores:** Funcionário, Administrador
- **Entradas:** Veículo, cliente, data/hora início e fim, observações.
- **Regras:** Impedir reserva dupla; aplicar regras de bloqueio para manutenções programadas.
- **Critérios de Aceitação:** Reservas sem conflito; logs de operação.
- **Prioridade:** Essencial

**RF004 – Gestão de Locações (Retirada/Devolução)**
- **Descrição:** Registrar retirada e devolução; calcular valor devido (diárias, km extra, multas, atraso); emitir recibo.
- **Atores:** Funcionário, Administrador
- **Entradas:** Dados do contrato, odômetro na retirada e devolução, estado do veículo, observações.
- **Regras:** Cálculo automático do valor; registro de multas; ajuste de disponibilidade.
- **Critérios de Aceitação:** Valores calculados corretamente; recibo emitido; disponibilidade atualizada.
- **Prioridade:** Essencial

**RF005 – Controle de Manutenção**
- **Descrição:** Registrar manutenções (preventivas/corretivas), custos, datas e prestadores.
- **Atores:** Funcionário, Administrador
- **Entradas:** Veículo, tipo de manutenção, data, custo, descrição.
- **Regras:** Planejamento de próximas manutenções; bloquear reservas se em manutenção.
- **Critérios de Aceitação:** Histórico completo; alertas para manutenções programadas.
- **Prioridade:** Importante

**RF006 – Relatórios Gerenciais**
- **Descrição:** Gerar relatórios: locações ativas, histórico por cliente, receita por período, utilização da frota.
- **Atores:** Administrador
- **Entradas:** Filtros por período, veículo, cliente.
- **Saídas:** Tabelas e gráficos exportáveis (CSV/PDF).
- **Critérios de Aceitação:** Dados consistentes; exportação funcionando.
- **Prioridade:** Importante

**RF007 – Controle de Usuários e Permissões**
- **Descrição:** Gerenciar contas de usuários (Funcionário, Administrador) com diferentes permissões.
- **Atores:** Administrador
- **Entradas:** Nome, e-mail, senha, papel.
- **Regras:** Admins podem gerenciar usuários; bloqueio após tentativas inválidas.
- **Critérios de Aceitação:** Autenticação funcionando; permissões aplicadas.
- **Prioridade:** Essencial

**RF008 – Auditoria e Histórico de Ações**
- **Descrição:** Registrar logs de ações críticas (criação/edição/exclusão de reservas, locações, cadastros).
- **Atores:** Administrador
- **Entradas:** Evento, usuário, timestamp, detalhes.
- **Saídas:** Consulta de histórico.
- **Critérios de Aceitação:** Todas as ações importantes logadas e consultáveis.
- **Prioridade:** Média

**RF009 – Notificações e Alertas**
- **Descrição:** Notificar administradores sobre conflitos, veículos com manutenção pendente e reservas próximas.
- **Atores:** Administrador, Funcionário
- **Entradas:** Eventos do sistema (reserva criada, manutenção agendada).
- **Critérios de Aceitação:** Alertas visíveis no dashboard; possibilidade de configurar alertas.
- **Prioridade:** Média

**RF010 – Integração Simples de Exportação**
- **Descrição:** Permitir exportar relatórios em CSV/PDF para uso contábil/manual.
- **Atores:** Administrador
- **Critérios de Aceitação:** Exportação disponível e legível.
- **Prioridade:** Média

**RF011 – Gestão de Taxas e Tarifas**
- **Descrição:** Permitir configurar tarifas por categoria de veículo (diária, km adicional, multa por atraso, caução), além de promoções sazonais.
- **Atores:** Administrador
- **Entradas:** Categoria, valores de diária, km extra, multa, regras promocionais.
- **Regras:** Valores devem ser positivos; promoções não podem gerar preço final negativo.
- **Saídas:** Tabela de tarifas atualizada.
- **Critérios de Aceitação:** Tarifas aplicadas automaticamente no cálculo da locação.
- **Prioridade:** Alta

**RF012 – Gestão de Seguro e Sinistros**
- **Descrição:** Registrar apólices de seguro dos veículos e registrar sinistros (acidentes, avarias, roubo).
- **Atores:** Funcionário, Administrador
- **Entradas:** Tipo de sinistro, data, veículo, cliente envolvido, valor estimado.
- **Regras:** Veículo com sinistro grave deve ficar indisponível até revisão.
- **Saídas:** Histórico do sinistro.
- **Critérios de Aceitação:** Veículo atualizado com novo status; sinistro registrado.
- **Prioridade:** Importante

**RF013 – Contrato Digital da Locação**
- **Descrição:** Gerar contrato da locação em PDF contendo termos, dados do cliente, veículo e valores. Permitir assinatura digital simples.
- **Atores:** Funcionário, Administrador
- **Entradas:** Dados da locação.
- **Saídas:** Contrato PDF armazenado e vinculado ao cadastro.
- **Critérios de Aceitação:** Contrato acessível e exportável.
- **Prioridade:** Média

**RF014 – Controle de Combustível**
- **Descrição:** Registrar nível de combustível na retirada e devolução, calculando eventuais cobranças.
- **Atores:** Funcionário
- **Entradas:** Nível em %, litragem ou fotos.
- **Regras:** Se devolvido abaixo do nível de retirada, aplicar taxa automática.
- **Saídas:** Valor calculado.
- **Critérios de Aceitação:** Cálculo correto exibido no recibo.
- **Prioridade:** Alta

**RF015 – Gestão de Multas e Infrações de Trânsito**
- **Descrição:** Registrar multas recebidas após devolução e vincular ao cliente responsável.
- **Atores:** Administrador
- **Entradas:** Dados da multa (data, local, valor, tipo).
- **Regras:** Cliente deve receber notificação; multa deve constar no Histórico.
- **Saídas:** Multa registrada e cliente notificado.
- **Critérios de Aceitação:** Multa vinculada ao contrato daquela locação.
- **Prioridade:** Média

**RF016 – Dashboard Operacional**
- **Descrição:** Exibir visão geral da operação: veículos disponíveis, em manutenção, reservas próximas, locações ativas, alertas.
- **Atores:** Funcionário, Administrador
- **Entradas:** Dados do sistema.
- **Saídas:** Dashboard dinâmico e atualizado.
- **Critérios de Aceitação:** Informações exibidas em tempo real.
- **Prioridade:** Alta

**RF017 – Busca Avançada**
- **Descrição:** Permitir pesquisar veículos, clientes, reservas e locações com filtros combinados e ordenação.
- **Atores:** Funcionário, Administrador
- **Entradas:** Filtros (por placa, nome, status, período).
- **Saídas:** Lista filtrada.
- **Critérios de Aceitação:** Resultados rápidos e corretos.
- **Prioridade:** Média

**RF018 – Avisos de Documentos Vencidos**
- **Descrição:** Notificar quando algum documento do veículo (IPVA, licenciamento, seguro) estiver próximo do vencimento.
- **Atores:** Administrador
- **Entradas:** Datas de vencimento.
- **Saídas:** Alertas no dashboard.
- **Critérios de Aceitação:** Alerta exibido 30 dias antes do vencimento.
- **Prioridade:** Importante

**RF019 – Histórico Completo do Veículo**
- **Descrição:** Exibir timeline com todas as interações do veículo: reservas, locações, manutenções, sinistros, multas.
- **Atores:** Funcionário, Administrador
- **Entradas:** Veículo selecionado.
- **Saídas:** Linha do tempo do veículo.
- **Critérios de Aceitação:** Histórico agrupado e navegável.
- **Prioridade:** Importante

**RF020 – Pré-Check-in e Pré-Check-out Digital**
- **Descrição:** Permitir registrar fotos e checklist do veículo via celular antes da retirada e devolução.
- **Atores:** Funcionário
- **Entradas:** Fotos, checklist, observações.
- **Saídas:** Registro salvo vinculado à locação.
- **Critérios de Aceitação:** Checklist anexado ao contrato de locação.
- **Prioridade:** Alta

> **Observação:** os RFs adicionais podem ser detalhados em histórias de usuário para o backlog (ex.: política de cancelamento, configuração de taxas por categoria de veículo, contratos digitais, etc.).

## 2.2. Requisitos Não Funcionais

**RNF001 – Acesso Web (NF001)**
- **Descrição:** Aplicação acessada via navegador (sem instalação nativa).
- **Critérios:** Funciona em Chrome/Firefox/Edge.

**RNF002 – Interface Amigável (NF002)**
- **Descrição:** Layout responsivo e intuitivo.
- **Critérios:** Usabilidade para usuários com pouca experiência.

**RNF003 – Backup de Dados (NF003)**
- **Descrição:** Backups automáticos diários; recuperação em até 24h.
- **Critérios:** Processo de restauração documentado.

**RNF004 – Desempenho (NF004)**
- **Descrição:** Operações críticas respondem em ≤ 3s com até 300 usuários simultâneos.
- **Critérios:** Testes de carga aprovados.

**RNF005 – Autenticação Segura (NF005)**
- **Descrição:** Senhas criptografadas (bcrypt), bloqueio após 5 tentativas.
- **Critérios:** Fluxo de login seguro implementado.

**RNF006 – Controle de Acesso (NF006)**
- **Descrição:** Papéis e permissões fines-grained (Funcionário vs Administrador).
- **Critérios:** Acesso a relatórios financeiros restrito a administradores.

**RNF007 – Conformidade com LGPD (NF007)**
- **Descrição:** Proteção de dados pessoais, criptografia em repouso e em trânsito (HTTPS/TLS).
- **Critérios:** Política de privacidade e tratamento de dados documentada.

**RNF008 – Disponibilidade (NF008)**
- **Descrição:** Disponibilidade alvo de 99% com manutenção programada fora do horário comercial.
- **Critérios:** Monitoramento e logs de uptime.

**RNF009 – Segurança de Aplicação (adicional)**
- **Descrição:** Defesa contra SQL Injection, XSS e CSRF; validação server-side e escaping em views.
- **Critérios:** Testes de penetração e verificações automatizadas.

## 2.3. Regras de Negócio

**RN001 – Placa Única**
- Cada veículo deve ter placa única no sistema.

**RN002 – Reserva sem Conflito**
- Não permitir reservas que entrem em conflito por período para o mesmo veículo.

**RN003 – Bloqueio por Manutenção**
- Veículos marcados como “em manutenção” não devem estar disponíveis para reservas/locações.

**RN004 – Cálculo de Valor**
- Valor da locação deve considerar diária, km extra e multas; valor final >= 0.

**RN005 – Login Único**
- Cada usuário possui login único (e-mail) no sistema.

**RN006 – Permissão de Administrador**
- Somente administradores podem acessar relatórios financeiros e gerenciar usuários.

**RN007 – Auditoria Obrigatória**
- Operações sensíveis (ex.: cancelamento de reserva, alteração de valores) precisam registrar autor e justificativa.
