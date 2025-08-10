import React, { useState, useCallback } from 'react';
import { ProcessedStoreItem } from '../../store/types';

const StoreItemCard: React.FC<{ item: ProcessedStoreItem }> = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className="store-item">
      <div className="item-image-container">
        {!imageError && item.displayIcon ? (
          <img
            src={item.displayIcon}
            alt={item.displayName}
            className="item-image"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="item-image-placeholder">
            <span>No Image</span>
          </div>
        )}
      </div>
      <div className="item-details">
        <h4 className="item-name" title={item.displayName}>
          {item.displayName}
        </h4>
        <p className="item-category">{item.category}</p>
        <div className="item-price">
          <span className="currency">VP</span>
          <span className="amount">{item.cost.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default StoreItemCard;
