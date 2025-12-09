<?php

namespace App\Enums;

enum FinancialEntryStatus: string
{
    case PROVISIONED = 'provisioned';
    case OPEN = 'open';
    case PAID = 'paid';
    case CANCELLED = 'cancelled';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
