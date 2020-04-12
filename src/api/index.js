import ky from 'ky';

import config from '../config';

const api = ky.create({ prefixUrl: config.host });

export const getStatus = async () => {
    return await api.get('request.php?get-status').then(r => r.json());
};
