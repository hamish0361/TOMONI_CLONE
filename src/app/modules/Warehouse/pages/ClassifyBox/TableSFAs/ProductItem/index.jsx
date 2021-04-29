import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

ProductItem.propTypes = {
    products: PropTypes.any
};

function ProductItem({ products }) {
    return (
        <div className="product-item">
            <div className="product-item__title">Items</div>

            <div className="product-item__item">
                {products?.[0]?.product_id || '---'}
            </div>

            <div className="product-item__item">
                ...
            </div>
        </div>
    );
}

export default ProductItem;