<?php

include_once 'php_inc/config.php';
include_once 'php_inc/db-worker.php';

$result = [
    // 0 - пустые запросы, 1 - успех, 2 - ошибка в скриптах, 3 - ошибка сервера
    'code' => 0,
    'msg' => 'Пустой запрос',
];

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once 'php_inc/db-init.php';

$db = new DB_EDITOR($DB);

switch ($_POST['action']) {
    case 'get-status':
        $db->getStatus();
        break;

    case 'get-games':
        $db->getGames();
        break;

    case 'add':
        $db->add($_POST['title'], $_POST['email'], $_POST['genre'], $_POST['description'], $_POST['tools'], $_POST['archive'], $_POST['screenshot']);
        break;

    case 'rm':
        $db->rm($_POST['id']);
        break;
}

$DB->close();

echo json_encode($result, JSON_UNESCAPED_UNICODE);
