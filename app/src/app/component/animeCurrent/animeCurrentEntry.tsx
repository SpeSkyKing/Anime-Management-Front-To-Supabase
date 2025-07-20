import { useState,useEffect } from "react";
import { ICurrentAnime } from "../data/interface";
import { AnimeCurrentListItem } from "./animeCurrentListItem";
import { supabase } from '../../../lib/supabaseClient';
const AnimeCurrentEntry = () => {

  const [currentAnime,SetCurrentAnime] = useState<ICurrentAnime[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const dayOfWeek = currentDateTime.toLocaleString('ja-JP', { weekday: 'long' });
  const dateString = currentDateTime.toLocaleDateString('ja-JP');
  const timeString = currentDateTime.toLocaleTimeString('ja-JP');

  const getCurrentAnime = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('current_anime')
        .select(`
          *,
          anime!inner(*)
        `)
        .eq('anime.user_id', user.id)
        .order('delivery_weekday', { ascending: true })
        .order('delivery_time', { ascending: true });
        
      if (error) throw error;
      
      const formattedData: ICurrentAnime[] = data.map((item: { id: number; anime_id: number; year: number; season: string; releasedate: string; delivery_weekday: string; delivery_time: string; anime: { id: number; user_id: string; anime_name: string; episode: number; favoritecharacter: string; speed: boolean } }) => ({
        id: item.id,
        anime_id: item.anime_id,
        year: item.year,
        season: item.season as '1' | '2' | '3' | '4',
        releasedate: item.releasedate,
        delivery_weekday: item.delivery_weekday as '1' | '2' | '3' | '4' | '5' | '6' | '7',
        delivery_time: item.delivery_time,
        anime: {
          id: item.anime.id,
          user_id: item.anime.user_id,
          anime_name: item.anime.anime_name,
          episode: item.anime.episode,
          favoritecharacter: item.anime.favoritecharacter,
          speed: item.anime.speed,
        },
      }));
      SetCurrentAnime(formattedData);
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("エラーが発生しました。");
    }
  }

  const currentAnimeEpisodeUp = async (animeId : number) => {
    try {
      const { data: currentData, error: fetchError } = await supabase
        .from('anime')
        .select('episode')
        .eq('anime_id', animeId)
        .single();
        
      if (fetchError) throw fetchError;
      
      const { error } = await supabase
        .from('anime')
        .update({ episode: currentData.episode + 1 })
        .eq('anime_id', animeId);
        
      if (error) throw error;
      getCurrentAnime();
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("話数カウントに失敗しました。");
    }
  }

  const currentAnimeFinishWatching = async (animeId : number) => {
    try {
      // animeテーブルからview_countを取得して加算
      const { data: animeData, error: fetchError } = await supabase
        .from('anime')
        .select('view_count')
        .eq('anime_id', animeId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // view_countを更新、episodeを0にリセット
      const currentCount = animeData.view_count || 0;
      const { error: updateError } = await supabase
        .from('anime')
        .update({ 
          view_count: currentCount + 1,
          episode: 0
        })
        .eq('anime_id', animeId);
        
      if (updateError) throw updateError;
      
      // current_animeから削除
      const { error: deleteError } = await supabase
        .from('current_anime')
        .delete()
        .eq('anime_id', animeId);
        
      if (deleteError) throw deleteError;
      
      // viewed_animeに追加
      const { error: insertError } = await supabase
        .from('viewed_anime')
        .insert({
          anime_id: animeId,
          user_id: user?.id,
          viewed_end_date: new Date().toISOString()
        });
        
      if (insertError) throw insertError;
      getCurrentAnime();
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("視聴終了に失敗しました。");
    }
  }

  const handleEpisodeUp = (iCurrentAnime:ICurrentAnime) =>{
    currentAnimeEpisodeUp(iCurrentAnime.anime_id);
  }

  const handleFinishWatching = async (iCurrentAnime:ICurrentAnime) => {
    currentAnimeFinishWatching(iCurrentAnime.anime_id);
  }

  useEffect(() => {
    if (user) {
      getCurrentAnime();
    }
  }, [user])

  return (
    <div className="block justify-center p-2 bg-gray-100 bg-opacity-50 min-h-full min-w-full">
      <div className="flex flex-row items-center justify-center space-x-4 my-1">
        <div className="text-sm md:text-xl text-gray-800 font-semibold mt-2">{dayOfWeek}</div>
        <div className="text-sm md:text-xl text-indigo-600 font-bold mt-2">{dateString}</div>
        <div className="text-sm md:text-xl text-gray-600 mt-2">{timeString}</div>
      </div>
      <div className="h-[calc(100vh-8rem)] w-full overflow-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="bg-gray-100">
              <th className="px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center whitespace-nowrap">タイトル</th>
              {/* <th className="px-1 py-1 text-xs font-medium text-gray-700 text-center whitespace-nowrap">配信開始日</th> */}
              <th className="px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center whitespace-nowrap">曜日</th>
              <th className="px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center whitespace-nowrap">配信</th>
              <th className="px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center whitespace-nowrap">話数</th>
              <th className="px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {currentAnime.map((currentAnimedata, index) => (
              <AnimeCurrentListItem key={index} currentAnime={currentAnimedata} onclick={handleEpisodeUp} onFinish={handleFinishWatching}/>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnimeCurrentEntry;