<?php
class UserModel {
    public $id;
    public $fullName;
    public $email;
    public $phone;
    public $password;
    public $address;
    public $gender;
    public $date_of_birth;
    public $role;
    public $avatar;
    public $created_at;
    public $updated_at;
    public $last_login;
    public $location;

    public function __construct($data = []) {
        foreach ($data as $key => $value) {
            if(property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }

    public function setPassword($plainPassword) {
        $this->password = password_hash($plainPassword, PASSWORD_DEFAULT);
    }

    public function verifyPassword($plainPassword) {
        return password_verify($plainPassword, $this->password);
    }
}
?>
