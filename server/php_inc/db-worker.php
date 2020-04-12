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
        $query = $this->DB->prepare('SELECT id, title, email, genre, description, tools, archive, screenshot, date FROM games');

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

    public function add($contest, $stage, $title, $email, $genre, $description, $tools, $archive, $screenshot, $date)
    {
        $contest = intval($contest);
        $stage = $this->prepareString($stage);
        $title = substr($this->prepareString($title), 0, 100);
        $email = substr($this->prepareString($email), 0, 50);
        $genre = substr($this->prepareString($genre), 0, 50);
        $description = substr($this->prepareString($description), 0, 200);
        $tools = substr($this->prepareString($tools), 0, 100);
        $archive = substr($this->prepareString($archive), 0, 100);
        $screenshot = substr($this->prepareString($screenshot), 0, 100);
        $date = $this->prepareString($date);

        if ($title === '' || $email === '' || $archive === '' || $screenshot === '') {
            $this->result(2, 'Ошибка добавления игры: отправлены пустые данные');
            return;
        }

        $query = $this->DB->prepare("INSERT INTO games (
                contest,
                stage,
                title,
                email,
                genre,
                description,
                tools,
                archive,
                screenshot,
                date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $query->bind_param('isssssssss', $contest, $stage, $title, $email, $genre, $description, $tools, $archive, $screenshot, $date);

        $queryState = $query->execute()
            ? $this->result(1, 'Игра "' . $title . '" успешно отправлена', ['id' => $this->DB->insert_id])
            : $this->result(2, 'Ошибка отправления игры: ' . $this->DB->error);

        $query->close();
    }

    public function rm($id)
    {
        $id = intval($id);

        $query = $this->DB->prepare('DELETE FROM games WHERE id = ?');

        $query->bind_param('i', $id);

        $queryState = $query->execute()
            ? $this->result(1, 'Игра с id "' . $id . '" удалена')
            : $this->result(2, 'Ошибка удаления игры: ' . $this->DB->error);

        $query->close();
    }
}
