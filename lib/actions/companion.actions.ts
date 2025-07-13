'use server';

import {auth} from "@clerk/nextjs/server";
import {createSupabaseClient} from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const createCompanion = async (formData: CreateCompanion) => {
    const { userId: author } = await auth();
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('tutors')
        .insert({...formData, author })
        .select();

    if(error || !data) throw new Error(error?.message || 'Failed to create a companion');

    return data[0];
}

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    const supabase = createSupabaseClient();
    const { userId } = await auth();

    let query = supabase.from('tutors').select('*');

    if(subject && topic) {
        query = query.ilike('subject', `%${subject}%`)
            .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    } else if(subject) {
        query = query.ilike('subject', `%${subject}%`)
    } else if(topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companions, error } = await query;

    if(error) throw new Error(error.message);

    // If no user is logged in, return companions without bookmark status
    if (!userId) {
        return companions?.map(companion => ({
            ...companion,
            bookmarked: false
        })) || [];
    }

    // Get user's bookmarks separately
    const { data: userBookmarks } = await supabase
        .from('bookmarks')
        .select('tutor_id')
        .eq('user_id', userId);

    const bookmarkedTutorIds = new Set(userBookmarks?.map(b => b.tutor_id) || []);

    // Add bookmarked property based on whether user has bookmarked this companion
    return companions?.map(companion => ({
        ...companion,
        bookmarked: bookmarkedTutorIds.has(companion.id)
    })) || [];
}

export const getCompanion = async (id: string) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('tutors')
        .select()
        .eq('id', id);

    if(error) return console.log(error);

    return data[0];
}

export const addToSessionHistory = async (tutorId: string) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('session_history')
        .insert({
            tutor_id: tutorId,
            user_id: userId,
        })

    if(error) throw new Error(error.message);

    return data;
}

export const getRecentSessions = async (limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`tutors:tutor_id (*)`)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ tutors }) => tutors);
}

export const getUserSessions = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`tutors:tutor_id (*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ tutors }) => tutors);
}

export const getUserCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('tutors')
        .select()
        .eq('author', userId)

    if(error) throw new Error(error.message);

    return data;
}

export const newCompanionPermissions = async () => {
    const { userId, has } = await auth();
    const supabase = createSupabaseClient();

    let limit = 0;

    if(has({ plan: 'pro' })) {
        return true;
    } else if(has({ feature: "3_companion_limit" })) {
        limit = 3;
    } else if(has({ feature: "10_companion_limit" })) {
        limit = 10;
    }

    const { data, error } = await supabase
        .from('tutors')
        .select('id', { count: 'exact' })
        .eq('author', userId)

    if(error) throw new Error(error.message);

    const companionCount = data?.length;

    if(companionCount >= limit) {
        return false
    } else {
        return true;
    }
}

// Bookmarks
export const addBookmark = async (tutorId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error('User not authenticated');
  
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("bookmarks").insert({
    tutor_id: tutorId,
    user_id: userId,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Revalidate the path to force a re-render of the page
  revalidatePath(path);
  return data;
};

export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error('User not authenticated');
  
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("tutor_id", companionId)
    .eq("user_id", userId);
    
  if (error) {
    throw new Error(error.message);
  }
  
  revalidatePath(path);
  return data;
};

// It's almost the same as getUserCompanions, but it's for the bookmarked companions
export const getBookmarkedCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  
  // If no userId provided, return empty array
  if (!userId) {
    return [];
  }
  
  try {
    // First get the bookmark entries for this user
    const { data: bookmarks, error: bookmarksError } = await supabase
      .from("bookmarks")
      .select("tutor_id")
      .eq("user_id", userId);
      
    if (bookmarksError) {
      console.log('Bookmarks query error:', bookmarksError);
      // Return empty array instead of throwing error to prevent page crash
      return [];
    }
    
    // If no bookmarks, return empty array
    if (!bookmarks || bookmarks.length === 0) {
      return [];
    }
    
    // Get the actual tutor data for bookmarked tutors
    const tutorIds = bookmarks.map(b => b.tutor_id);
    const { data: tutors, error: tutorsError } = await supabase
      .from("tutors")
      .select("*")
      .in("id", tutorIds);
      
    if (tutorsError) {
      console.log('Tutors query error:', tutorsError);
      return [];
    }
    
    // Add bookmarked property (always true for bookmarked companions)
    return tutors?.map(tutor => ({
      ...tutor,
      bookmarked: true
    })) || [];
  } catch (error) {
    console.log('Unexpected error in getBookmarkedCompanions:', error);
    return [];
  }
};
