<?php

namespace App\Enums;

enum FinancialEntryType: string
{
    case RENTAL_DAILY = 'rental_daily';
    case RENTAL_EXTRA_KM = 'rental_extra_km';
    case RENTAL_LATE_FEE = 'rental_late_fee';
    case RENTAL_FUEL = 'rental_fuel';
    case RENTAL_CLEANING = 'rental_cleaning';
    case RENTAL_DAMAGE = 'rental_damage';
    case RENTAL_DISCOUNT = 'rental_discount';
    case RENTAL_EXTRA_CHARGES = 'rental_extra_charges';
    case MAINTENANCE_COST = 'maintenance_cost';
    case FINE = 'fine';
    case MANUAL_ADJUSTMENT = 'manual_adjustment';
    case RESERVATION_DEPOSIT = 'reservation_deposit';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
