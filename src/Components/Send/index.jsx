import React, { useRef } from 'react';

import config from '../../config';

import SendComponent from './Send';

const SendContainer = props => {
    const reCaptchaRef = useRef(null);

    const handleSubmit = formData => {
        reCaptchaRef.current.execute();
        console.log(formData);
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
            reCaptchaRef={reCaptchaRef}
        />
    );
};

export default SendContainer;
