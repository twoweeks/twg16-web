import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import ReCAPTCHA from 'reaptcha';

import Link from '../Other/Link';

import './Send.scss';

const { TextArea } = Input;

const SendComponent = props => {
    const { config, formIsOpen } = props;
    const { handleSubmit } = props;
    const { getInitialValues, setInitialValue } = props;
    const { reCaptchaVerify, setReCaptchaVerify, reCaptchaRef } = props;

    return formIsOpen ? (
        <div className="send">
            <Form className="send__form" initialValues={{ ...getInitialValues() }} onFinish={handleSubmit}>
                <Form.Item
                    name="title"
                    label="Название игры"
                    extra="Максимум 100 символов"
                    rules={[{ required: true, message: 'Введите название игры' }]}>
                    <Input placeholder="Корованы: The Videogame" onInput={setInitialValue} />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Почта"
                    rules={[
                        { type: 'email', message: 'Введите валидную почту' },
                        { required: true, message: 'Введите свою почту' },
                    ]}>
                    <Input placeholder="kirillsupergamedev@yandex.ru" onInput={setInitialValue} />
                </Form.Item>

                <Form.Item name="genre" label="Жанр игры" extra="Максимум 50 символов">
                    <Input placeholder="Адвенчура" onInput={setInitialValue} maxLength="50" />
                </Form.Item>

                <Form.Item name="description" label="Описание игры" extra="Максимум 200 символов, без переносов на новую строку">
                    <TextArea
                        rows={4}
                        maxLength="200"
                        placeholder="Пользователь может играть лесными эльфами, охраной дворца и злодеем. И если пользователь играет эльфами то эльфы в лесу, домики деревяные набигают солдаты дворца и злодеи. Можно грабить корованы..."
                        onInput={setInitialValue}
                    />
                </Form.Item>

                <Form.Item name="tools" label="Инструменты" extra="Максимум 100 символов, без переносов на новую строку">
                    <TextArea rows={2} maxLength="200" placeholder="Unity, Blender, Paint" onInput={setInitialValue} />
                </Form.Item>

                <Form.Item
                    name="archive"
                    label="Архив с игрой"
                    extra={`Рекомендуется использовать Яндекс.Диск или Google Drive`}
                    rules={[
                        { type: 'url', message: 'Введите валидный URL' },
                        { required: true, message: 'Добавьте ссылку на архив' },
                    ]}>
                    <Input placeholder="https://yadi.sk" />
                </Form.Item>

                <Form.Item
                    name="screenshot"
                    label="Скриншот"
                    extra={`Рекомендуется использовать Imgur или VK`}
                    rules={[
                        { type: 'url', message: 'Введите валидный URL' },
                        { required: true, message: 'Добавьте скриншот' },
                    ]}>
                    <Input placeholder="https://i.imgur.com" />
                </Form.Item>

                <Form.Item
                    name="ready"
                    className="send__form-item-offset"
                    valuePropName="checked"
                    rules={[{ validator: (_, value) => (value ? Promise.resolve() : Promise.reject('Подтвердите готовность')) }]}>
                    <Checkbox>
                        Я прочитал(а/о) <Link href={config.links.rules} text="регламент" /> и готов(а/о) отправить игру
                    </Checkbox>
                </Form.Item>

                <Form.Item className="send__form-item-offset">
                    <ReCAPTCHA
                        size="normal"
                        ref={reCaptchaRef}
                        sitekey={config.api_keys.recaptcha}
                        onVerify={token => {
                            setReCaptchaVerify(true);
                            console.log(token);
                        }}
                    />
                </Form.Item>

                <Form.Item className="send__form-item-offset">
                    <Button type="primary" htmlType="submit" disabled={!reCaptchaVerify}>
                        Отправить!
                    </Button>
                </Form.Item>
            </Form>
        </div>
    ) : (
        <div className="send send--closed">
            <h3>Форма закрыта</h3>
        </div>
    );
};

export default SendComponent;
