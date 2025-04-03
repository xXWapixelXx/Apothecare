<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

class Database {
    private $host = "localhost";
    private $database_name = "apothecare";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->database_name;
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
            
            // Test the connection
            $this->conn->query("SELECT 1");
            
            return $this->conn;
        } catch(PDOException $e) {
            throw new Exception("Connection error: " . $e->getMessage());
        }
    }
} 