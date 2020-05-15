import React from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';

const Navigation = styled.nav`
    padding-left: 2rem;

    a {
        font-size: 1.8rem;
        margin-left: 2rem;
        color: var(--gris2);
        font-family; 'PT Sans', sans-serif;

        &:last-of-type {
            margin-right: 0;
        }
    }
`;

const Nav = () => {
    return (
        <Navigation>
            <Link href="/">Inicio</Link>
            <Link href="/populares">Populares</Link>
            <Link href="/new-product">Nuevo Producto</Link>
        </Navigation>
    );
};

export default Nav;
