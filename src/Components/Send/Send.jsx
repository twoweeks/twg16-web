import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import ReCAPTCHA from 'reaptcha';

import Link from '../Other/Link';

import './Send.scss';

const { TextArea } = Input;

const SendComponent = props => {
    const { config } = props;
    const { handleSubmit } = props;
    const { getInitialValues, setInitialValue } = props;
    const { reCaptchaVerify, setReCaptchaVerify, reCaptchaRef } = props;

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

                <Form.Item label="Описание игры" extra="Максимум 200 символов, без переносов на новую строку" name="description">
                    <TextArea
                        rows={4}
                        maxLength="200"
                        placeholder="Пользователь может играть лесными эльфами, охраной дворца и злодеем. И если пользователь играет эльфами то эльфы в лесу, домики деревяные набигают солдаты дворца и злодеи. Можно грабить корованы..."
                        onInput={setInitialValue}
                    />
                </Form.Item>

                <Form.Item label="Инструменты" extra="Максимум 100 символов, без переносов на новую строку" name="tools">
                    <TextArea rows={2} maxLength="200" placeholder="Unity, Blender, Paint" onInput={setInitialValue} />
                </Form.Item>

                <Form.Item
                    label="Архив с игрой"
                    name="archive"
                    extra={`Рекомендуется использовать Яндекс.Диск или Google Drive`}
                    rules={[
                        { type: 'url', message: 'Введите валидный URL' },
                        { required: true, message: 'Добавьте ссылку на архив' },
                    ]}>
                    <Input placeholder="https://yadi.sk" />
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
    );
};

export default SendComponent;
