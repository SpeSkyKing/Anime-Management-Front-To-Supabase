import { useState,useEffect } from "react";
import { IViewedAnime } from "../data/interface";
import { AnimeViewedListItem } from "./animeViewedListItem";
import { supabase } from '../../../lib/supabaseClient';
const AnimeViewedEntry = () => {
  const [viewedAnime,SetViewedAnime] = useState<IViewedAnime[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const getViewedAnime = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('viewed_anime')
        .select(`
          *,
          anime!inner(*)
        `)
        .eq('anime.user_id', user.id);
        
      if (error) throw error;
      
      const formattedData: IViewedAnime[] = data.map((item: { id: number; anime_id: number; viewed_end_date: string; anime: { id: number; user_id: string; anime_name: string; episode: number; favoritecharacter: string; speed: boolean } }) => ({
        id: item.id,
        anime_id: item.anime_id,
        viewed_end_date: item.viewed_end_date,
        anime: {
          id: item.anime.id,
          user_id: item.anime.user_id,
          anime_name: item.anime.anime_name,
          episode: item.anime.episode,
          favoritecharacter: item.anime.favoritecharacter,
          speed: item.anime.speed,
        },
      }));
      SetViewedAnime(formattedData);
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("エラーが発生しました。");
    }
  }

    useEffect(()=>{
      if (user) {
        getViewedAnime();
      }
    }, [user, getViewedAnime])

    const watchingAgainAnime = async (animeId : number) => {
      try {
        // viewed_animeから削除
        const { error: deleteError } = await supabase
          .from('viewed_anime')
          .delete()
          .eq('anime_id', animeId);
          
        if (deleteError) throw deleteError;
        
        // past_animeに追加
        const { error: insertError } = await supabase
          .from('past_anime')
          .insert({
            anime_id: animeId,
            watching_start_date: new Date().toISOString()
          });
          
        if (insertError) throw insertError;
        getViewedAnime();
      } catch (error) {
        console.error("エラーが発生しました:", error);
        alert("再視聴に失敗しました。");
      }
    }

    const watchingAgain = (iViewedAnime:IViewedAnime) => {
      watchingAgainAnime(iViewedAnime.anime.id);
    }

  return (
    <div className="flex justify-center p-8 bg-gray-100 bg-opacity-50 min-h-full min-w-full">
      <div className="h-full w-full overflow-x-auto flex justify-start">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left font-medium text-gray-700 text-center">アニメ名</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 text-center">視聴終了日</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 text-center">推しキャラ</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 text-center">再視聴</th> 
            </tr>
          </thead>
          <tbody>
            {viewedAnime.map((viewedAnimedata,index) => (
                <AnimeViewedListItem key={index} viewedAnime={viewedAnimedata} onReturn={watchingAgain}/>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnimeViewedEntry;
