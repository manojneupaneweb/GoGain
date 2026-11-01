<?php

function membershipPlans()
{
    return [
        'basic' => ['name' => 'Basic', 'price' => 2000, 'days' => 30],
        'standard' => ['name' => 'Standard', 'price' => 9000, 'days' => 90],
        'premium' => ['name' => 'Premium', 'price' => 16000, 'days' => 180],
        'elite' => ['name' => 'Elite Yearly', 'price' => 30000, 'days' => 365],
    ];
}

function findPlan($key)
{
    $plans = membershipPlans();
    return $plans[$key] ?? null;
}
