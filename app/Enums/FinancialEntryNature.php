<?php

namespace App\Enums;

enum FinancialEntryNature: string
{
    case CREDIT = 'credit';
    case DEBIT = 'debit';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
