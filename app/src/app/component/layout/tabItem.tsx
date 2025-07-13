import React from 'react';
import { TabItemProps } from '../data/props';

const TabItem: React.FC<TabItemProps> = ({ onClick, content }) => {
  const onChange = () => {
    onClick(content);
  };

  return (
    <li
      className="flex-1 text-center cursor-pointer transition-all duration-300"
      onClick={onChange}
    >
      <a
        className="block w-full px-6 py-3 text-xl font-medium text-gray-600 hover:text-pink-600 hover:border-pink-500 transition-all"
      >
        {content.contentName}
      </a>
    </li>
  );
};

export default TabItem;
