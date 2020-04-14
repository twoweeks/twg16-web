import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { message } from 'antd';

import { getQuery, postQuery } from '../../api';

import ViewComponent from './View';

const ViewContainer = props => {
    const [isAuth, setIsAuth] = useState(false);

    const [gamesList, setGamesList] = useState([]);
    const [gamesListInitial, setGamesListInitial] = useState([]);

    const [gamesFilter, setGamesFilter] = useState('all');
    const [gamesSort, setGamesSort] = useState('no');

    const [gamesToRemove, setGamesToRemove] = useState([]);

    const [currentModal, setCurrentModal] = useState(null);

    const [blogCode, setBlogCode] = useState(null);

    const location = useLocation();
    const locationSeatchParams = new URLSearchParams(location.search);

    useEffect(() => {
        getQuery('games', locationSeatchParams.get('key')).then(data => {
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
    }, []);

    const handleRemoveGame = () => {
        if (gamesToRemove.length !== 0) {
            const targets = gamesToRemove;

            postQuery({ action: 'rm', key: locationSeatchParams.get('key'), targets: JSON.stringify(targets) }).then(data => {
                if (data.code === 1) {
                    let gamesListInitialFiltred = [];
                    let gamesListFiltred = [];

                    targets.forEach(target => {
                        gamesListInitialFiltred = gamesListInitial.filter(item => item.id !== target);
                        gamesListFiltred = gamesList.filter(item => item.id !== target);
                    });

                    setGamesListInitial(gamesListInitialFiltred);
                    setGamesList(gamesListFiltred);

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
            case 'demo-stage':
                filtredGamesList = gamesListInitial.filter(item => item.stage === 'demo');
                break;
            case 'final-stage':
                filtredGamesList = gamesListInitial.filter(item => item.stage === 'final');
                break;
            default:
        }

        setGamesFilter(value);
        setGamesList(filtredGamesList);
    };

    const handleSortChange = e => {
        const value = e.target.value;
        let sortedGamesList = [];

        const sortObject = (object, by) => {
            const tmp = [...object];
            tmp.sort((a, b) => {
                if (a[by] < b[by]) {
                    return -1;
                }
                if (a[by] > b[by]) {
                    return 1;
                }
                return 0;
            });
            return tmp;
        };

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
                `\t<div class="game">` +
                `\r\n\t\t<picture class="game__picture"><img src="${game.link_screenshot}" alt="screenshot"></picture>` +
                `\r\n\t\t<div class="game__info">` +
                `\r\n\t\t\t<h3 class="game__info--title">${game.title}</h3>` +
                (game.genre ? `\r\n\t\t\t<p class="game__info--genre">${game.genre}</p>` : '') +
                (game.description ? `\r\n\t\t\t<p class="game__info--description">${game.description.replace(/\n/g, '<br>')}</p>` : '') +
                `\r\n\t\t\t<a class="game__info--link" href="${game.link_archive}" target="_blank" rel="nofollow noopener"><span>скачать</span></a>` +
                `\r\n\t\t</div>` +
                `\r\n\t</div>\r\n`;
        });

        output += '</div>';

        setBlogCode(output);
        setCurrentModal('code');
    };

    return (
        <ViewComponent
            isAuth={isAuth}
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
        />
    );
};

export default ViewContainer;
