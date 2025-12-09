# Backend - Modulo de Locacoes (versao revisada)

Diretriz para o backend de locacoes com dominio fechado, invariantes fortes, integracao com reservas/veiculos/manutencao e controle de bloqueios.

## 1) Objetivo e escopo
- Abrir, acompanhar e encerrar locacoes (check-in/out), integrando reservas e bloqueios de agenda.
- Garantir consistencia de status do veiculo (rented/available/maintenance) e da locacao (active/completed/cancelled).
- Calcular valores (diaria, km extra, combustivel, multas/danos, limpeza, atraso) e registrar vistorias.

## 2) Modelo de dominio, estados e invariantes
- Estados: active -> completed; active -> cancelled. (completed/cancelled sao finais).
- Invariantes:
  - Nao iniciar se houver conflito de periodo com: rental ativa, reserva confirmada, manutencao, ou veiculo status maintenance.
  - Check-in: odometer_pickup >= vehicle.mileage; fuel_pickup entre 0 e 1 (0-100%); veiculo nao em maintenance.
  - Check-out: odometer_return >= odometer_pickup; se nao, alerta/auditoria; atualizar vehicles.mileage = odometer_return.
  - Bloqueios: rental ativa cria bloqueio (source=rental); check-out/cancel remove bloqueio; danos graves criam bloqueio maintenance e status maintenance.
  - planned_return_date obrigatorio para calcular atraso.

## 3) Dados e migracoes (ajustes sugeridos)
- Tabela `rentals` (add/ajustar):
  - Datas: pickup_date (checkin), planned_return_date, return_date (checkout).
  - Medicoes: odometer_pickup (obrig.), odometer_return (obrig. em checkout), fuel_pickup, fuel_return.
  - Financeiro: daily_rate, allowed_km_per_day, extra_km_rate, late_fee_rate, cleaning_fee, fuel_policy (full_to_full|same_to_same|prepaid), damage_cost, extra_charges, discounts, total.
  - Midia/checklist: photos_pickup/return (json), checklist_pickup/return (json), damage_notes.
  - Auditoria: created_by, updated_by.
- Tabela `vehicle_schedule_blocks` ja cobre bloqueios: usar source_type=rental/source_id=rental.id.

## 4) Arquitetura (DDD lite)
- RentalRepository: filtros (status/periodo/cliente/veiculo), findWithRelations, counters, create/remove bloqueios, calculo de ocupacao.
- RentalStatusManager: transicoes permitidas (active->completed/cancelled) e proibidas; valida estados finais.
- RentalValidator: disponibilidade (bloqueios), odometros (pickup >= vehicle.mileage, return >= pickup), combustivel (0-1), veiculo nao em maintenance, checagem de race (lock/transaction).
- RentalFactory: normaliza datas, status inicial active, defaults de tarifas.
- RentalService: criar (de reserva ou direta), check-in (ativa, bloqueio rental, veiculo -> rented), check-out (calculos, atualiza mileage, remove bloqueio, veiculo -> available ou maintenance), cancel (antes de check-in real), damage-report (durante locacao), emitir eventos, integrar com bloqueios e manutencao.
- RentalResource/Collection: labels PT, datas, totais, resumo veiculo/cliente, status_label.

## 5) Eventos e integracao
- Eventos: RentalStarted, RentalFinished, RentalCancelled, RentalOverdueDetected, RentalConvertedFromReservation.
- Listeners:
  - UpdateVehicleStatusOnRental (rented em start; available/maintenance em finish/cancel).
  - UpdateScheduleOnRental (cria/remove bloqueios de rental).
  - CreateMaintenanceOnDamage (pos dano grave: status maintenance + bloqueio).
  - RentalFromReservation: marca reserva completed e troca bloqueio de reservation -> rental.
  - RentalOverdueDetected: cobra multa de atraso e gera alerta/auditoria.

## 6) Regras de negocio
- Check-in:
  - Se partir de reserva: remover bloqueio de reserva, validar disponibilidade, criar bloqueio rental, setar veiculo rented, registrar vistoria (fotos/checklist) e odometro/combustivel.
  - Sem reserva: validar disponibilidade, criar bloqueio rental, setar rented, disparar RentalStarted.
- Check-out:
  - Calculos: diarias (24h ou fracao), km extra (return - pickup - allowed), combustivel (litros_faltantes = cap_tanque * (fuel_pickup - fuel_return); custo = litros * valor_litro), atraso (ceil(diff/planned_return_date) * late_fee_rate), limpeza (cleaning_fee), danos (damage_cost), total.
  - Atualiza vehicles.mileage = odometer_return; remove bloqueio rental; status rental -> completed; veiculo -> available ou maintenance (se dano grave).
- Cancelamento:
  - Permitido apenas antes de check-in real (sem vistoria/odometro registrado) ou dentro de janela curta (ex.: 5 min).
  - Remove bloqueio e veiculo volta a available; estado final cancelled.
- Danos durante locacao:
  - Rota `POST /rentals/{id}/damage-report`: registra dano, opcionalmente cria ordem de manutencao e bloqueio maintenance, mas rental segue active ate checkout ou forca encerramento + status maintenance.
- Conversao reserva -> locacao:
  - Rota dedicada (`/rentals/from-reservation` ou `/reservations/{id}/convert-to-rental`): troca bloqueios (reservation -> rental), reserva -> completed, veiculo -> rented, dispara RentalConvertedFromReservation.

## 7) Rotas e contratos (Inertia/API)
- `GET /rentals`: filtros por status/periodo/veiculo/cliente, counters, paginacao.
- `GET /rentals/create`: formulario (direta ou de reserva).
- `POST /rentals`: cria locacao ativa (check-in).
- `POST /rentals/{id}/check-out`: finaliza com calculos e status.
- `POST /rentals/{id}/cancel`: cancela se ainda nao houve check-in efetivo.
- `POST /rentals/{id}/damage-report`: registra danos em locacao ativa.
- `GET /rentals/{id}`: detalhe com timeline (check-in/out, danos, multas), vistoria e valores.
- `POST /rentals/from-reservation`: conversao dedicada.

## 8) Validacoes (Form Requests)
- Criacao/check-in: vehicle_id, client_id, user_id, pickup_date, planned_return_date, odometer_pickup (>= vehicle.mileage), fuel_pickup (0-1), daily_rate (ou do veiculo), allowed_km_per_day, extra_km_rate, late_fee_rate, cleaning_fee, fuel_policy, fotos/checklist opcionais.
- Check-out: return_date > pickup_date, odometer_return >= odometer_pickup, fuel_return (0-1), danos/multas/extra_charges/discounts numericos, opcional marcar maintenance.
- Disponibilidade: valida overlap em `vehicle_schedule_blocks` (ignora o proprio rental em edicao).
- Status: enums (active, completed, cancelled) com transicoes validadas no service/status manager.

## 9) Timeline e estatisticas
- Timeline: eventos de RentalStarted, damage-report, RentalFinished, multas, manutencoes.
- Stats: contagem por status, ocupacao da frota, receita estimada/real, km rodados, atrasos detectados.

## 10) Testes recomendados
- Disponibilidade/race: impedir start se ha bloqueio; simular duas locacoes simultaneas (transacao/lock).
- Transicoes: active->completed, active->cancelled; negar em finais; cancelar so antes de check-in.
- Odometro/combustivel: pickup >= mileage; return >= pickup; combustivel 0-1; atualizar vehicle mileage no checkout.
- Checkout financeiro: diarias por fracao de 24h, km extra, combustivel (capacidade*tanque), atraso (ceil, multa), limpeza, danos.
- Integracao com reserva: conversao troca bloqueios e marca reserva completed.
- Manutencao: dano grave gera ordem e bloqueio maintenance; veiculo em maintenance bloqueia novas locacoes/reservas.

## 11) Incrementos solicitados (pontos criticos)
- Invariantes reforcados: sem locacao se veiculo em maintenance ou com conflito (rental/reserva/manutencao); odometro_pickup >= vehicle.mileage e odometro_return >= odometro_pickup; combustivel 0-1; planned_return_date obrigatorio.
- Politica de quilometragem: no checkout atualizar vehicles.mileage com odometro_return e auditar divergencias; validar odometro em cada transicao.
- Politica de combustivel: armazenar fuel_policy (full-to-full/same-to-same/prepaid) e aplicar calculo oficial (litros_faltantes = cap_tanque * (fuel_pickup - fuel_return); custo = litros * valor_litro).
- Cancelamento: so antes de check-in/vistoria/odometro; remover bloqueio; status volta a available; janela curta opcional (ex.: 5 min apos criacao).
- Manutencao automatica pos-dano: ao detectar dano grave, rental completed, bloqueio rental removido, vehicle status -> maintenance, cria maintenance_order + vehicle_schedule_block.
- Overdue: evento RentalOverdueDetected para atrasos (dias_atraso = ceil(diff/planned_return_date); multa = dias_atraso * late_fee_rate).
- Rotas extras: `POST /rentals/{id}/damage-report` para registrar danos durante locacao; `POST /rentals/from-reservation` com evento RentalConvertedFromReservation.
- Race conditions: prever lock/transacao no inicio de locacao/check-in para evitar duas locacoes no mesmo veiculo/periodo.
