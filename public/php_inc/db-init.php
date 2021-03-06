<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $DB = new mysqli($config['db']['host'], $config['db']['user'], $config['db']['pass'], $config['db']['name']);
    $DB->set_charset('utf8mb4');
} catch (Exception $e) {
    error_log($e->getMessage());
    exit(
        json_encode(
            [
                'code' => 2,
                'msg' => 'Ошибка подключения к базе данных',
            ],
            JSON_UNESCAPED_UNICODE
        )
    );
}

$createTableQuery = "CREATE TABLE IF NOT EXISTS games(
        id INT NOT NULL AUTO_INCREMENT,
        contest INT NOT NULL,
        stage TINYTEXT NOT NULL,
        title TINYTEXT NOT NULL,
        email TINYTEXT NOT NULL,
        genre TINYTEXT,
        description TEXT,
        tools TINYTEXT,
        archive TINYTEXT NOT NULL,
        screenshot TINYTEXT NOT NULL,
        date DATETIME NOT NULL,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4";

$DB->query($createTableQuery);
