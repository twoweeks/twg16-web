import React from 'react';
import { Form, Button } from 'antd';
import ReCAPTCHA from 'reaptcha';

import FormItem from '../Common/FormItem';
import Link from '../Common/Link';

import './Send.scss';

const SendComponent = props => {
    const { config, isLoading, isError } = props;
    const { formInstance, formIsOpen, handleSubmit } = props;
    const { getInitialValues, setInitialValue } = props;
    const { reCaptchaVerify, setReCaptchaVerify, reCaptchaRef } = props;

    return (
        <div className="send">
            {(isLoading || isError || !formIsOpen) && (
                <p className="send__message">
                    {isLoading ? 'Подождите, идёт загрузка...' : isError ? 'Не удалось соединиться с сервером' : !formIsOpen && 'Форма закрыта'}
                </p>
            )}
            {formIsOpen && (
                <Form form={formInstance} className="send__form" initialValues={{ ...getInitialValues() }} onFinish={handleSubmit}>
                    <FormItem
                        name="title"
                        label="Название игры"
                        extra="Максимум 100 символов"
                        rules={[{ required: true, message: 'Введите название игры' }]}
                        placeholder="Корованы: The Videogame"
                        onInput={setInitialValue}
                        maxLength="100"
                    />

                    <FormItem
                        name="email"
                        label="Почта"
                        extra="Укажите существующую почту. Если с вами не получится связаться — вина ваша. Максимум 50 символов"
                        rules={[
                            { type: 'email', message: 'Введите валидную почту' },
                            { required: true, message: 'Введите свою почту' },
                        ]}
                        placeholder="kirillsupergamedev@yandex.ru"
                        onInput={setInitialValue}
                        maxLength="50"
                    />

                    <FormItem
                        name="genre"
                        label="Жанр игры"
                        extra="Максимум 50 символов"
                        placeholder="Адвенчура"
                        onInput={setInitialValue}
                        maxLength="50"
                    />

                    <FormItem
                        type="textarea"
                        name="description"
                        label="Описание игры"
                        extra="Максимум 200 символов, без переносов на новую строку"
                        rows={4}
                        maxLength="200"
                        placeholder="Пользователь может играть лесными эльфами, охраной дворца и злодеем. И если пользователь играет эльфами то эльфы в лесу, домики деревяные набигают солдаты дворца и злодеи. Можно грабить корованы..."
                        onInput={setInitialValue}
                    />

                    <FormItem
                        type="textarea"
                        name="tools"
                        label="Инструменты"
                        extra="Максимум 100 символов, без переносов на новую строку"
                        rows={2}
                        maxLength="100"
                        placeholder="Unity, Blender, Paint"
                        onInput={setInitialValue}
                    />

                    <FormItem
                        name="archive"
                        label="Архив с игрой"
                        extra="Рекомендуется использовать Яндекс.Диск, Google Drive или Firefox Send. Максимум 100 символов"
                        rules={[
                            { type: 'url', message: 'Введите валидный URL' },
                            { required: true, message: 'Добавьте ссылку на архив' },
                        ]}
                        placeholder="https://yadi.sk"
                        maxLength="100"
                    />

                    <FormItem
                        name="screenshot"
                        label="Скриншот"
                        extra={'Рекомендуется использовать Imgur или VK. Максимум 100 символов'}
                        rules={[
                            { type: 'url', message: 'Введите валидный URL' },
                            { required: true, message: 'Добавьте скриншот' },
                        ]}
                        placeholder="https://i.imgur.com"
                        maxLength="100"
                    />

                    <FormItem
                        type="checkbox"
                        name="ready"
                        className="send__form-item-offset"
                        valuePropName="checked"
                        rules={[{ validator: (_, value) => (value ? Promise.resolve() : Promise.reject('Подтвердите готовность')) }]}
                        checkboxContent={
                            <>
                                Я прочитал(а/о) <Link href={config.links.rules} text="регламент" /> и готов(а/о) отправить игру
                            </>
                        }
                    />

                    <Form.Item className="send__form-item-offset">
                        <ReCAPTCHA
                            size="normal"
                            ref={reCaptchaRef}
                            sitekey={config.api_keys.recaptcha}
                            onVerify={token => {
                                setReCaptchaVerify(true);
                            }}
                        />
                    </Form.Item>

                    <Form.Item className="send__form-item-offset">
                        <Button type="primary" htmlType="submit" disabled={!reCaptchaVerify}>
                            Отправить!
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default SendComponent;
