<?php
class UserFitnessTrack {
    public $id;
    public $user_id;
    public $date;
    public $bmi;
    public $body_fat_percentage;
    public $muscle_mass;
    public $workout_duration;
    public $water_intake;
    public $sleep_hours;
    public $heart_rate;
    public $notes;
    public $created_at;
    public $updated_at;

    public function __construct($data = []) {
        foreach ($data as $key => $value) {
            $this->$key = $value;
        }
    }
}
