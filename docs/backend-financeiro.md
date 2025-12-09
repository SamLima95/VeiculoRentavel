# Backend - Modulo Financeiro (proposta revisada)

Visao de como o modulo financeiro deve funcionar e integrar com locacoes, reservas e manutencoes, com controles de provisao/realizado, idempotencia e consistencia de receitas/custos.

## 1) Objetivo e escopo
- Consolidar receitas e custos (locacoes, multas, combustivel, manutencoes, taxas) e expor KPIs.
- Diferenciar estimado (provisioned) de apurado/realizado (open/paid).
- Automatizar lancamentos a partir de eventos de dominio e permitir ajustes manuais auditados.
- Suportar aging/inadimplencia e relatorios por competencia x caixa.

## 2) Dominio e entidades
- `financial_entries` (livro razao simplificado):
  - chave: id, source_type (rental|reservation|maintenance|manual), source_id
  - natureza: credit|debit (amount sempre positivo; credit = entrada, debit = saida)
  - tipo (Enum backend, string no BD): rental_daily, rental_extra_km, rental_late_fee, rental_fuel, rental_cleaning, rental_damage, rental_discount, maintenance_cost, fine, manual_adjustment
  - valores: amount, currency (default BRL), exchange_rate (obrigatorio se currency != BRL), amount_converted (amount * exchange_rate), description
  - datas: entry_date (competencia), due_date (cobranca), paid_at (baixa)
  - status: provisioned (estimado) | open (apurado) | paid | cancelled; flags opcionais is_estimated (redundancia) e is_overdue (para aging)
  - auditoria: created_by, updated_by
- `payments` (opcional/expansao): vincula 1..n entries, metodo (cash, credit_card, pix, boleto), transaction_ref, fees, status.
- `invoices` (opcional/expansao): emissao de comprovantes/notas.

## 3) Fluxos automatizados (eventos)
- Check-in (locacao criada): gerar entries `provisioned` (diarias, franquia km se pre-pago, limpeza).
- Check-out: cancelar provisionados e criar entries `open` com valores reais (extra_km, late_fee, fuel_charge, cleaning_fee, damage_cost, extra_charges, descontos como debit). Marcar `paid` se quitado no ato.
- Conversao reserva -> locacao: reclassificar sinal (reservation_deposit) para a locacao, cancelando o entry da reserva e criando na locacao.
- Manutencao: criar debit `maintenance_cost` (status open/paid conforme input).
- Multa externa: criar debit `fine` associado ao veiculo/locacao (status open).

## 4) Regras e invariantes
- amount sempre positivo; credit = entrada, debit = saida.
- Estorno: nao usar valor negativo. Marcar original como `cancelled` e criar novo lancamento (mesma natureza) para manter receita_liquida = soma(credits) - soma(debits).
- Descontos sempre como debit `rental_discount`.
- Invariante por locacao: soma dos entries (source_type=rental, source_id=locacao) bate com o total exibido da locacao.
- Campos imutaveis para lancamentos automaticos: source_type, source_id, nature, type, amount. Correcoes via estorno + novo entry.
- currency != BRL exige exchange_rate; amount_converted = amount * exchange_rate.
- Idempotencia: chave logica (source_type, source_id, type) evita duplicacao em listeners; segunda execucao atualiza/cancela em vez de duplicar.
- Aging: entries `open` com due_date < hoje podem ser marcados is_overdue=true por job.
- Competencia x caixa: entry_date = competencia; paid_at = caixa. Relatorios devem declarar a base.

## 5) Consultas e relatorios
- Dashboards: receita estimada vs realizada, margem por veiculo/categoria (receita - manutencao - multas), atrasos/multas, aging de recebiveis (faixas 0-7, 8-15, 16-30, >30).
- Listagens: `GET /finance/entries` (filtros periodo, source_type, status, tipo, veiculo, cliente), `GET /finance/entries/{id}` (timeline de criacao/ajustes/pagamentos).
- Exportacao: CSV/PDF (posterior).
- Opcional: snapshots diarios (financial_daily_summary) para dashboards rapidos.

## 6) Endpoints (proposta)
- `GET /finance`: cards + graficos (usa repositorio/aggregates ou snapshots).
- `GET /finance/entries`: listagem paginada com filtros.
- `POST /finance/entries`: ajuste manual (source_type=manual).
- `PUT /finance/entries/{id}`: automatizados -> apenas descricao/status via fluxo de pagamento; manuais -> edicao controlada com auditoria.
- `POST /finance/entries/{id}/pay`: registrar pagamento (paid_at, metodo, transaction_ref).
- `POST /finance/entries/{id}/cancel`: estornar (marca cancelled e cria inverso se ja pago).
- Eventos/listeners cuidam dos lancamentos automaticos (rental/maintenance/reservation).

## 7) Integracao com outros modulos
- Locacoes: `RentalService` aciona `FinancialService` no check-in (provisioned) e check-out (open/paid) de forma idempotente.
- Reservas: sinal opcional (reservation_deposit) reclassificado na conversao para locacao.
- Manutencao: custo gera debit `maintenance_cost`.
- Veiculos: relatorios por veiculo usam vehicle_id vindo do source (rental->vehicle_id ou maintenance->vehicle_id).
- Inadimplencia: job marca overdue; opcional write-off futuro (ajuste manual).

## 8) Arquitetura sugerida
- `FinancialEntry` model + migration.
- `FinancialService`: unico ponto de mutacao (criar/estornar/pagar/atualizar status), aplica invariantes e idempotencia.
- `FinancialRepository`: filtros, agregacoes (sum por tipo/status), aging de open entries, opcional snapshots diarios.
- `FinancialStatusManager` (opcional): provisioned -> open -> paid -> cancelled.
- `FinancialResource`/Collection: labels PT, status_label, valores convertidos.
- Listeners (RentalFinished, MaintenanceCreated, ReservationConverted) chamam o service; controllers so para ajustes manuais/pagamentos.

## 9) Dados e migracao (proposta)
- Tabela `financial_entries`:
  - id
  - source_type (string) + source_id (bigint, nullable para manual)
  - vehicle_id (nullable), client_id (nullable)
  - nature (enum credit|debit)
  - type (string curta, index; backend reforca enum)
  - amount decimal(12,2), currency char(3) default BRL, exchange_rate decimal(12,6) nullable, amount_converted decimal(12,2) nullable
  - description text nullable
  - entry_date date, due_date date nullable, paid_at datetime nullable
  - status enum(provisioned, open, paid, cancelled) default provisioned
  - is_estimated boolean default true (opcional), is_overdue boolean default false
  - created_by, updated_by (nullable FKs users)
  - timestamps + indices: (source_type, source_id, type), status, type, entry_date, due_date, vehicle_id, client_id, is_overdue
- Tabela `payments` (futura): payment_method, transaction_ref, fees, status, timestamps; FK para entry.
- Opcional: tabela de tipos (`financial_entry_types`) com descricao PT, natureza (receita/custo), flags de inclusao em KPIs.
- Opcional: `financial_daily_summary` para dashboards.

## 10) Validacoes e testes
- Validar nature (credit/debit) e type (enum); currency != BRL exige exchange_rate.
- Check-out de locacao: provisioned -> cancelled e novos open/paid; soma bate com total da locacao.
- Estorno: marca cancelled e cria inverso (sem amount negativo).
- Aging: job marca overdue e repositorio agrupa por faixas.
- Integracao manutencao: custo gera debit e aparece na margem por veiculo.
- Idempotencia: source_type+source_id+type unico; listener rodando duas vezes nao duplica.
- Imutabilidade: automatizados nao permitem mudar amount/type/source; correcoes via estorno + novo entry.

## 11) Roadmap incremental
- Fase 1: modelo/migracao `financial_entries` com status provisioned/open/paid/cancelled e chave de idempotencia; service/repository; endpoints de listagem/pagamento/estorno; integracao com checkout de locacao; base de competencia/caixa documentada.
- Fase 2: sinal de reserva, integracao com manutencao, relatorios/KPIs e exportacao; job de aging/overdue.
- Fase 3: pagamentos detalhados (fees, conciliacao), faturamento/notas e snapshots diarios para dashboards.
