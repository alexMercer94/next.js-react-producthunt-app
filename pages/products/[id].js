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

const ProductCreator = styled.p`
    padding: 0.5rem 2rem;
    background-color: #da552f;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Product = () => {
    // Component state
    const [product, setProduct] = useState({});
    const [error, setError] = useState(false);
    const [comment, setComment] = useState({});
    const [consultDB, setConsultDB] = useState(true);

    // Routing inorder to get current id
    const router = useRouter();
    const {
        query: { id },
    } = router;

    // Firebase context
    const { firebase, user } = useContext(FirebaseContext);

    useEffect(() => {
        if (id && consultDB) {
            const getProduct = async () => {
                const productQuery = await firebase.db.collection('products').doc(id);
                const product = await productQuery.get();
                if (product.exists) {
                    setProduct(product.data());
                    setConsultDB(false);
                } else {
                    setError(true);
                    setConsultDB(false);
                }
            };

            getProduct();
        }
    }, [id]);

    if (Object.keys(product).length === 0 && !error) return 'Cargando...';

    const { comments, createdAt, description, company, name, url, imageURL, votes, creator, hasVoted } = product;

    /**
     * Manage and validdate votes
     */
    const voteProduct = () => {
        if (!user) {
            return router.push('/login');
        }

        const newTotal = votes + 1;

        // Verify if user has voted
        if (hasVoted.includes(user.uid)) return;

        // Save ID of user has voted
        const newHasVoted = [...hasVoted, user.uid];

        //Update db
        firebase.db.collection('products').doc(id).update({ votes: newTotal, hasVoted: newHasVoted });

        //Update State
        setProduct({
            ...product,
            votes: newTotal,
        });

        setConsultDB(true);
    };

    /**
     * Function to create comments
     * @param {*} e Event
     */
    const commentChange = (e) => {
        setComment({
            ...comment,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Add new comment
     * @param {*} e Event
     */
    const addComment = (e) => {
        e.preventDefault();

        if (!user) {
            return router.push('/login');
        }

        comment.userId = user.uid;
        comment.username = user.displayName;

        const newComments = [...comments, comment];

        // Update db
        firebase.db.collection('products').doc(id).update({
            comments: newComments,
        });

        // Update state
        setProduct({
            ...product,
            comments: newComments,
        });

        setConsultDB(true);
    };

    /**
     * Identify if comment is from product's creator
     * @param {*} id Id
     */
    const isCreator = (id) => {
        if (creator.id === id) {
            return true;
        }
    };

    /**
     * Review that the user authenticated can be delete product
     */
    const canDelete = () => {
        if (!user) return false;

        if (creator.id === user.uid) {
            return true;
        }
    };

    /**
     * Delete product
     */
    const deleteProduct = async () => {
        if (!user) {
            return router.push('/login');
        }

        if (creator.id !== user.uid) {
            return router.push('/');
        }
        try {
            await firebase.db.collection('products').doc(id).delete();
            return router.push('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <Fragment>
                {error ? (
                    <Error404></Error404>
                ) : (
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
                                {user && (
                                    <>
                                        <h2>Agrega tu comentario</h2>
                                        <form onSubmit={addComment}>
                                            <Field>
                                                <input type="text" name="message" onChange={commentChange}></input>
                                            </Field>
                                            <InputSubmit type="submit" value="Agregar comentario"></InputSubmit>
                                        </form>
                                    </>
                                )}
                                <h2
                                    css={css`
                                        margin: 2rem 0;
                                    `}
                                >
                                    Comentarios
                                </h2>
                                {comments.length === 0 ? (
                                    'Aún no hay comentarions.'
                                ) : (
                                    <ul>
                                        {comments.map((comment, i) => (
                                            <li
                                                key={`${comment.userId}-${i}`}
                                                css={css`
                                                    border: 1px solid #e1e1e1;
                                                    padding: 2rem;
                                                `}
                                            >
                                                <p>{comment.message}</p>
                                                <p>
                                                    Escrito por:{' '}
                                                    <span
                                                        css={css`
                                                            font-weight: bold;
                                                        `}
                                                    >
                                                        {comment.username}
                                                    </span>
                                                </p>
                                                {isCreator(comment.userId) && (
                                                    <ProductCreator>Es creador</ProductCreator>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
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
                                    {user && <Button onClick={voteProduct}>Votar</Button>}
                                </div>
                            </aside>
                        </ProductContainer>
                        {canDelete() && <Button onClick={deleteProduct}>Eliminar Producto</Button>}
                    </div>
                )}
            </Fragment>
        </Layout>
    );
};

export default Product;
