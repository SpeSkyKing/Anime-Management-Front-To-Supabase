import { useState,useEffect } from "react";
import { IPastAnime } from "../data/interface";
import { AnimePastListItem } from "./animePastListItem";
import { supabase } from '../../../lib/supabaseClient';
const AnimePastEntry = () => {
  const [pastAnime,setPastAnime] = useState<IPastAnime[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);
  
    const getPastAnime = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('past_anime')
          .select(`
            *,
            anime!inner(*)
          `)
          .eq('anime.user_id', user.id)
          .order('anime(episode)', { ascending: false })
          .order('anime(anime_name)', { ascending: true });
          
        if (error) throw error;
        
        const formattedData: IPastAnime[] = data.map((item: { id: number; anime_id: number; watching_start_date: string; anime: { id: number; user_id: string; anime_name: string; episode: number; favoritecharacter: string; speed: boolean } }) => ({
          id: item.id,
          anime_id: item.anime_id,
          watching_start_date: item.watching_start_date,
          anime: {
            id: item.anime.id,
            user_id: item.anime.user_id,
            anime_name: item.anime.anime_name,
            episode: item.anime.episode,
            favoritecharacter: item.anime.favoritecharacter,
            speed: item.anime.speed,
          },
        }));
        setPastAnime(formattedData);
      } catch (error) {
        console.error("エラーが発生しました:", error);
        alert("エラーが発生しました。");
      }
    }
  
    const pastAnimeEpisodeUp = async (animeId : number) => {
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
        getPastAnime();
      } catch (error) {
        console.error("エラーが発生しました:", error);
        alert("話数カウントに失敗しました。");
      }
    }

    const pastAnimeFinishWatching = async (animeId : number) => {
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
        
        // past_animeから削除
        const { error: deleteError } = await supabase
          .from('past_anime')
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
        getPastAnime();
      } catch (error) {
        console.error("エラーが発生しました:", error);
        alert("視聴終了に失敗しました。");
      }
    }
  
    const handleEpisodeUp = (iPastAnime:IPastAnime) =>{
      pastAnimeEpisodeUp(iPastAnime.anime_id);
    }

    const handleFinishWatching = async (iPastAnime:IPastAnime) => {
      pastAnimeFinishWatching(iPastAnime.anime_id);
    }
  
    useEffect(() => {
      if (user) {
        getPastAnime();
      }
    }, [user])
  return (
    <div className="flex justify-center p-2 bg-gray-100 bg-opacity-50 min-h-full min-w-full">
      <div className="h-[calc(100vh-6rem)] w-full overflow-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="bg-gray-100">
              <th className="px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center">タイトル</th>
              <th className="px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center">視聴開始日</th>
              <th className="px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center">話数</th>
              <th className="px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
          {pastAnime.map((pastAnimedata,index) => (
             <AnimePastListItem key={index} pastAnime={pastAnimedata} onclick={handleEpisodeUp} onFinish={handleFinishWatching}/>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnimePastEntry;