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

    const location = useLocation();
    const locationSeatchParams = new URLSearchParams(location.search);

    useEffect(() => {
        getQuery('games', locationSeatchParams.get('key')).then(data => {
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
            const target = gamesToRemove[0];

            postQuery({ action: 'rm', id: target }, locationSeatchParams.get('key')).then(data => {
                if (data.code === 1) {
                    message.success(data.msg);

                    setGamesListInitial(gamesListInitial.filter(item => item.id !== target));
                    setGamesList(gamesList.filter(item => item.id !== target));
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

    const handleGenerateCode = _gamesList => {
        message.info('Coming soon');
    };

    return (
        <ViewComponent
            isAuth={isAuth}
            gamesList={gamesList}
            gamesFilter={gamesFilter}
            handleFilterChange={handleFilterChange}
            gamesSort={gamesSort}
            handleSortChange={handleSortChange}
            handleRemoveGame={handleRemoveGame}
            handleGenerateCode={handleGenerateCode}
            gamesToRemove={gamesToRemove}
            setGamesToRemove={setGamesToRemove}
        />
    );
};

export default ViewContainer;
