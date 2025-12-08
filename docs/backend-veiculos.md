# Backend - Modulo de Veiculos

Guia de referencia do backend para o modulo de veiculos: como deve funcionar, regras de negocio e itens faltantes para ficar 100% funcional.

## Objetivo e escopo
- CRUD completo de veiculos com validacao (placa unica, dados obrigatorios) e soft delete/inativacao.
- Exposicao de listagem filtrada/paginada, detalhe com timeline (reservas, locacoes, manutencoes) e checagem de disponibilidade por placa.
- Integra de forma consistente com reservas, locacoes, manutencoes e auditoria de acoes.

## Modelo de dados proposto
- Tabela `vehicles` (soft delete):
  - `model`, `brand`, `year`, `color`, `plate` (unique, normalizada), `mileage`.
  - `category` (ex: compacto, sedan, suv, pickup, luxo) e `status` (`available`, `rented`, `maintenance`).
  - `renavam`, `licensing_date`, `ipva_date` para documentacao.
  - Seguro: `insurance_name`, `policy_number`, `insurance_expiry` (ou `insurance_data` json), `claim_notes`.
  - Financeiro: `daily_rate` decimal(10,2), `notes` livres.
  - Midia: `photo_path` ou `photo_url` opcional.
  - Indices: `status`, `category`, `plate`, `plate + deleted_at` para RN001, e campos de data usados em alertas (licensing/ipva/insurance).
- Relacoes:
  - `hasMany reservations`, `hasMany rentals`, `hasMany maintenances`, `hasMany fines` (se aplicavel).
  - Auditoria via `audit_logs` (modelo já existente).

## Regras de negocio e validacao
- Placa unica (RN001), normalizada para maiusculas sem hifen/espaco; regex Mercosul (ABC1D23) ou ABC-1234.
- Ano: inteiro entre 1900 e (ano corrente + 1); quilometragem >= 0.
- Categorias e status devem usar o mesmo vocabulário no front e no backend (hoje o front envia textos em PT; é preciso mapear para `available/rented/maintenance`).
- Inativacao/soft delete bloqueada se:
  - Status `rented` (veiculo locado) ou se existir reserva ativa (`pending`, `confirmed`).
  - Manutencao ativa deve trocar status para `maintenance` e bloquear novas reservas/locacoes no periodo.
- Timeline: reservas/locacoes/manutencoes ordenadas por data mais recente; limitar n itens ou paginar.
- Documentacao e seguro: alertas para datas vencidas a partir de `licensing_date`, `ipva_date`, `insurance_expiry`.
- Preco: `daily_rate` obrigatorio; calcular estimativas em reservas/locacoes com base em tarifas/categoria.

## Rotas e contratos HTTP (Inertia)
- `GET /vehicles`: lista com filtros `search`, `status`, `category`, `sort_by`, `sort_order`; retorna paginacao e filtros aplicados.
- `GET /vehicles/create` e `GET /vehicles/{id}/edit`: retornam dados do formulario (opcionalmente listas de categorias/status validos).
- `POST /vehicles`: cria veiculo com os campos descritos em Modelo de dados; valida e normaliza placa, converte numeros.
- `GET /vehicles/{id}`: retorna veiculo + relacoes resumidas (`reservations`, `rentals`, `maintenances`, `fines?`) e `stats` (totais).
- `PUT /vehicles/{id}`: atualiza com validacao condicional; mantem unicidade da placa considerando soft delete.
- `DELETE /vehicles/{id}`: inativa (soft delete) apos checar regras de bloqueio.
- `POST /vehicles/{id}/inactivate`: rota faltante usada no front (show.tsx); deve reutilizar a mesma logica do destroy e responder com flash/message.
- `GET /vehicles/check-plate?plate=ABC1234&vehicle_id?=`: retorna `{ available: bool, message }` para validacao em tempo real.

## Fluxos chave
- **Cadastro**: validar campos, normalizar placa, criar registro, salvar diario/foto opcional, registrar auditoria, redirecionar com flash de sucesso.
- **Edicao**: carregar dados + relacoes basicas, aplicar PUT, logar diffs na auditoria.
- **Listagem**: aplicar filtros, paginar, calcular contadores por status para cards do front; respeitar soft deletes.
- **Detalhe**: carregar veiculo + ultimas reservas/locacoes/manutencoes (limit 5) e estatisticas agregadas; expor status legivel para UI.
- **Inativacao**: checar se nao ha locacao/reserva ativa; se ok, soft delete e log de auditoria; se nao, retornar erro amigavel.
- **Checagem de disponibilidade de placa**: endpoint ja criado (`checkPlateAvailability`), mas precisa ser conectado no front ou reusado na validacao ajax.

## Itens pendentes para 100% funcional
- Ajustar divergencias de campos entre front (renavam, licensing_date, ipva_date, seguro, claim_notes, photo) e `vehicles` no backend (fillable, migration e requests).
- Harmonizar enums de `status` e `category` entre front e backend (hoje o request usa termos em PT enquanto o modelo usa ingles).
- Adicionar rota/acao `vehicles/{vehicle}/inactivate` ou alinhar o front para usar `DELETE /vehicles/{id}`.
- Implementar atualizacao de status automatica quando criar/alterar reservas, locacoes e manutencoes (ex: reserva confirmada bloqueia veiculo, manutencao agenda vira status `maintenance`, locacao ativa vira `rented`).
- Incluir carregamento de `stats` e `fines` no `VehicleController@show` se o front for consumir.
- Opcional: upload/armazenamento de foto do veiculo (disk `public`), com validacao de tamanho/tipo.
- Cobrir com testes: regras de placa unica/normalizacao, bloqueios de inativacao, filtros de listagem, mapeamento de status/categorias, endpoint de checagem de placa.

## Dependencias e seguranca
- Rotas protegidas por `auth` e `verified` (ja aplicado).
- Auditoria via `AuditLogService` em create/update/delete; garantir que a tabela `audit_logs` esta migrada.
- Politicas de autorizacao podem ser adicionadas em `VehiclePolicy` para perfis (admin x operador) caso necessario.
