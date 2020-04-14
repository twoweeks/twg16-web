import React from 'react';
import { Table, Form, Modal, Radio, Input, Button } from 'antd';

import Link from '../Common/Link';

import './View.scss';

const ViewComponent = props => {
    const { isAuth, gamesList, gamesListInitial } = props;
    const { gamesFilter, handleFilterChange } = props;
    const { gamesSort, handleSortChange } = props;
    const { handleGenerateCode, blogCode } = props;
    const { gamesToRemove, setGamesToRemove, handleRemoveGame } = props;
    const { currentModal, handleModalClose } = props;

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
                        <Radio.Group className="view__form-radio" onChange={handleFilterChange}>
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
                                <Radio.Button
                                    className="view__form-radio-btn"
                                    key={i}
                                    value={item.value}
                                    checked={item.value === gamesFilter}
                                    disabled={gamesListInitial.length === 0}>
                                    {item.label}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Сортировка">
                        <Radio.Group className="view__form-radio" onChange={handleSortChange}>
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
                                    className="view__form-radio-btn"
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
                                Удалить выбранные игры
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
                    type: 'checkbox',
                    columnTitle: 'Удаление',
                    onChange: selectedKeys => {
                        if (!Array.isArray(selectedKeys)) {
                            selectedKeys = [selectedKeys];
                        }
                        setGamesToRemove(selectedKeys);
                    },
                }}
            />

            <Modal visible={currentModal === 'code'} width="90%" footer={null} closable={false} onCancel={handleModalClose}>
                <Input.TextArea rows={20} value={blogCode} />
            </Modal>
        </div>
    ) : (
        <div className="view view--noauth">
            <h3>Вы не авторизованы</h3>
        </div>
    );
};

export default ViewComponent;
