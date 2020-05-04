<?php

date_default_timezone_set('Europe/Moscow');

$config = [
    'contest' => [
        'num' => 16,
    ],

    // массив с ID каналов (для live.php)
    'twitch-channels' => [],

    'time' => [
        // время окончания приёма демок
        'demo' => strtotime('04/16/20 00:00'),

        // время окончания приёма финалок
        'final' => strtotime('04/24/20 00:00'),

        // период (в секундах), в который будет открыта форма отправки игр, до времени окончания приёма
        'open' => 2 * 24 * 60 * 60,

        // период (в секундах), в который форма будет работать после окончания времени приёма
        'extra' => 2 * 60 * 60,
    ],

    'statuses' => [
        'open' => 'open',
        'closed' => 'closed',
    ],
    'stages' => [
        'demo' => 'demo',
        'final' => 'final',
    ],

    // данные от базы данных
    'db' => [
        'host' => '127.0.0.1',
        'name' => '',
        'user' => '',
        'pass' => '',
    ],

    'keys' => [
        'auth' => '', // ключ авторизации
        'recaptcha' => '',
        'twitch' => '',
    ],
];
