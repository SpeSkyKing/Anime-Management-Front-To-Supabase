import { supabase } from '../supabaseClient';
import { IAnimeWatchHistory } from '../../app/component/data/interface';

export const addWatchHistory = async (
  animeId: number,
  userId: string,
  episode: number
): Promise<IAnimeWatchHistory | null> => {
  try {
    const { data, error } = await supabase
      .from('anime_watch_history')
      .insert({
        anime_id: animeId,
        user_id: userId,
        episode: episode
      })
      .select()
      .single();

    if (error) {
      console.error('視聴履歴の追加に失敗しました:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('視聴履歴の追加でエラーが発生しました:', error);
    return null;
  }
};

export const getWatchHistoryByDate = async (
  userId: string,
  date: string
): Promise<any[]> => {
  try {
    const startDate = `${date}T00:00:00.000Z`;
    const endDate = `${date}T23:59:59.999Z`;

    const { data, error } = await supabase
      .from('anime_watch_history')
      .select(`
        *,
        anime!inner(anime_name)
      `)
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('視聴履歴の取得に失敗しました:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('視聴履歴の取得でエラーが発生しました:', error);
    return [];
  }
};

export const getWatchHistory = async (
  userId: string,
  animeId?: number
): Promise<IAnimeWatchHistory[]> => {
  try {
    let query = supabase
      .from('anime_watch_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (animeId) {
      query = query.eq('anime_id', animeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('視聴履歴の取得に失敗しました:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('視聴履歴の取得でエラーが発生しました:', error);
    return [];
  }
};