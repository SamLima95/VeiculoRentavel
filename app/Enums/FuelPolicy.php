<?php

namespace App\Enums;

enum FuelPolicy: string
{
    case FULL_TO_FULL = 'full_to_full';
    case SAME_TO_SAME = 'same_to_same';
    case PREPAID = 'prepaid';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
