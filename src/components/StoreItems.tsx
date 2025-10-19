import React from 'react';
import { ProcessedStoreItem } from '../types/storeTypes';
import StoreItemCard from './StoreItemCard';
import StorePlaceholder from './StorePlaceholder';

interface Props {
  items: ProcessedStoreItem[];
}

const StoreItems: React.FC<Props> = ({ items }) => (
  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
