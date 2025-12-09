<?php

namespace App\Enums;

enum ReservationSource: string
{
    case INTERNAL = 'internal';
    case API = 'api';
    case PARTNER = 'partner';
    case WALKIN = 'walkin';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
