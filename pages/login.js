import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { css } from '@emotion/core';
import { Form, Field, InputSubmit, ErrorMsg } from '../components/ui/Form';
import firebase from '../firebase';
import Router from 'next/router';
// Validations
import useValidation from '../hooks/useValidation';
import validateLogin from '../validation/validateLogin';

const INITIAL_STATE = {
    email: '',
    password: '',
};

const Login = () => {
    const [error, setError] = useState(false);

    const { values, errors, submitForm, handleChange, handleSubmit, handleBlur } = useValidation(
        INITIAL_STATE,
        validateLogin,
        login
    );

    const { email, password } = values;

    async function login() {
        try {
            await firebase.login(email, password);
            Router.push('/');
        } catch (error) {
            console.error('Hubo un error al autenticar el usuario', error.message);
            setError(error.message);
        }
    }

    return (
        <div>
            <Layout>
                <>
                    <h1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}
                    >
                        Iniciar Sesión
                    </h1>
                    <Form onSubmit={handleSubmit} noValidate>
                        <Field>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Tu Email"
                                value={email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            ></input>
                        </Field>
                        {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
                        <Field>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Tu password"
                                value={password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            ></input>
                        </Field>
                        {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}
                        {error && <ErrorMsg>{error}</ErrorMsg>}
                        <InputSubmit type="submit" value="Iniciar sesión"></InputSubmit>
                    </Form>
                </>
            </Layout>
        </div>
    );
};

export default Login;
