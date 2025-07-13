import React from 'react';
import { TabProps } from '../data/props';
import { IContent } from '../data/interface';
import TabItem from './tabItem';

const Tab: React.FC<TabProps> = ({ tabContent, onReturn }) => {
  const onTabClick = (content: IContent) => {
    onReturn(content);
  };

  return (
    <div className="w-full shadow-md border-b-2">
      <ul className="flex w-full">
        {tabContent.map((content: IContent, index: number) => (
          <TabItem key={index} onClick={onTabClick} content={content} />
        ))}
      </ul>
    </div>
  );
};

export default Tab;
