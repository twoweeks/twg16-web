<?php

class DB_EDITOR
{
    public function __construct($DB)
    {
        $this->DB = $DB;
    }

    private function prepareString($string)
    {
        return addslashes(trim(preg_replace('/\s+/', ' ', $string)));
    }

    private function result($code, $msg, $data = null)
    {
        if (array_key_exists('result', $GLOBALS)) {
            $GLOBALS['result'] = [
                'code' => $code,
                'msg' => $msg,
            ];

            if ($data) {
                $GLOBALS['result']['data'] = $data;
            }
        }
    }

    public function getGames()
    {
        $query = $this->DB->prepare('SELECT id, title, email, genre, description, tools, archive, screenshot, ip, date FROM games');

        $query->execute();

        $queryResult = $query->get_result();

        if ($queryResult->num_rows > 0) {
            $data = [];

            while ($row = $queryResult->fetch_assoc()) {
                array_push($data, $row);
            }

            $this->result(1, 'Список игр получен', $data);
        } else {
            $this->result(0, 'Список игр пуст');
        }

        $query->close();
    }

    public function add($contest, $title, $email, $genre, $description, $tools, $archive, $screenshot, $ip, $date)
    {
        $contest = intval($contest);
        $title = $this->prepareString($title);
        $email = $this->prepareString($email);
        $genre = $this->prepareString($genre);
        $description = $this->prepareString($description);
        $tools = $this->prepareString($tools);
        $archive = $this->prepareString($archive);
        $screenshot = $this->prepareString($screenshot);

        if ($title === '' || $email === '' || $archive === '' || $screenshot === '') {
            $this->result(2, 'Ошибка добавления игры: отправлены пустые данные');
            return;
        }

        $game = [
            'contest' => $contest,
            'title' => $title,
            'email' => $email,
            'genre' => $genre,
            'description' => $description,
            'tools' => $tools,
            'archive' => $archive,
            'screenshot' => $screenshot,
            'ip' => $ip,
            'date' => $date,
        ];

        $query = $this->DB->prepare("INSERT INTO games (
				contest,
				title,
				email,
				genre,
				description,
				tools,
				archive,
				screenshot,
				ip,
				date
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $query->bind_param(
            'isssssssss',
            $game['contest'],
            $game['title'],
            $game['email'],
            $game['genre'],
            $game['description'],
            $game['tools'],
            $game['archive'],
            $game['screenshot'],
            $game['ip'],
            $game['date']
        );

        $queryState = $query->execute()
            ? $this->result(1, 'Игра "' . $game['title'] . '" добавлена', ['id' => $this->DB->insert_id])
            : $this->result(2, 'Ошибка добавления игры: ' . $this->DB->error);

        $query->close();
    }

    public function rm($id)
    {
        $id = intval($id);

        $query = $this->DB->prepare('DELETE FROM games WHERE id = ?');

        $query->bind_param('i', $bill_number);

        $queryState = $query->execute()
            ? $this->result(1, 'Игра с id "' . $bill_number . '" удалена')
            : $this->result(2, 'Ошибка удаления игры: ' . $this->DB->error);

        $query->close();
    }
}
