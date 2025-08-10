import React from 'react';
import { ProcessedStoreItem } from '../../store/types';
import StoreItemCard from './StoreItemCard';
import StorePlaceholder from './StorePlaceholder';

interface Props {
  items: ProcessedStoreItem[];
}

const StoreItems: React.FC<Props> = ({ items }) => (
  <div className="store-grid">
    {items.length > 0 ? (
      items.map((item, index) => (
        <StoreItemCard key={item.uuid || index} item={item} />
      ))
    ) : (
      Array.from({ length: 4 }, (_, index) => (
        <StorePlaceholder key={index} />
      ))
    )}
  </div>
);

export default StoreItems;
