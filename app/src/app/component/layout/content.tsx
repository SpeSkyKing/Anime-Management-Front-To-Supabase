import { useState,useEffect } from 'react';
import AnimeRegistEntry from '../animeRegist/animeRegistEntry';
import AnimeCurrentEntry from '../animeCurrent/animeCurrentEntry';
import AnimePastEntry from '../animePast/animePastEntry';
import AnimeViewedEntry from '../animeViewed/animeViewedEntry';
import TitleEntry from '../title/titleEntry';
import WatchHistoryEntry from '../title/watchHistoryEntry';

const Content = ({ content }: { content: string }) => {

    const [Content,setContent] = useState<string>(content);

    const contentChange = ( contentName: string ) => {
        setContent(contentName);
    }

    useEffect(()=>
        setContent(content)
    ,[content])

    switch(Content){
        case 'title':
            return (
                <TitleEntry onClick={contentChange}></TitleEntry>
            );
        case 'regist':
            return (
                <AnimeRegistEntry></AnimeRegistEntry>
            );
        case 'current':
            return (
                <AnimeCurrentEntry></AnimeCurrentEntry>
            );
        case 'past':
            return (
                <AnimePastEntry></AnimePastEntry>
            );
        case 'viewed':
            return (
                <AnimeViewedEntry></AnimeViewedEntry>
            );
        case 'history':
            return (
                <WatchHistoryEntry></WatchHistoryEntry>
            );
    }
  }
  export default Content;
  