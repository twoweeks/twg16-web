<?php

include_once 'php_inc/config.php';

$twitchURL = 'https://api.twitch.tv/helix';
$twitchContext = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => 'Client-ID: ' . $config['keys']['twitch'],
    ],
]);

$liveFile = getcwd() . '/live.json';

function getUserID($userLogin)
{
    $url = $GLOBALS['twitchURL'] . '/users?login=' . $userLogin;
    $twitchContext = $GLOBALS['twitchContext'];

    $json_result = json_decode(file_get_contents($url, false, $twitchContext));

    return $json_result;
}

function getLiveStreams($channelIDs)
{
    $url = $GLOBALS['twitchURL'] . '/streams';
    $twitchContext = $GLOBALS['twitchContext'];

    $i = 1;

    foreach ($channelIDs as $channelID) {
        if ($i === 1) {
            $url .= '?user_id=' . $channelID;
            $i++;
        } else {
            $url .= '&user_id=' . $channelID;
        }
    }

    $json_result = json_decode(file_get_contents($url, false, $twitchContext));

    $result = [];

    foreach ($json_result->data as $channel) {
        if ($channel->type === 'live') {
            array_push($result, [
                'login' => $channel->user_name,
                'title' => $channel->title,
                'viewers' => $channel->viewer_count,
                'image' => str_replace('{width}', '640', str_replace('{height}', '360', $channel->thumbnail_url)),
            ]);
        }
    }

    return $result;
}

if ($_GET['login'] && $_GET['key'] === $config['keys']['auth']) {
    print json_encode(getUserID($_GET['login']), JSON_UNESCAPED_UNICODE);
}

// файла может не быть +  защита от дудоса по скрипту
if (!file_exists($liveFile) || abs(filemtime($liveFile) - time()) > 5) {
    file_put_contents($liveFile, json_encode(getLiveStreams($config['twitch-channels']), JSON_UNESCAPED_UNICODE));
}
