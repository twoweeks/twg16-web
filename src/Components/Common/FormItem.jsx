import React from 'react';
import { Form, Input, Checkbox } from 'antd';

const { TextArea } = Input;

const FormItem = props => {
    const { type = 'text', name, className, label, extra, rules, valuePropName } = props;
    const { onInput, maxLength, placeholder, rows, checkboxContent } = props;

    let formChild;

    switch (type) {
        case 'text':
            formChild = <Input placeholder={placeholder} maxLength={maxLength} onInput={onInput} />;
            break;

        case 'textarea':
            formChild = <TextArea rows={rows} maxLength={maxLength} placeholder={placeholder} onInput={onInput} />;
            break;

        case 'checkbox':
            formChild = <Checkbox>{checkboxContent}</Checkbox>;
            break;

        default:
            break;
    }

    return (
        <Form.Item name={name} label={label} className={className} extra={extra} rules={rules} valuePropName={valuePropName}>
            {formChild}
        </Form.Item>
    );
};

export default FormItem;
