import React, { useState, useRef } from 'react';

import config from '../../config';

import SendComponent from './Send';

const SendContainer = props => {
    const [reCaptchaVerify, setReCaptchaVerify] = useState(false);
    const reCaptchaRef = useRef(null);

    const handleSubmit = formData => {
        reCaptchaRef.current.getResponse().then(value => {
            formData = { ...formData, captcha: value };
        });

        reCaptchaRef.current.reset();
    };

    const initialValuesItem = 'initial_form_values';

    const getInitialValues = () => {
        return localStorage.getItem(initialValuesItem) ? JSON.parse(localStorage.getItem(initialValuesItem)) : {};
    };

    const setInitialValue = event => {
        localStorage.setItem(initialValuesItem, JSON.stringify({ ...getInitialValues(), [event.target.id]: event.target.value }));
    };

    return (
        <SendComponent
            config={config}
            handleSubmit={handleSubmit}
            getInitialValues={getInitialValues}
            setInitialValue={setInitialValue}
            reCaptchaVerify={reCaptchaVerify}
            setReCaptchaVerify={setReCaptchaVerify}
            reCaptchaRef={reCaptchaRef}
        />
    );
};

export default SendContainer;
