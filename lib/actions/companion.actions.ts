'use server';

import {auth} from "@clerk/nextjs/server";
import {createSupabaseClient} from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { canCreateCompanion } from "./subscription.actions";
import type { CreateCompanion } from "@/types/index.d";

export const createCompanion = async (formData: CreateCompanion) => {
    const { userId: author } = await auth();
    const supabase = createSupabaseClient();

    // Map camelCase to snake_case for database
    const { teachingStyle, ...rest } = formData;
    const dbData = {
        ...rest,
        author,
        teaching_style: teachingStyle
    };

    const { data, error } = await supabase
        .from('tutors')
        .insert(dbData)
        .select();

    if(error || !data) throw new Error(error?.message || 'Failed to create a companion');

    return data[0];
}

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    try {
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

        if(error) {
            console.error('Error fetching companions:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            // Return empty array instead of throwing to prevent app crash
            return [];
        }

        // If no companions found, return empty array
        if (!companions || companions.length === 0) {
            console.log('No companions found in database');
            return [];
        }

        // If no user is logged in, return companions without bookmark status
        if (!userId) {
            return companions.map(companion => ({
                ...companion,
                teachingStyle: companion.teaching_style,
                bookmarked: false
            }));
        }

        // Get user's bookmarks separately
        const { data: userBookmarks, error: bookmarkError } = await supabase
            .from('bookmarks')
            .select('tutor_id')
            .eq('user_id', userId);

        if (bookmarkError) {
            console.log('Bookmark query error:', bookmarkError);
            // Continue without bookmarks if query fails
            return companions.map(companion => ({
                ...companion,
                teachingStyle: companion.teaching_style,
                bookmarked: false
            }));
        }

        const bookmarkedTutorIds = new Set(userBookmarks?.map(b => b.tutor_id) || []);

        // Add bookmarked property and map snake_case to camelCase
        return companions.map(companion => ({
            ...companion,
            teachingStyle: companion.teaching_style,
            bookmarked: bookmarkedTutorIds.has(companion.id)
        }));

    } catch (error) {
        console.error('Unexpected error in getAllCompanions:', error);
        return [];
    }
}

export const getCompanion = async (id: string) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('tutors')
        .select()
        .eq('id', id);

    if(error) return console.log(error);

    if (data && data[0]) {
        return {
            ...data[0],
            teachingStyle: data[0].teaching_style
        };
    }

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
    try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
            .from('session_history')
            .select(`tutors:tutor_id (*)`)
            .order('created_at', { ascending: false })
            .limit(limit)

        if(error) {
            console.error('Error fetching recent sessions:', error);
            return [];
        }

        if (!data || data.length === 0) {
            console.log('No recent sessions found');
            return [];
        }

        return data.map(({ tutors }) => ({
            ...tutors,
            teachingStyle: tutors.teaching_style
        }));
    } catch (error) {
        console.error('Unexpected error in getRecentSessions:', error);
        return [];
    }
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

    return data.map(({ tutors }) => ({
        ...tutors,
        teachingStyle: tutors.teaching_style
    }));
}

export const getUserCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('tutors')
        .select()
        .eq('author', userId)

    if(error) throw new Error(error.message);

    return data?.map(companion => ({
        ...companion,
        teachingStyle: companion.teaching_style
    })) || [];
}

export const newCompanionPermissions = async () => {
    return await canCreateCompanion();
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
    
    // Add bookmarked property and map snake_case to camelCase
    return tutors?.map(tutor => ({
      ...tutor,
      teachingStyle: tutor.teaching_style,
      bookmarked: true
    })) || [];
  } catch (error) {
    console.log('Unexpected error in getBookmarkedCompanions:', error);
    return [];
  }
};
