"use client";

import { useState , useEffect } from "react";
import Content from "./component/layout/content";
import LoginEntry  from "./component/login/loginEntry";
import Tab from "./component/layout/tab";
import { IContent } from "./component/data/interface";
import { ContentArray } from "./component/data/content";
import { supabase } from "../lib/supabaseClient";
  
export default function Home() {
  const tabContent: Array<IContent> = ContentArray;
  const [selectContent, setSelectContent] = useState<IContent>({content:"title",contentName:"タイトル"});
  const [beforeLogin,isBeforeLogin] = useState<boolean>(true);
  const [token,setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setToken(session.access_token);
        isBeforeLogin(false);
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setToken(session.access_token);
        isBeforeLogin(false);
      } else {
        setToken("");
        isBeforeLogin(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() =>{
      if(token){
        isBeforeLogin(false);
      }
  },[token])

  const onTabClick = (content: IContent) => {
    setSelectContent(content);
  };

  const onLogin = (_token:string) => {
    setToken(_token);
    isBeforeLogin(false);
  }

  if(loading){
    return <div className="flex justify-center items-center h-screen">読み込み中...</div>;
  }

  if(beforeLogin){
    return (<LoginEntry onLogin={onLogin}></LoginEntry>)
  }

  return (
  <div className="flex flex-col h-screen bg-gradient-to-br from-green-400 via-teal-300 to-blue-500 !bg-none">
    <div className="tab-container flex justify-around items-center h-1/8 bg-green-300 shadow-lg rounded-b-lg invert">
      <Tab tabContent={tabContent} onReturn={onTabClick} />
    </div>
    <div className="content-container flex justify-center items-center h-full bg-gradient-to-br from-green-400 via-teal-300 to-blue-500 text-white p-6 rounded-t-lg shadow-lg">
        <Content content={selectContent.content} />
    </div>
  </div>

  );
}
