import { View } from 'react-native';
import { memo } from 'react';

interface Props {
  isActive: boolean;
}

function PaginationDot({ isActive }: Props) {
  return (
    <View
      className={`h-2 mx-1 rounded-full ${
        isActive ? 'w-6 bg-primary' : 'w-2 bg-gray-300'
      }`}
    />
  );
}

export default memo(PaginationDot); 