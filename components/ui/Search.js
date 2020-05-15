import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

const InputText = styled.input`
    border: 1px solid var(--gris3);
    padding: 1rem;
    min-width: 300px;
`;

const InputSumit = styled.button`
    height: 3rem;
    width: 3rem;
    display: block;
    background-size: 3rem;
    background-image: url('./static/img/search.png');
    background-repeat: no-repeat;
    position: absolute;
    right: 1rem;
    top: 5px;
    background-color: white;
    border: none;
    text-indent: -9999px;

    &:hover {
        cursor: pointer;
    }
`;

const Search = () => {
    return (
        <form
            css={css`
                position: relative;
            `}
        >
            <InputText type="text" placeholder="Buscar Productos"></InputText>
            <InputSumit type="submit">Buscar</InputSumit>
        </form>
    );
};

export default Search;
