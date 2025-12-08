# Backend - Modulo de Veiculos (versao aprimorada)

Guia para deixar o backend do modulo de veiculos alinhado a um DDD lite, com regras de dominio claras, eventos e contratos consistentes.

## 1) Arquitetura (DDD lite)
- VehicleService: criar/atualizar/inativar, normalizar placa, validar se pode inativar, aplicar regras de status, gerar timeline resumida, emitir eventos de auditoria.
- VehicleRepository: concentrar consultas (findWithRelations($id), filterVehicles($filters), checkPlateAvailability($plate, $vehicleId?), latestActivities($vehicleId, $limit = 5), countersByStatus()) e evitar duplicacao em controllers.
- VehicleStatusManager: centraliza transicoes (available/rented/maintenance), bloqueios (ex.: rented -> deleted) e erros padronizados para consumo por outros modulos.
- VehicleResource / VehicleCollection: serializar respostas (ocultar internos, formatar labels PT, incluir stats/timeline) em vez de retornar modelos crus.

## 2) Modelo de dominio e invariantes
- Estados permitidos: available -> rented, available -> maintenance, maintenance -> available, rented -> available.
- Estados proibidos: rented -> deleted, maintenance -> rented, maintenance -> deleted (enquanto ativo).
- Invariantes:
  - Placa unica (normalizada) e regex Mercosul.
  - Nao excluir/inativar se houver reserva ativa (pending/confirmed) ou status rented.
  - Nao locar se em manutencao; nao reservar se rented.
  - Status sempre coerente com eventos externos (reserva, locacao, manutencao).
  - Datas de documentacao/seguro com alertas se vencidas (licensing_date, ipva_date, insurance_expiry).
- Campos core do veiculo: model, brand, year, color, plate, mileage, category, status, renavam, licensing_date, ipva_date, insurance_name, policy_number, insurance_expiry, claim_notes, daily_rate, notes, photo_path/url (opcional).

## 3) Eventos de dominio (recomendado)
- Eventos: ReservationCreated, ReservationConfirmed, ReservationCancelled, RentalStarted, RentalFinished, MaintenanceOpened, MaintenanceClosed (e opcionalmente MaintenanceCancelled).
- Listeners: UpdateVehicleStatusOnReservation, UpdateVehicleStatusOnRental, UpdateVehicleStatusOnMaintenance. Atualizam status via VehicleStatusManager e registram auditoria.
- Beneficios: desacopla modulos, evita controllers externos manipulando veiculo diretamente, reduz inconsistencias.

## 4) Validacoes e Form Requests
- Manter StoreVehicleRequest e UpdateVehicleRequest com:
  - Normalizacao da placa (maiucula, remove hifen/espaco) e regex Mercosul.
  - Unicidade considerando soft delete.
  - daily_rate obrigatorio; mileage inteiro >= 0; year entre 1900 e ano atual + 1.
  - category/status alinhados com enums.
  - Foto: max size/tipo (ex.: image, max 2MB) se upload for habilitado.
  - Conversoes numericas (mileage, daily_rate) e datas (licensing_date, ipva_date, insurance_expiry).
- Endpoint `GET /vehicles/check-plate?plate=...&vehicle_id?=...` reutiliza a mesma normalizacao/regra.

## 5) Enums e vocabulario
- Definir enums PHP:
  - VehicleStatus: available, rented, maintenance.
  - VehicleCategory: compact, sedan, suv, pickup, luxury (ou categorias dinamicas se usar tabela).
- Mapear para UI (labels PT) no Resource/Transformer para evitar divergencia front/back.

## 6) Dados e migracao
- Tabela vehicles (soft deletes) com campos do item 2; manter indices em status, category, plate + deleted_at, licensing_date, ipva_date, insurance_expiry.
- Indices adicionais uteis: status + category, brand + model + year.
- Opcional: tabela de categorias (para evitar valores magicos) e tabela vehicle_media (multi-fotos).

## 7) Coerencia entre modulos
- Reserva criada futura: status nao muda; confirmada -> status rented (ou reservado/bloqueado se usar estado intermediario).
- Locacao iniciada -> status rented; finalizada/cancelada -> status available.
- Manutencao aberta -> status maintenance; concluida/cancelada -> status available.
- Inativacao: apenas se nao houver reserva ativa nem status rented; usar VehicleService::inactivate.
- Timeline: agregar ultimas reservas/locacoes/manutencoes (limit 5) via repositorio.

## 8) Endpoints e contratos HTTP
- `GET /vehicles`: lista filtrada/paginada; usar VehicleCollection com labels e stats agregados (countersByStatus).
- `GET /vehicles/create|{id}/edit`: dados do form + enums/categorias validas.
- `POST /vehicles`: cria veiculo via service + auditoria.
- `GET /vehicles/{id}`: VehicleResource com relacoes resumidas (reservations, rentals, maintenances, fines?), stats e timeline.
- `PUT /vehicles/{id}`: atualiza com validacao condicional; logs de auditoria (diff).
- `DELETE /vehicles/{id}` ou `POST /vehicles/{id}/inactivate`: usa a mesma regra de inativacao.
- `GET /vehicles/check-plate`: validacao em tempo real.

## 9) Testes (cobertura de dominio)
- Invariantes: nao inativar rented ou com reserva ativa; placa unica normalizada.
- Transicoes de status: manutencao aberta -> maintenance; manutencao fechada -> available; locacao iniciada -> rented; locacao encerrada -> available.
- Eventos: listeners atualizam status; reserva futura nao altera status; reserva confirmada altera.
- Filtros/performance: search + category + status com paginacao (soft delete respeitado); ordenacao multi-campos.
- Requests: validacao de foto (quando habilitado), regex da placa, limites de year/mileage/daily_rate.
- Resources: garantir que campos internos nao vazem e labels estao corretos.

## 10) Performance e observabilidade
- Indices compostos (status+category, brand+model+year, datas de alerta) e eager loading controlado (paginate + with counts).
- Counters agregados (available/rented/maintenance) calculados via query unica.
- Logs/auditoria ja prontos; adicionar metricas de tempo de resposta nas consultas criticas se usar APM.

## 11) Documentacao e integracao
- Manter doc de contratos (VehicleResource/Collection) e eventos em linha com front.
- Atualizar pages-overview/Pages quando novos status ou campos forem expostos.
- Descrever politicas (VehiclePolicy) se perfis diferentes precisarem de permissoes no modulo.
