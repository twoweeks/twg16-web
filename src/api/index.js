import ky from 'ky';

import config from '../config';

const api = ky.create({ prefixUrl: config.host.url });

export const getQuery = async (subject = 'status', authKey) => {
    return await api.get(`${config.host.endpoint}?get=${subject}${authKey ? '&key=' + authKey : ''}`).then(r => r.json());
};

export const postQuery = async body => {
    const formData = new FormData();

    Object.keys(body).forEach(key => {
        formData.append(key, body[key]);
    });

    return await api.post(config.host.endpoint, { body: formData }).then(r => r.json());
};
