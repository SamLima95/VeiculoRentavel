# Mapa de Paginas e Fluxos

Visao geral das paginas do sistema, agrupadas por modulo, com descricoes e passos de navegacao/uso.

## Modulo de Veiculos
- **Listagem de Veiculos** (`/vehicles`): consulta/gestao da frota com filtros e acoes.
- **Cadastro/Edicao de Veiculo** (`/vehicles/create` ou `/vehicles/{id}/edit`): formulario completo de dados, documentacao, seguro/sinistros e fotos.
- **Detalhes do Veiculo** (`/vehicles/{id}`): visao 360 do veiculo, resumo, timeline de reservas/locacoes/manutencoes e links para editar.
- **Gestao de Manutencao** (`/maintenances` ou via timeline): agenda manutencoes preventivas/corretivas, registra conclusao e custos.

**Fluxo detalhado:**
1) Acesse `/vehicles`, ajuste filtros (placa/status/categoria) e clique em **Cadastrar veiculo**.  
2) Preencha os dados e **Salvar**: apos sucesso, o sistema abre `/vehicles/{id}` (detalhes).  
3) Na pagina de detalhes, use **Editar** ou **Inativar** no topo; na timeline, clique **Agendar manutencao** para registrar preventiva/corretiva.  
4) Ao salvar a manutencao, a timeline eh atualizada e o veiculo fica bloqueado no periodo selecionado.

## Modulo de Reservas
- **Listagem de Reservas** (`/reservations`): visao geral de reservas, status e filtros.
- **Cadastro/Edicao de Reserva** (`/reservations/create` ou `/reservations/{id}/edit`): criacao/ajuste com selecao de veiculo e datas.
- **Detalhes da Reserva** (`/reservations/{id}`): status, historico e acoes (confirmar, cancelar).

**Fluxo detalhado:**
1) Acesse `/reservations`, filtre por periodo/status e clique **Nova reserva**.  
2) Selecione periodo, veiculo disponivel e cliente; clique **Salvar**. Apos salvar, o sistema mostra a tela de detalhes com status Pendente/Confirmada.  
3) Na tela de detalhes, use **Confirmar** para travar disponibilidade ou **Cancelar** para liberar o veiculo; a timeline registra a mudanca.

## Modulo de Locacoes
- **Listagem de Locacoes** (`/rentals`): contratos em andamento, devolucoes pendentes e historico.
- **Cadastro/Edicao de Locacao** (`/rentals/create` ou `/rentals/{id}/edit`): abertura/ajuste de contratos.
- **Detalhes da Locacao** (`/rentals/{id}`): acompanhamento, cobrancas, check-in/out.

**Fluxo detalhado:**
1) Acesse `/rentals`, filtre por status (em andamento/finalizadas/atrasadas) e clique **Nova locacao** ou **Converter reserva**.  
2) Preencha dados do contrato e **Salvar**; o sistema abre `/rentals/{id}`.  
3) Clique **Check-in** para registrar vistoria de retirada (fotos, checklist, combustivel, KM) e confirme para ativar a locacao.  
4) Ao retornar o veiculo, clique **Check-out**, registre KM/combustivel/avarias, confirme e o sistema calcula ajustes e encerra o contrato.

## Modulo de Clientes
- **Listagem de Clientes** (`/clients`): cadastro e gestao de clientes.
- **Detalhes do Cliente** (`/clients/{id}`): dados, documentos e historico de reservas/locacoes.

**Fluxo detalhado:**
1) Acesse `/clients`, use busca por nome/CPF e clique **Cadastrar cliente**.  
2) Preencha o formulario e **Salvar**; apos sucesso, abra `/clients/{id}` para visualizar historico.  
3) Na ficha do cliente, use os atalhos para **Nova reserva** ou **Nova locacao** ja associadas ao cliente.

## Modulo Financeiro
- **Painel Financeiro / Relatorios Gerenciais** (`/finance`): cards de resumo, filtros de periodo/categoria/visao, graficos e exportacao.
- **Configuracao de Tarifas** (`/settings/tariffs`): tabela de precos por categoria e promocoes.
- **Lancamentos** (`/finance/entries`): inclusao/edicao de lancamentos (a definir conforme regras).

**Fluxo detalhado:**
1) Acesse `/finance`, selecione **Periodo**, **Categoria** e **Visao**; revise KPIs e graficos.  
2) Para exportar, clique **Exportar PDF** ou **Exportar CSV**.  
3) Para ajustar precos, siga o link **Configurar tarifas** e salve as alteracoes.  
4) Para detalhar valores, clique **Ver lancamentos** (ou acao equivalente) e inclua/edite registros.

## Modulo de Administracao
- **Administracao** (`/admin`): configuracoes avancadas, perfis, permissoes e auditoria de acoes.

**Fluxo detalhado:**
1) Acesse `/admin`, filtre usuarios por funcao/status ou busque por nome/email.  
2) Clique **Novo usuario** ou **Convidar usuario**, defina papel e salve; o usuario aparece como Pendente/Ativo conforme fluxo de convite.  
3) Na tabela de usuarios, use **Gerenciar** para editar perfil, trocar senha ou desativar.  
4) No painel de auditoria, clique **Ver detalhes** para abrir o log da acao (usuario, IP, horario).

## Modulo de Autenticacao
- **Login** (`/login`): acesso de funcionarios/administradores.
- **Registro** (`/register`): criacao de nova conta.
- **Recuperacao de Senha** (`/forgot-password`, `/reset-password`): fluxo de redefinicao.

**Fluxo detalhado:**
1) No `/login`, informe email/senha ou clique **Esqueci minha senha** para iniciar recuperacao.  
2) Em `/forgot-password`, envie o email; ao receber o link, abra `/reset-password`, defina a nova senha e confirme.  
3) Em `/register`, preencha dados, confirme; apos criar, o sistema autentica e redireciona para o dashboard (ou pagina inicial permitida pelo perfil).
