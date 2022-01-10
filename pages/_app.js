import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { AppProvider } from '@shopify/polaris'
import translations from '@shopify/polaris/locales/en.json'
import '@shopify/polaris/build/esm/styles.css'

class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;

        return (
            <React.Fragment>
                <Head>
                    <title>Elena App</title>
                    <meta charSet="utf-8" />
                </Head>
                <AppProvider i18n={translations}>
                    <Component {...pageProps} />
                </AppProvider>
            </React.Fragment>
        )
    }
}

export default MyApp;