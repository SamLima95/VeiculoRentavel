<?php

namespace App\Enums;

enum VehicleCategory: string
{
    case COMPACT = 'compact';
    case SEDAN = 'sedan';
    case SUV = 'suv';
    case PICKUP = 'pickup';
    case LUXURY = 'luxury';
    case HATCH = 'hatch';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
