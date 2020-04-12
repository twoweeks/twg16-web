<?php

include_once 'php_inc/config.php';
include_once 'php_inc/db-worker.php';

$result = [
    // 0 - пустые запросы, 1 - успех, 2 - ошибка в скриптах, 3 - ошибка сервера, 4 - ошибка клиента
    'code' => 0,
    'msg' => 'Пустой запрос',
];

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once 'php_inc/db-init.php';

$db = new DB_EDITOR($DB);

function getStatus()
{
    $config = $GLOBALS['config'];
    $status = $config['statuses']['closed'];

    $time_demo_start = $config['time']['demo'] - $config['time']['open'];
    $time_demo_end = $config['time']['demo'] + $config['time']['extra'];

    $time_final_start = $config['time']['final'] - $config['time']['open'];
    $time_final_end = $config['time']['final'] + $config['time']['extra'];

    if (($time_demo_start <= time() && time() <= $time_demo_end) || ($time_final_start <= time() && time() <= $time_final_end)) {
        $status = $config['statuses']['open'];
    }

    return $status;
}

if (array_key_exists('get-status', $_GET)) {
    $result = [
        'code' => 1,
        'status' => getStatus(),
    ];
}

switch ($_POST['action']) {
    case 'get-status':
        $result = [
            'code' => 1,
            'status' => getStatus(),
        ];
        break;

    case 'get-games':
        if ($_GET['key'] === $config['keys']['auth']) {
            $db->getGames();
        } else {
            $result = [
                'code' => 4,
                'msg' => 'Авторизация не пройдена.',
            ];
        }
        break;

    case 'add':
        if (getStatus() === $config['statuses']['open']) {
            $db->add(
                $config['contest']['num'],
                $_POST['title'],
                $_POST['email'],
                $_POST['genre'],
                $_POST['description'],
                $_POST['tools'],
                $_POST['archive'],
                $_POST['screenshot'],
                date('Y-m-d H:i:s')
            );
        } else {
            $result = [
                'code' => 4,
                'msg' => 'Игра отправлена не в срок. Напишите на почту организатору',
            ];
        }
        break;

    case 'rm':
        if ($_GET['key'] === $config['keys']['auth']) {
            $db->rm($_POST['id']);
        } else {
            $result = [
                'code' => 4,
                'msg' => 'Авторизация не пройдена',
            ];
        }
        break;
}

$DB->close();

echo json_encode($result, JSON_UNESCAPED_UNICODE);
