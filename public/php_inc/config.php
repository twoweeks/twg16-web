<?php

date_default_timezone_set('Europe/Moscow');

$config = [
    'contest' => [
        'num' => 16,
    ],

    'twitch-channels' => [],

    'time' => [
        'demo' => strtotime('04/16/20 00:00'),
        'final' => strtotime('04/20/20 00:00'),
        'open' => 2 * 24 * 60 * 60,
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

    'db' => [
        'name' => '',
        'user' => '',
        'pass' => '',
    ],

    'keys' => [
        'auth' => '',
        'recaptcha' => '',
        'twitch' => '',
    ],
];
