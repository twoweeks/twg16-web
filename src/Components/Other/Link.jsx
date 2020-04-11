import React from 'react';

const Link = props => {
    const { href, text, target = '_blank' } = props;

    return (
        <a href={href} target={target} rel="nofollow noopener">
            {text}
        </a>
    );
};

export default Link;
