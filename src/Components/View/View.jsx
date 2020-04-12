import React from 'react';
import { Table, Form, Radio, Button } from 'antd';

import Link from '../Common/Link';

import './View.scss';

const ViewComponent = props => {
    const { isAuth, gamesList } = props;
    const { gamesFilter, handleFilterChange } = props;
    const { gamesSort, handleSortChange } = props;
    const { handleRemoveGame, handleGenerateCode } = props;
    const { gamesToRemove, setGamesToRemove } = props;

    const columns = [
        {
            title: 'Конкурс',
            dataIndex: 'contest',
        },
        {
            title: 'Стадия',
            dataIndex: 'stage',
            render: stage => (stage === 'demo' ? 'Демоверсия' : 'Финальная версия'),
        },
        {
            title: 'Дата',
            dataIndex: 'date',
        },
        {
            title: 'Название',
            dataIndex: 'title',
        },
        {
            title: 'Почта',
            dataIndex: 'email',
            render: email => <a href={`mailto:${email}`}>{email}</a>,
        },
        {
            title: 'Жанр',
            dataIndex: 'genre',
        },
        {
            title: 'Описание',
            dataIndex: 'description',
        },
        {
            title: 'Инструменты',
            dataIndex: 'tools',
        },
        {
            title: 'Архив',
            dataIndex: 'archive',
            render: link => <Link href={link} text="Ссылка" />,
        },
        {
            title: 'Скриншот',
            dataIndex: 'screenshot',
            render: link => <Link href={link} text="Ссылка" />,
        },
    ];

    return isAuth ? (
        <div className="view">
            <div className="view__controls">
                <Form>
                    <Form.Item label="Фильтр по стадии">
                        <Radio.Group style={{ display: 'flex' }} onChange={handleFilterChange}>
                            {[
                                {
                                    value: 'all',
                                    label: 'Все игры',
                                },
                                {
                                    value: 'demo-stage',
                                    label: 'Только демки',
                                },
                                {
                                    value: 'final-stage',
                                    label: 'Только финалки',
                                },
                            ].map((item, i) => (
                                <Radio.Button style={{ width: '100%' }} key={i} value={item.value} checked={item.value === gamesFilter}>
                                    {item.label}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Сортировка">
                        <Radio.Group style={{ display: 'flex' }} onChange={handleSortChange}>
                            {[
                                {
                                    value: 'no',
                                    label: 'Отключить',
                                },
                                {
                                    value: 'title',
                                    label: 'По названию',
                                },
                                {
                                    value: 'email',
                                    label: 'По почте',
                                },
                            ].map((item, i) => (
                                <Radio.Button
                                    style={{ width: '100%' }}
                                    key={i}
                                    value={item.value}
                                    checked={item.value === gamesSort}
                                    disabled={gamesList.length === 0}>
                                    {item.label}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item>
                        <Button.Group>
                            <Button onClick={handleGenerateCode} disabled={gamesList.length === 0}>
                                Сгенерировать код для блога
                            </Button>
                            <Button onClick={handleRemoveGame} disabled={gamesList.length === 0 || gamesToRemove.length === 0}>
                                Удалить выбранную игру
                            </Button>
                        </Button.Group>
                    </Form.Item>
                </Form>
            </div>

            <p>Показано игр: {gamesList.length}</p>

            <Table
                dataSource={gamesList}
                columns={columns}
                pagination={false}
                rowSelection={{
                    type: 'radio',
                    columnTitle: 'Удаление',
                    onChange: selectedKeys => {
                        if (!Array.isArray(selectedKeys)) {
                            selectedKeys = [selectedKeys];
                        }
                        setGamesToRemove(selectedKeys);
                    },
                }}
            />
        </div>
    ) : (
        <div className="view view--noauth">
            <h3>Вы не авторизованы</h3>
        </div>
    );
};

export default ViewComponent;
