<?php

include_once 'php_inc/config.php';
include_once 'php_inc/db-editor.php';

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
    $stage = $config['stages']['demo'];

    $time_demo_start = $config['time']['demo'] - $config['time']['open'];
    $time_demo_end = $config['time']['demo'] + $config['time']['extra'];

    $time_final_start = $config['time']['final'] - $config['time']['open'];
    $time_final_end = $config['time']['final'] + $config['time']['extra'];

    if ($time_demo_start <= time() && time() <= $time_demo_end) {
        $status = $config['statuses']['open'];
        $stage = $config['stages']['demo'];
    }

    if ($time_final_start <= time() && time() <= $time_final_end) {
        $status = $config['statuses']['open'];
        $stage = $config['stages']['final'];
    }

    return [
        'status' => $status,
        'stage' => $stage,
    ];
}

$captchaCondition = false;

if (isset($_POST['captcha'])) {
    $recaptchaResponse = file_get_contents(
        'https://www.google.com/recaptcha/api/siteverify?secret=' . $config['keys']['recaptcha'] . '&response=' . $_POST['captcha']
    );

    $recaptchaResponseData = json_decode($recaptchaResponse);

    if ($recaptchaResponseData->success == true && $recaptchaResponseData->hostname == $_SERVER['SERVER_NAME']) {
        $captchaCondition = true;
    }
}

switch ($_GET['get']) {
    case 'status':
        $result = [
            'code' => 1,
            'data' => getStatus(),
        ];
        break;

    case 'games':
        if ($_GET['key'] === $config['keys']['auth']) {
            $db->getGames();
        } else {
            $result = [
                'code' => 4,
                'msg' => 'Авторизация не пройдена.',
            ];
        }
        break;
}

switch ($_POST['action']) {
    case 'add':
        if ($captchaCondition) {
            if (getStatus()['status'] === $config['statuses']['open']) {
                $db->add(
                    $config['contest']['num'],
                    getStatus()['stage'],
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
                    'msg' => 'Игра отправлена не в срок',
                ];
            }
        } else {
            $result = [
                'code' => 4,
                'msg' => 'Капча не пройдена',
            ];
        }
        break;

    case 'rm':
        if ($_POST['key'] === $config['keys']['auth']) {
            $db->rm($_POST['targets']);
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
