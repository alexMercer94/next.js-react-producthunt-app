import React, { useEffect, useContext, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { Field, InputSubmit } from '../../components/ui/Form';
import Button from '../../components/ui/Button';

const ProductContainer = styled.div`
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const Product = () => {
    // Component state
    const [product, setProduct] = useState({});
    const [error, setError] = useState(false);

    // Routing inorder to get current id
    const router = useRouter();
    const {
        query: { id },
    } = router;

    // Firebase context
    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        if (id) {
            const getProduct = async () => {
                const productQuery = await firebase.db.collection('products').doc(id);
                const product = await productQuery.get();
                if (product.exists) {
                    setProduct(product.data());
                } else {
                    setError(true);
                }
            };

            getProduct();
        }
    }, [id]);

    if (Object.keys(product).length === 0) return 'Cargando...';

    const { comments, createdAt, description, company, name, url, imageURL, votes, creator } = product;

    return (
        <Layout>
            <Fragment>
                {error && <Error404></Error404>}
                <div className="contenedor">
                    <h1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}
                    >
                        {name}
                    </h1>
                    <ProductContainer>
                        <div>
                            <p>Publicado hace: {formatDistanceToNow(new Date(createdAt), { locale: es })}</p>
                            <p>
                                Por: {creator.name} de {company}
                            </p>
                            <img src={imageURL}></img>
                            <p>{description}</p>
                            <h2>Agrega tu comentario</h2>
                            <form>
                                <Field>
                                    <input type="text" name="message"></input>
                                </Field>
                                <InputSubmit type="submit" value="Agregar comentario"></InputSubmit>
                            </form>
                            <h2
                                css={css`
                                    margin: 2rem 0;
                                `}
                            >
                                Comentarios
                            </h2>
                            {comments.map((comment) => {
                                <li>
                                    <p>{comment.name}</p>
                                    <p>Escrito por: {comment.username}</p>
                                </li>;
                            })}
                        </div>
                        <aside>
                            <Button target="_blank" bgColor="true" href={url}>
                                Visitar URL
                            </Button>

                            <div
                                css={css`
                                    margin-top: 5rem;
                                `}
                            >
                                <p
                                    css={css`
                                        text-align: center;
                                    `}
                                >
                                    {votes} votos
                                </p>
                                <Button>Votar</Button>
                            </div>
                        </aside>
                    </ProductContainer>
                </div>
            </Fragment>
        </Layout>
    );
};

export default Product;
