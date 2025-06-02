<?php
class UserFitnessTrack {
    public $id;
    public $user_id;
    public $date;
    public $weight;
    public $height;
    public $bmi;
    public $body_fat_percentage;
    public $muscle_mass;
    public $steps_count;
    public $calories_burned;
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
