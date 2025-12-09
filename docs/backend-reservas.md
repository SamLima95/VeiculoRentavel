# Backend - Modulo de Reservas (versao revisada)

Visao de como o backend do modulo de reservas deve funcionar, com dominio fechado, maquina de estados explicita e integracao limpa com veiculos/locacoes.

## 1) Estado e invariantes do dominio
- Maquina de estados (permitidos):
  - pending -> confirmed
  - pending -> cancelled
  - confirmed -> completed
  - confirmed -> cancelled
  - completed e cancelled sao finais.
- Transicoes proibidas:
  - qualquer estado final -> outro estado
  - cancelled -> confirmed/completed
  - completed -> qualquer outro
  - pending/confirmed -> completed se houver conflito de agenda
- Invariantes:
  - Sem overlap de periodo com reservas pending/confirmed nem locacoes ativas para o mesmo veiculo.
  - start_date < end_date; datas futuras para criacao.
  - Reserva confirmed NAO muda o status do veiculo; bloqueio e feito via agenda (VehicleScheduleBlock).
  - Cancelar reserva completed ou convertida em locacao nao e permitido.

## 2) Modelo de dados e bloqueios
- Tabela `reservations` (base):
  - chaves: vehicle_id, client_id, user_id
  - datas: start_date, end_date
  - status: pending | confirmed | cancelled | completed
  - price: estimated_value decimal(10,2)
  - source: enum(internal, api, partner, walkin)
  - notes
  - auditoria: created_by, updated_by
  - indices: (vehicle_id, start_date, end_date), status, start_date, end_date, source
- Tabela `vehicle_schedule_blocks` (agenda/bloqueio):
  - vehicle_id, source_type (reservation|rental|maintenance), source_id
  - start_date, end_date
  - indices: (vehicle_id, start_date, end_date), source_type
- Uso do bloqueio:
  - Reserva confirmed cria bloqueio (source=reservation).
  - Cancelamento remove bloqueio.
  - Edicao de datas: remove bloqueio antigo, valida overlap, recria bloqueio.
  - Conversao para locacao: bloqueio de reserva sai, bloqueio de locacao entra; status do veiculo muda para rented via locacao.

## 3) Arquitetura (DDD lite)
- ReservationRepository: filtros (periodo/status/veiculo/cliente), paginacao, disponibilidade, counters por status, findWithRelations.
- ReservationStatusManager: valida transicoes permitidas/proibidas.
- ReservationValidator: valida periodo, overlap, regras de negocio (pending/confirmed bloqueiam).
- ReservationFactory: cria DTO/instancia com datas normalizadas, status pending, price estimado opcional.
- ReservationService: orquestra create/update/confirm/cancel/complete/convert-to-rental, gerencia bloqueios, dispara eventos, chama auditoria.
- ReservationResource/Collection: labels PT, datas formatadas, resumo de veiculo/cliente, status_label, flags de disponibilidade.

## 4) Eventos de dominio
- ReservationCreated, ReservationUpdated, ReservationPeriodChanged, ReservationConfirmed, ReservationCancelled, ReservationCompleted.
- Listeners:
  - UpdateVehicleScheduleOnReservation (cria/remove bloqueios).
  - UpdateVehicleStatusOnRental (ja existente no modulo de locacao).
  - LogReservationAudit.
  - CreateRentalFromReservation (quando a rota de conversao for acionada).

## 5) Regras de negocio
- Overlap:
  - pending e confirmed bloqueiam novas reservas no periodo (mesmo veiculo).
  - Considerar locacoes ativas e manutencoes via vehicle_schedule_blocks.
- Edicao:
  - Ao mudar datas: liberar bloqueio antigo, validar disponibilidade, recriar bloqueio novo.
  - ReservationUpdated dispara ReservationPeriodChanged se datas mudarem.
- Cancelamento:
  - Nao cancelar completed ou reserva ja convertida em locacao.
  - Cancelar remove bloqueios e gera auditoria.
- Conversao para locacao:
  - Rota dedicada: POST /reservations/{id}/convert-to-rental (recebe dados extra, ex.: km inicial).
  - Efeitos: reserva -> completed, bloqueio de reserva -> bloqueio de locacao, veiculo -> rented (via locacao), evento RentalStarted.

## 6) Rotas e contratos (Inertia/API)
- `GET /reservations`: filtros (periodo, status, veiculo, cliente), paginacao, counters por status.
- `GET /reservations/create|{id}/edit`: form + veiculos disponiveis no periodo + clientes.
- `POST /reservations`: cria pending (opcao de confirmar direto se flag=true).
- `PUT /reservations/{id}`: edita e revalida disponibilidade.
- `POST /reservations/{id}/confirm`: confirma e cria bloqueio.
- `POST /reservations/{id}/cancel`: cancela e remove bloqueio.
- `POST /reservations/{id}/convert-to-rental`: converte, marca completed e dispara fluxo de locacao.
- `GET /reservations/{id}`: detalhe com timeline (eventos de status, conversao), resumo veiculo/cliente, disponibilidade e estimativas.
- `GET /reservations/check-availability?vehicle_id=&start_date=&end_date=&reservation_id?=`:
  - Resposta exemplo: `{ available: true, conflicts: [], suggested_periods: [], price_estimate: 159.99, vehicle_status: "available" }`

## 7) Labels e enums
- Status: pending, confirmed, cancelled, completed. Labels: Pendente, Confirmada, Cancelada, Concluida.
- Source: internal, api, partner, walkin.
- Expor via Resource para o front; mapear labels no front a partir do payload.

## 8) Timeline e estatisticas
- Timeline por reserva: eventos de status (created, updated, period changed, confirmed, cancelled, completed), conversao para locacao.
- Stats em listagem/detalhe: contagem por status, numero de reservas no periodo, conversoes para locacao.

## 9) Testes recomendados
- Disponibilidade/overlap: impedir reservas sobre pending/confirmed ou locacoes ativas; permitir edicao sem se bloquear a si mesma.
- Transicoes: pending->confirmed, confirmed->cancelled, confirmed->completed; negar transicoes proibidas.
- Edicao de datas: libera bloqueio antigo, revalida, recria bloqueio.
- Cancelamento: remove bloqueio, nao permite cancelar completed ou reserva convertida em locacao.
- Integracao: criar bloqueio em confirm; converter para locacao remove bloqueio de reserva e cria de locacao; veiculo rented somente em locacao.
- Concurrency: duas reservas simultaneas para o mesmo periodo/veiculo.

## 10) Diagramas (texto)
- Maquina de estados: pending -> confirmed -> completed; pending -> cancelled; confirmed -> cancelled; completed/cancelled (finais).
- Interacao: Reserva (pending) --confirm--> bloqueio agenda; Reserva confirmed --convert--> Locacao ativa -> veiculo rented; Locacao finalizada -> Reserva completed; cancelamento remove bloqueios.

## 11) Integracao com Locacoes (passo 7)
- Conversao dedicada `POST /reservations/{id}/convert-to-rental`:
  - Verifica disponibilidade no periodo (usar bloqueios).
  - Cria rental (usando dados do veiculo/cliente + km inicial).
  - Marca reserva como completed.
  - Remove bloqueio de reserva e cria bloqueio de locacao.
  - Dispara evento RentalStarted; status do veiculo muda para rented pelo modulo de locacao.
- Cancelamentos/edicoes refletem na agenda:
  - Cancelar -> remove bloqueio de reserva.
  - Editar datas -> remove bloqueio antigo, valida, recria bloqueio.

## 12) Documentacao complementar (passo 8)
- Manter diagrama de maquina de estados no README do modulo ou em ADR.
- Registrar contratos de `check-availability` (payload/resposta) e `convert-to-rental`.
- Descrever fontes (`source` enum) e auditoria (created_by/updated_by).
- Atualizar pages-overview/Pages se novos campos/labels forem expostos.

## 13) Testes recomendados (passo 9)
- Disponibilidade/overlap: reservas pending/confirmed e locacoes impedem novas reservas no periodo; edicao nao bloqueia a si mesma.
- Transicoes: pending->confirmed, confirmed->cancelled, confirmed->completed; negar cancel/confirm em estados finais; validar regra de conversao para locacao.
- Bloqueios: confirmar cria bloqueio; cancelar remove; editar datas recria bloqueio; converter para locacao remove bloqueio de reserva e cria de locacao.
- Integracao: veiculo so muda para rented via locacao; reserva completed nao pode ser cancelada; reserva convertida nao pode ser cancelada.
- Concorrencia: duas reservas simultaneas para o mesmo slot retornam conflito no segundo fluxo.
