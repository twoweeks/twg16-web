<?php

date_default_timezone_set('Europe/Moscow');

$config = [
    'contest' => [
        'num' => 16,
    ],

    'time' => [
        'demo' => strtotime('04/16/20 00:00'),
        'final' => strtotime('04/20/20 00:00'),
        'extra' => 2 * 60 * 60,
    ],

    'db' => [
        'name' => '',
        'user' => '',
        'pass' => '',
    ],

    'keys' => [
        'auth' => '',
        'recaptcha' => '',
    ],
];
