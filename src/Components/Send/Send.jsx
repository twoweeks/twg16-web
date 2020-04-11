import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { ReCAPTCHA } from 'react-google-recaptcha';

import Link from '../Other/Link';

import './Send.scss';

const { TextArea } = Input;

const SendComponent = props => {
    const { config } = props;
    const { handleSubmit, reCaptchaRef } = props;
    const { getInitialValues, setInitialValue } = props;

    return (
        <div className="send">
            <Form className="send__form" initialValues={{ ...getInitialValues() }} onFinish={handleSubmit}>
                <Form.Item
                    label="Название игры"
                    extra="Максимум 100 символов"
                    name="title"
                    rules={[{ required: true, message: 'Введите название игры' }]}>
                    <Input placeholder="Корованы: The Videogame" onInput={setInitialValue} />
                </Form.Item>

                <Form.Item
                    label="Почта"
                    name="email"
                    rules={[
                        { type: 'email', message: 'Введите валидную почту' },
                        { required: true, message: 'Введите свою почту' },
                    ]}>
                    <Input placeholder="kirillsupergamedev@yandex.ru" onInput={setInitialValue} />
                </Form.Item>

                <Form.Item
                    label="Пароль"
                    extra="Будет необходим для подтверждения того, что именно вы ранее отправляли демоверсию. Хранится в открытом виде, так что не пишите сюда свой реальный пароль. Максимум 32 символа"
                    name="password"
                    rules={[{ required: true, message: 'Введите пароль' }]}>
                    <Input.Password maxLength="32" onInput={setInitialValue} />
                </Form.Item>

                <Form.Item label="Жанр игры" name="genre">
                    <Input placeholder="Адвенчура" onInput={setInitialValue} />
                </Form.Item>

                <Form.Item label="Описание игры" name="description">
                    <TextArea
                        rows={4}
                        placeholder="Пользователь может играть лесными эльфами, охраной дворца и злодеем. И если пользователь играет эльфами то эльфы в лесу, домики деревяные набигают солдаты дворца и злодеи. Можно грабить корованы..."
                        onInput={setInitialValue}
                    />
                </Form.Item>

                <Form.Item
                    label="Скриншот"
                    name="screenshot"
                    extra={`Рекомендуется использовать Imgur или VK`}
                    rules={[
                        { type: 'url', message: 'Введите валидный URL' },
                        { required: true, message: 'Добавьте скриншот' },
                    ]}>
                    <Input placeholder="https://i.imgur.com" />
                </Form.Item>

                <Form.Item
                    className="send__form-item-offset"
                    name="ready"
                    valuePropName="checked"
                    rules={[{ validator: (_, value) => (value ? Promise.resolve() : Promise.reject('Подтвердите готовность')) }]}>
                    <Checkbox>
                        Я прочитал(а/о) <Link href={config.links.rules} text="регламент" /> и готов(а/о) отправить игру
                    </Checkbox>
                </Form.Item>

                <ReCAPTCHA ref={reCaptchaRef} size="invisible" sitekey={config.api_keys.recaptcha} />

                <Form.Item className="send__form-item-offset">
                    <Button type="primary" htmlType="submit">
                        Отправить!
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SendComponent;
