import { Card, Layout, Page } from '@shopify/polaris';
import React from 'react';

class Products extends React.Component {
    componentDidMount() {
        fetch('/getProducts').then((res) => res.json()).then((items) => {
            console.log(items)
        })
    }


    render() {
        return (
            <Page>
                <Layout.AnnotatedSection title="Products" description="List of products in the section">
                    <Card sectioned>
                        <div>
                            <p>List of products here</p>
                            <button onClick={}></button>
                        </div>
                    </Card>
                </Layout.AnnotatedSection>
            </Page>
        )
    }
}

export default Products;