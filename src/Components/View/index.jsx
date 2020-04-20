import React, { useState, useEffect, useRef } from 'react';
import { Form, message } from 'antd';

import config from '../../config';

import { getQuery, postQuery } from '../../api';
import sortObject from '../../utilities/sortObject';

import ViewComponent from './View';

const ViewContainer = props => {
    const [isAuth, setIsAuth] = useState(false);
    const [authFormInstance] = Form.useForm();

    const [reCaptchaVerify, setReCaptchaVerify] = useState(false);
    const reCaptchaRef = useRef(null);

    const [gamesList, setGamesList] = useState([]);
    const [gamesListInitial, setGamesListInitial] = useState([]);

    const [gamesFilter, setGamesFilter] = useState('all');
    const [gamesSort, setGamesSort] = useState('no');

    const [gamesToRemove, setGamesToRemove] = useState([]);

    const [currentModal, setCurrentModal] = useState(null);

    const [blogCode, setBlogCode] = useState(null);

    useEffect(() => {
        getGames();
    }, []);

    const getGames = () => {
        getQuery('games', localStorage.getItem('authKey')).then(data => {
            // TODO: якобы не авторизует, когда список игр пуст
            if (data.code === 1) {
                setIsAuth(true);

                const gamesListMapped = data.data.map(item => ({ ...item, key: item.id }));
                setGamesList(gamesListMapped);
                setGamesListInitial(gamesListMapped);

                message.success(data.msg);
            } else {
                setIsAuth(false);
                message.error(data.msg);
            }
        });
    };

    const handleRemoveGame = () => {
        if (gamesToRemove.length !== 0) {
            const targets = gamesToRemove;

            postQuery({ action: 'rm', targets: JSON.stringify(targets), authKey: localStorage.getItem('authKey') }).then(data => {
                if (data.code === 1) {
                    setGamesListInitial(gamesListInitial.filter(item => !targets.includes(item.key)));
                    setGamesList(gamesList.filter(item => !targets.includes(item.key)));

                    message.success(data.msg);
                } else {
                    message.warning(data.msg);
                }
            });
        }
    };

    const handleFilterChange = e => {
        const value = e.target.value;
        let filtredGamesList = [];

        switch (value) {
            case 'all':
                filtredGamesList = gamesListInitial;
                break;
            case 'demo':
            case 'final':
                filtredGamesList = gamesListInitial.filter(item => item.stage === value);
                break;
            default:
        }

        setGamesFilter(value);
        setGamesList(filtredGamesList);
    };

    const handleSortChange = e => {
        const value = e.target.value;
        let sortedGamesList = [];

        switch (value) {
            case 'no':
                sortedGamesList = gamesListInitial;
                break;
            case 'title':
            case 'email':
                sortedGamesList = sortObject(gamesListInitial, value);
                break;

            default:
        }

        setGamesSort(value);
        setGamesList(sortedGamesList);
    };

    const handleModalClose = () => {
        setCurrentModal(null);
    };

    const handleGenerateCode = _gamesList => {
        let output = '<div class="games-container">\r\n';

        gamesList.forEach(game => {
            output +=
                `  <div class="game">` +
                `\r\n    <picture class="game__picture"></picture>` +
                `\r\n    <div class="game__info">` +
                `\r\n      <h3 class="game__info--title">${game.title}</h3>` +
                (game.genre ? `\r\n      <p class="game__info--genre">${game.genre}</p>` : '') +
                (game.description ? `\r\n      <p class="game__info--description">${game.description.replace(/\n/g, '<br>')}</p>` : '') +
                (game.tools ? `\r\n      <p class="game__info--tools">${game.tools.replace(/\n/g, '')}</p>` : '') +
                `\r\n      <a class="game__info--link" href="" target="_blank" rel="nofollow noopener"><span>скачать</span></a>` +
                `\r\n    </div>` +
                `\r\n  </div>\r\n`;
        });

        output += '</div>';

        setBlogCode(output);
        setCurrentModal('code');
    };

    const handleAuthSubmit = formData => {
        reCaptchaRef.current.getResponse().then(value => {
            formData = { ...formData, action: 'auth', captcha: value };

            postQuery(formData).then(data => {
                if (data.code === 1) {
                    localStorage.setItem('authKey', formData['authKey']);
                    setIsAuth(true);
                    getGames();
                    message.success(data.msg);
                } else {
                    message.warning(data.msg);
                }
            });
        });

        authFormInstance.resetFields();
        reCaptchaRef.current.reset();
    };

    return (
        <ViewComponent
            isAuth={isAuth}
            config={config}
            gamesList={gamesList}
            gamesListInitial={gamesListInitial}
            gamesFilter={gamesFilter}
            handleFilterChange={handleFilterChange}
            gamesSort={gamesSort}
            handleSortChange={handleSortChange}
            handleRemoveGame={handleRemoveGame}
            handleGenerateCode={handleGenerateCode}
            blogCode={blogCode}
            gamesToRemove={gamesToRemove}
            setGamesToRemove={setGamesToRemove}
            currentModal={currentModal}
            handleModalClose={handleModalClose}
            authFormInstance={authFormInstance}
            handleAuthSubmit={handleAuthSubmit}
            reCaptchaVerify={reCaptchaVerify}
            setReCaptchaVerify={setReCaptchaVerify}
            reCaptchaRef={reCaptchaRef}
        />
    );
};

export default ViewContainer;
