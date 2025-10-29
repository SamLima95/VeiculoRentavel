<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AuditLogService
{
    /**
     * Registra uma ação de auditoria.
     *
     * @param string $action Ação realizada (created, updated, deleted, cancelled)
     * @param Model $model Modelo afetado
     * @param array|null $oldValues Valores antigos (para updates)
     * @param array|null $newValues Valores novos
     * @param string|null $description Descrição adicional
     * @return AuditLog
     */
    public static function log(
        string $action,
        Model $model,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $description = null
    ): AuditLog {
        $user = Auth::user();
        
        return AuditLog::create([
            'user_id' => $user?->id,
            'action' => $action,
            'model_type' => class_basename($model),
            'model_id' => $model->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'description' => $description ?? self::generateDescription($action, $model),
        ]);
    }

    /**
     * Gera uma descrição padrão baseada na ação.
     */
    private static function generateDescription(string $action, Model $model): string
    {
        $modelName = class_basename($model);
        
        return match($action) {
            'created' => "{$modelName} criado",
            'updated' => "{$modelName} atualizado",
            'deleted' => "{$modelName} deletado",
            'cancelled' => "{$modelName} cancelado",
            default => "Ação '{$action}' realizada em {$modelName}",
        };
    }

    /**
     * Registra a criação de um modelo.
     */
    public static function logCreated(Model $model, ?string $description = null): AuditLog
    {
        return self::log(
            'created',
            $model,
            null,
            $model->getAttributes(),
            $description
        );
    }

    /**
     * Registra a atualização de um modelo.
     */
    public static function logUpdated(Model $model, array $oldValues, ?string $description = null): AuditLog
    {
        return self::log(
            'updated',
            $model,
            $oldValues,
            $model->getAttributes(),
            $description
        );
    }

    /**
     * Registra a exclusão de um modelo.
     */
    public static function logDeleted(Model $model, ?string $description = null): AuditLog
    {
        return self::log(
            'deleted',
            $model,
            $model->getAttributes(),
            null,
            $description
        );
    }

    /**
     * Registra o cancelamento de uma operação.
     */
    public static function logCancelled(Model $model, ?string $description = null): AuditLog
    {
        return self::log(
            'cancelled',
            $model,
            null,
            null,
            $description
        );
    }
}


