import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'antd';

import config from '../../config';

import { getQuery, postQuery } from '../../api';

import SendComponent from './Send';

const SendContainer = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const [formInstance] = Form.useForm();
    const [formIsOpen, setFormIsOpen] = useState(false);

    const [currentModal, setCurrentModal] = useState({});

    const [reCaptchaVerify, setReCaptchaVerify] = useState(false);
    const reCaptchaRef = useRef(null);

    useEffect(() => {
        setIsLoading(true);

        getQuery('status')
            .then(data => {
                if (data.code && data.code === 1 && data.data.status === 'open') {
                    setFormIsOpen(true);
                }
            })
            .catch(error => {
                setIsError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleSubmit = formData => {
        reCaptchaRef.current.getResponse().then(value => {
            formData = { ...formData, action: 'add', captcha: value };

            postQuery(formData)
                .then(data => {
                    setCurrentModal({
                        id: 'alert',
                        content: {
                            emoji: data.code === 1 ? '🙂' : '😟',
                            text: data.msg,
                        },
                    });
                })
                .catch(error => {
                    setCurrentModal({
                        id: 'alert',
                        content: {
                            emoji: '😞',
                            text: error,
                        },
                    });
                });
        });

        formInstance.resetFields();
        reCaptchaRef.current.reset();
    };

    const initialValuesItem = 'initial_form_values';

    const getInitialValues = () => {
        return localStorage.getItem(initialValuesItem) ? JSON.parse(localStorage.getItem(initialValuesItem)) : {};
    };

    const setInitialValue = event => {
        localStorage.setItem(initialValuesItem, JSON.stringify({ ...getInitialValues(), [event.target.id]: event.target.value }));
    };

    const handleModalClose = () => {
        setCurrentModal({});
    };

    return (
        <SendComponent
            isLoading={isLoading}
            isError={isError}
            config={config}
            formInstance={formInstance}
            formIsOpen={formIsOpen}
            handleSubmit={handleSubmit}
            getInitialValues={getInitialValues}
            setInitialValue={setInitialValue}
            reCaptchaVerify={reCaptchaVerify}
            setReCaptchaVerify={setReCaptchaVerify}
            reCaptchaRef={reCaptchaRef}
            handleModalClose={handleModalClose}
            currentModal={currentModal}
        />
    );
};

export default SendContainer;
