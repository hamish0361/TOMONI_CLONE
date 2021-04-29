import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from '_metronic/_partials/controls';

ProductItem.propTypes = {
    product: PropTypes.object,
    onProductClick: PropTypes.func
};

function ProductItem({ product, onProductClick }) {
    return (
        <Card>
            <CardBody>
                <div
                    className="d-flex justify-content-between product-item"
                    onClick={() => onProductClick && onProductClick(product)}
                >
                    <div className="w-50 mr-2">
                        <div className="font-size-h6 font-weight-bold">
                            {product?.name}
                        </div>
                        <div>{product?.id}</div>
                    </div>
                    <div className="mr-4">
                        Tồn kho: <span className="text-danger">100</span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export default ProductItem;
