

Autarquia de Ensino Superior de Arcoverde
Curso superior de Análise e Desenvolvimento de Sistemas





Documento de Definição de Escopo

Projeto de Desenvolvimento de Sistemas Web



Aluno(a): Samuel Pereira de Lima

Período: 4º Período
Turma: Noturna
Data: 22/08/2025




1.DOCUMENTO DE DEFINIÇÃO DE ESCOPO (DDE)



1.1 Introdução

O presente projeto tem como finalidade o desenvolvimento de uma plataforma web para gerenciamento de locação de veículos, voltada para substituir os processos manuais ainda comuns em locadoras. A solução centraliza operações como cadastro de veículos e clientes, controle de reservas e devoluções, gestão de manutenção da frota, emissão de relatórios financeiros e controle de usuários com diferentes níveis de acesso.



1.2 Visão geral de Documento


 Descrição resumida: Plataforma web para gerenciamento de aluguel de veículos que centraliza reservas, devoluções, manutenção da frota, cadastro de clientes e relatórios financeiros/operacionais, visando eficiência, confiabilidade e rastreabilidade das operações de uma locadora.

Principais funcionalidades (resumo):

Cadastro de veículos e clientes


Controle de reservas e devoluções


Gestão da frota e manutenção


Relatórios de locações e receitas


Controle de usuários com níveis de acesso

1.3 Identificação dos Requisitos

Por convenção, os requisitos são referenciados pelo nome da subseção onde estão descritos, seguido do seu identificador, conforme o esquema abaixo: 

O requisito funcional [Cadastro de Usuários.RF-01] está localizado na subseção “Requisitos Funcionais”, dentro do bloco identificado como [RF-01].

O requisito não funcional [Disponibilidade.NF-04] encontra-se na seção “Requisitos Não Funcionais de Confiabilidade”, no bloco identificado como [NF-04].


1.3.1 Prioridades dos Requisitos

Os requisitos do sistema são classificados em três níveis de prioridade: 

Essencial: indispensável para o funcionamento do sistema. Sem ele, o sistema não opera. Deve ser obrigatoriamente implementado. 

Importante: afeta a qualidade do funcionamento. O sistema pode ser utilizado sem esse requisito, mas de forma insatisfatória. Sua implementação é recomendada. 

Desejável: não interfere nas funcionalidades básicas. O sistema funciona bem sem ele. Pode ser incluído em versões futuras, caso não haja tempo para implementá-lo na versão atual. 

1.4 Identificação do Projeto
Nome do Projeto: Sistema de Gerenciamento de Locação de Veículos
Autor: Samuel Pereira de Lima
Matrícula: 2024130010
Semestre: 4º Período — Turma Noturna

1.5. Objetivo do Projeto

O objetivo principal do sistema é substituir o processo manual de controle de uma locadora de veículos por uma solução informatizada, que ofereça maior eficiência, confiabilidade e segurança na gestão das operações.

A plataforma permitirá o registro completo de veículos e clientes, o gerenciamento de reservas e devoluções com cálculos automáticos de valores e multas, o acompanhamento de manutenções preventivas e corretivas da frota, além da emissão de relatórios gerenciais que apoiem a tomada de decisões estratégicas.

1.6 Justificativa

A locação de veículos é um setor em constante crescimento, especialmente em centros urbanos e regiões turísticas, onde a demanda por mobilidade prática e acessível vem aumentando. Apesar disso, muitas locadoras ainda utilizam processos manuais ou sistemas pouco integrados para gerenciar sua frota, clientes e contratos, o que gera riscos de erros, atrasos e perda de informações importantes.

Entre os principais problemas enfrentados estão:

Erros de disponibilidade, quando dois atendentes reservam o mesmo veículo por falta de controle centralizado.


Perda de dados, ocasionada pelo uso de planilhas ou registros em papel.


Falta de visão gerencial, pela ausência de relatórios que auxiliem na análise do desempenho do negócio.


Ineficiência no atendimento, com tempo excessivo para realizar reservas, registrar locações ou localizar informações de clientes.


O sistema proposto busca solucionar esses desafios por meio de uma plataforma informatizada, segura e centralizada, que permitirá otimizar os processos internos da locadora, garantir maior transparência e rastreabilidade das operações, além de oferecer suporte à gestão estratégica por meio de relatórios claros e confiáveis.



1.7 Escopo do Produto e Entregáveis

1.7.1 Funcionalidades Previstas

Cadastro de Veículos


Inclusão, edição, consulta e inativação de veículos.


Registro de informações detalhadas (modelo, marca, ano, cor, placa, quilometragem, categoria, status de disponibilidade, dados de seguro).


Controle de histórico de alterações.


Cadastro de Clientes


Registro de dados pessoais (nome, CPF, CNH, telefone, endereço, e-mail).


Validação de documentos (CPF e CNH).


Histórico de locações e pendências associadas.


Controle de Reservas


Criação, edição e cancelamento de reservas.


Verificação automática de disponibilidade de veículos.


Prevenção de conflitos de horários e bloqueio para veículos em manutenção.


Gestão de Locações (Retirada/Devolução)


Registro de retirada e devolução de veículos.


Cálculo automático de valores devidos (diárias, quilometragem extra, multas e atrasos).


Emissão de recibos de locação.


Gestão de Manutenção da Frota


Registro de manutenções preventivas e corretivas.


Controle de custos, datas e prestadores de serviço.


Alertas e bloqueio automático de veículos em manutenção.


Relatórios Gerenciais


Relatórios de locações ativas, histórico por cliente, receita por período e utilização da frota.


Geração de tabelas e gráficos.


Exportação de relatórios em CSV e PDF.


Controle de Usuários e Permissões


Cadastro e gerenciamento de contas de usuários (Funcionários e Administradores).


Definição de papéis e níveis de acesso.


Autenticação segura e bloqueio após tentativas inválidas.


Auditoria e Histórico de Ações


Registro de operações críticas (cadastros, alterações, cancelamentos, devoluções).


Logs de ações vinculados a usuário, data e hora.


Consulta de histórico para rastreabilidade.


Notificações e Alertas


Alertas para conflitos de reserva, veículos com manutenção pendente e reservas próximas.


Exibição de notificações no dashboard.


Exportação de Dados


Exportação de relatórios em formatos compatíveis (CSV/PDF).


Apoio à contabilidade e análises externas.

1.7.2. Entregáveis

Documento de requisitos do sistema (funcionais e não funcionais).


Diagramas UML (caso de uso, classes, sequência, arquitetura e ER).


Protótipo de telas (mockups) para validação da interface.


Banco de dados estruturado em MySQL.


Sistema web desenvolvido em Laravel, com:


Módulo de cadastro de veículos e clientes.


Módulo de reservas e locações (retirada/devolução).


Módulo de manutenção da frota.


Módulo de relatórios gerenciais.


Módulo de controle de usuários e permissões.


Funcionalidades de auditoria, notificações e exportação de relatórios.


Testes realizados (funcionais, usabilidade, desempenho e segurança).


Manual do usuário e guia de operação do sistema.


Versão final do sistema implantada em ambiente de hospedagem.

1.8. Premissas e Restrições 

1.8.1. Premissas

Os usuários (administradores e funcionários) terão acesso à internet estável e a dispositivos compatíveis (computadores, tablets ou smartphones).


As informações inseridas no sistema (dados de clientes, veículos e reservas) serão fornecidas corretamente pelos funcionários, evitando inconsistências.


Todos os funcionários receberão treinamento básico para utilização eficiente do sistema.


A locadora disponibilizará a infraestrutura necessária (servidor ou serviço de hospedagem) para execução da aplicação.


Haverá colaboração ativa dos stakeholders (administradores e funcionários) durante o desenvolvimento, fornecendo feedback contínuo.


O sistema será desenvolvido em Laravel (PHP), conforme definido como tecnologia obrigatória.


O banco de dados utilizado será MySQL, garantindo compatibilidade com a infraestrutura existente da locadora.

1.8.2. Restrições 

O sistema será desenvolvido exclusivamente para ambiente web, não havendo versão nativa para dispositivos móveis.


O prazo de entrega do projeto deverá ser respeitado conforme cronograma definido, sem possibilidade de grandes prorrogações.


O desenvolvimento será realizado utilizando PHP com o framework Laravel e banco de dados MySQL, não sendo permitida a troca da stack tecnológica.


O orçamento disponível será limitado aos recursos já previstos, sem aquisição de ferramentas pagas adicionais.


O acesso ao sistema dependerá de conexão com a internet, não havendo suporte para funcionamento totalmente offline.


O sistema será implantado inicialmente em apenas um ambiente de produção (um servidor/hospedagem), sem previsão de replicação em múltiplos servidores.


As funcionalidades implementadas serão apenas as especificadas no escopo do projeto, sem inclusão de requisitos adicionais fora do planejamento.

1.9. Critérios de Aceitação do Projeto

O sistema deve permitir o cadastro, edição, consulta e inativação de veículos e clientes de forma segura e validada.


Deve ser possível realizar reservas e locações com verificação automática de disponibilidade dos veículos.


O sistema deve calcular corretamente os valores de locação, incluindo diárias, quilometragem extra, atrasos e multas.


A plataforma deve registrar e bloquear automaticamente veículos que estejam em manutenção preventiva ou corretiva.


Relatórios gerenciais (locações ativas, histórico de clientes, receita por período e utilização da frota) devem ser gerados corretamente e exportados em PDF e CSV.


O controle de usuários deve permitir a definição de níveis de acesso (administrador e funcionário), garantindo segurança e privacidade dos dados.


O sistema deve registrar um histórico de operações críticas (alterações, cancelamentos, devoluções) para auditoria.


Todas as entradas de dados devem ser validadas para evitar erros ou vulnerabilidades (como SQL Injection e XSS).


O sistema deve estar hospedado e acessível via navegador web em ambiente de produção.


O manual do usuário deve ser entregue, contendo orientações claras de uso das principais funcionalidades.






1.10. Exclusões do Escopo

Aplicativo mobile nativo: a solução será apenas web, acessada via navegador.


Integrações externas: não haverá conexão com gateways de pagamento, órgãos como DETRAN ou softwares contábeis.


Gestão de estoque de peças: manutenções serão registradas, mas sem controle detalhado de peças automotivas.


Recursos de marketing: não serão implementados módulos para envio de e-mails, SMS ou campanhas de fidelização.


Gestão financeira completa: o sistema terá relatórios básicos, mas não substituirá sistemas contábeis.


Assinatura digital de contratos: contratos poderão ser gerados, porém a assinatura será manual/física.


Suporte multilíngue: a aplicação será apenas em português.


Arquitetura em nuvem avançada: a hospedagem será em um único servidor, sem balanceamento de carga.



1.11. Stakeholders Envolvidos

Administradores da locadora: definem requisitos e buscam eficiência e lucratividade.


Funcionários: utilizam o sistema para reservas, locações e atendimento ágil.


Clientes: beneficiam-se de um serviço mais rápido e organizado.


Equipe de desenvolvimento: responsável por implementar e testar o sistema.


Professor orientador: avalia o projeto e garante conformidade acadêmica.









2. DOCUMENTO DE ESPECIFICAÇÃO DE REQUISITOS (ERS)

2.1. Requisitos Funcionais

RF001 – Cadastro de Veículos

Descrição: Permitir cadastro completo de veículos (modelo, marca, ano, cor, placa, quilometragem atual, categoria, status de disponibilidade, dados de seguro). Permitir edição, consulta e inativação.


Atores: Funcionário, Administrador


Entradas: Modelo, marca, ano, placa, quilometragem, categoria, status, dados do seguro.


Regras / Processamento: Validar placa única; controlar histórico de alterações.


Saídas: Veículo registrado/atualizado.


Critérios de Aceitação: Veículo salvo; placa única; possibilidade de marcar como em manutenção.


Prioridade: Essencial


RF002 – Cadastro de Clientes

Descrição: Registrar clientes (nome, CPF, CNH, telefone, endereço, e-mail), com histórico de locações e pendências.


Atores: Funcionário, Administrador


Entradas: Dados pessoais e documentos.


Regras: Validar CPF/CNH formato; impedir duplicidade de cadastro.


Critérios de Aceitação: Cliente salvo e pesquisável; bloqueio em caso de dados inválidos.


Prioridade: Essencial


RF003 – Controle de Reservas

Descrição: Criar/editar/cancelar reservas verificando disponibilidade por período. Registrar autor da operação.


Atores: Funcionário, Administrador


Entradas: Veículo, cliente, data/hora início e fim, observações.


Regras: Impedir reserva dupla; aplicar regras de bloqueio para manutenções programadas.


Critérios de Aceitação: Reservas sem conflito; logs de operação.


Prioridade: Essencial


RF004 – Gestão de Locações (Retirada/Devolução)

Descrição: Registrar retirada e devolução; calcular valor devido (diárias, km extra, multas, atraso); emitir recibo.


Atores: Funcionário, Administrador


Entradas: Dados do contrato, odômetro na retirada e devolução, estado do veículo, observações.


Regras: Cálculo automático do valor; registro de multas; ajuste de disponibilidade.


Critérios de Aceitação: Valores calculados corretamente; recibo emitido; disponibilidade atualizada.


Prioridade: Essencial


RF005 – Controle de Manutenção

Descrição: Registrar manutenções (preventivas/corretivas), custos, datas e prestadores.


Atores: Funcionário, Administrador


Entradas: Veículo, tipo de manutenção, data, custo, descrição.


Regras: Planejamento de próximas manutenções; bloquear reservas se em manutenção.


Critérios de Aceitação: Histórico completo; alertas para manutenções programadas.


Prioridade: Importante


RF006 – Relatórios Gerenciais

Descrição: Gerar relatórios: locações ativas, histórico por cliente, receita por período, utilização da frota.


Atores: Administrador


Entradas: Filtros por período, veículo, cliente.


Saídas: Tabelas e gráficos exportáveis (CSV/PDF).


Critérios de Aceitação: Dados consistentes; exportação funcionando.


Prioridade: Importante


RF007 – Controle de Usuários e Permissões

Descrição: Gerenciar contas de usuários (Funcionário, Administrador) com diferentes permissões.


Atores: Administrador


Entradas: Nome, e-mail, senha, papel.


Regras: Admins podem gerenciar usuários; bloqueio após tentativas inválidas.


Critérios de Aceitação: Autenticação funcionando; permissões aplicadas.


Prioridade: Essencial


RF008 – Auditoria e Histórico de Ações

Descrição: Registrar logs de ações críticas (criação/edição/exclusão de reservas, locações, cadastros).


Atores: Administrador


Entradas: Evento, usuário, timestamp, detalhes.


Saídas: Consulta de histórico.


Critérios de Aceitação: Todas as ações importantes logadas e consultáveis.


Prioridade: Média


RF009 – Notificações e Alertas

Descrição: Notificar administradores sobre conflitos, veículos com manutenção pendente e reservas próximas.


Atores: Administrador, Funcionário


Entradas: Eventos do sistema (reserva criada, manutenção agendada).


Critérios de Aceitação: Alertas visíveis no dashboard; possibilidade de configurar alertas.


Prioridade: Média


RF010 – Integração Simples de Exportação

Descrição: Permitir exportar relatórios em CSV/PDF para uso contábil/manual.


Atores: Administrador


Critérios de Aceitação: Exportação disponível e legível.


Prioridade: Média


Observação: os RFs adicionais podem ser detalhados em histórias de usuário para o backlog (ex.: política de cancelamento, configuração de taxas por categoria de veículo, contratos digitais, etc.).



2.2. Requisitos Não Funcionais

RNF001 – Acesso Web (NF001)

Descrição: Aplicação acessada via navegador (sem instalação nativa).


Critérios: Funciona em Chrome/Firefox/Edge.


RNF002 – Interface Amigável (NF002)

Descrição: Layout responsivo e intuitivo.


Critérios: Usabilidade para usuários com pouca experiência.


RNF003 – Backup de Dados (NF003)

Descrição: Backups automáticos diários; recuperação em até 24h.


Critérios: Processo de restauração documentado.


RNF004 – Desempenho (NF004)

Descrição: Operações críticas respondem em ≤ 3s com até 300 usuários simultâneos.


Critérios: Testes de carga aprovados.


RNF005 – Autenticação Segura (NF005)

Descrição: Senhas criptografadas (bcrypt), bloqueio após 5 tentativas.


Critérios: Fluxo de login seguro implementado.


RNF006 – Controle de Acesso (NF006)

Descrição: Papéis e permissões fines-grained (Funcionário vs Administrador).


Critérios: Acesso a relatórios financeiros restrito a administradores.


RNF007 – Conformidade com LGPD (NF007)

Descrição: Proteção de dados pessoais, criptografia em repouso e em trânsito (HTTPS/TLS).


Critérios: Política de privacidade e tratamento de dados documentada.


RNF008 – Disponibilidade (NF008)

Descrição: Disponibilidade alvo de 99% com manutenção programada fora do horário comercial.


Critérios: Monitoramento e logs de uptime.


RNF009 – Segurança de Aplicação (adicional)

Descrição: Defesa contra SQL Injection, XSS e CSRF; validação server-side e escaping em views.


Critérios: Testes de penetração e verificações automatizadas.

2.3. Regras de Negócio

RN001 – Placa Única
 Cada veículo deve ter placa única no sistema.

RN002 – Reserva sem Conflito
 Não permitir reservas que entrem em conflito por período para o mesmo veículo.

RN003 – Bloqueio por Manutenção
 Veículos marcados como “em manutenção” não devem estar disponíveis para reservas/locações.

RN004 – Cálculo de Valor
 Valor da locação deve considerar diária, km extra e multas; valor final >= 0.

RN005 – Login Único
 Cada usuário possui login único (e-mail) no sistema.

RN006 – Permissão de Administrador
 Somente administradores podem acessar relatórios financeiros e gerenciar usuários.

RN007 – Auditoria Obrigatória
 Operações sensíveis (ex.: cancelamento de reserva, alteração de valores) precisam registrar autor e justificativa.

3. DIAGRAMAS UML/DEPLOYMENT

3.1. Diagrama de Caso de Uso















3.2. Diagrama de Classes e Entidade-Relacionamento (ERD)



4. DOCUMENTO DE ESPECIFICAÇÃO DE INTERFACES (DEI)







4.1 Mockups / Protótipos de Tela

Login → Dashboard → Criar Reserva → Confirmar → Notificação.




Dashboard → Registrar Retirada → Registrar Devolução → Emitir Recibo.








Veículos → Agendar Manutenção → Bloquear datas.




