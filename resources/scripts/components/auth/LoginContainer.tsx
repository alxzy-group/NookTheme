import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import login from '@/api/auth/login';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import Field from '@/components/elements/Field';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

// PERBAIKAN: Menggunakan warna gradien yang pasti ada
const AuthContainer = styled.div`
    ${tw`flex items-center justify-center w-full min-h-screen p-4`};
    background: linear-gradient(135deg, #262626 0%, #171717 100%);
`;

interface Values {
    username: string;
    password: string;
}

const LoginContainer = ({ history, location }: RouteComponentProps) => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
            return;
        }

        login({ ...values, recaptchaData: token })
            .then((response) => {
                if (response.complete) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/';
                    return;
                }
                history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
            })
            .catch((error) => {
                console.error(error);
                setToken('');
                if (ref.current) ref.current.reset();
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <AuthContainer>
            {/* PERBAIKAN: Menggunakan bg-neutral-800 dan border-neutral-700 */}
            <div css={tw`w-full max-w-md mx-auto bg-neutral-800 bg-opacity-60 backdrop-blur-sm border border-neutral-700 rounded-2xl shadow-lg p-8`}>
                <div css={tw`text-center mb-8`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" css={tw`w-12 h-12 mx-auto text-neutral-300`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                    </svg>
                    {/* PERBAIKAN: Menggunakan text-neutral-100 dan text-neutral-400 */}
                    <h2 css={tw`mt-4 text-2xl font-bold text-neutral-100`}>Welcome Back</h2>
                    <p css={tw`text-sm text-neutral-400`}>Sign in to access your dashboard.</p>
                </div>
                
                <Formik
                    onSubmit={onSubmit}
                    initialValues={{ username: '', password: '' }}
                    validationSchema={object().shape({
                        username: string().required('A username or email must be provided.'),
                        password: string().required('Please enter your account password.'),
                    })}
                >
                    {({ isSubmitting, setSubmitting, submitForm }) => (
                        <form onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
                            <div css={tw`relative mb-4`}>
                                <div css={tw`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
                                    <FontAwesomeIcon icon={faUser} css={tw`text-neutral-500`} />
                                </div>
                                <Field
                                    css={tw`pl-10!`}
                                    type={'text'}
                                    name={'username'}
                                    placeholder={'Username or Email'}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div css={tw`relative mb-6`}>
                                <div css={tw`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
                                    <FontAwesomeIcon icon={faLock} css={tw`text-neutral-500`} />
                                </div>
                                <Field
                                    css={tw`pl-10!`}
                                    type={'password'}
                                    name={'password'}
                                    placeholder={'Password'}
                                    disabled={isSubmitting}
                                />
                            </div>
                            
                            <Button type={'submit'} size={'xlarge'} isLoading={isSubmitting} disabled={isSubmitting} css={tw`w-full`}>
                                Login
                            </Button>

                            {recaptchaEnabled && (
                                <Reaptcha
                                    ref={ref}
                                    size={'invisible'}
                                    sitekey={siteKey || '_invalid_key'}
                                    onVerify={(response) => {
                                        setToken(response);
                                        submitForm();
                                    }}
                                    onExpire={() => {
                                        setSubmitting(false);
                                        setToken('');
                                    }}
                                />
                            )}
                            <div css={tw`mt-6 text-center`}>
                                <Link
                                    to={'/auth/password'}
                                    css={tw`text-xs text-neutral-400 tracking-wide no-underline uppercase hover:text-neutral-200 transition-colors duration-150`}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </AuthContainer>
    );
};

export default LoginContainer;
