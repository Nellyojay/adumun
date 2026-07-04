import { createContext, useCallback, useContext, useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { useUserData } from "./userDataContext";
import { cloudinaryDelete, extractPublicIdFromUrl, getCloudinaryConfig } from "../constants/cloudinaryFileAPI";


export type Post = {
  id: number;
  image_url: string;
  content: string;
  created_at: string;
  likes: number;
  saves: number;
  comments: number;
  user_id: string;
  mentorship_post_heading: string;
  startups?: {
    id: string;
    display_image: string;
    name: string;
    cartegory: string;
  } | null;
  mentorship_id: string;
  mentorship_page?: {
    id: string;
    image_url: string;
    topic: string;
    category: string;
  } | null
}

export type StartupData = {
  id: string;
  created_at: string;
  cover_image: string;
  display_image: string;
  address: string;
  address_details: string;
  cartegory: string;
  description: string;
  email: string;
  founder_name: string;
  intro_description: string;
  likes: number;
  opinions: number;
  followers: number;
  name: string;
  phone: string;
  products_and_services: [string];
  user_id: string;
  website: string;
  founded_in: string;
  x_username: string;
  favorite_count: number;
}

type StartupContextType = {
  startupData: StartupData[] | null;
  startupLoading: boolean;
  loadingPosts: boolean;
  posts: Post[];
  fetchStartupPosts: () => void;
  handleDeletePost: (postId: number) => void;
  getStartupData: () => void;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setLoadingPosts: React.Dispatch<React.SetStateAction<boolean>>
};

const StartupContext = createContext<StartupContextType | null>(null);

export const StartupProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useUserData();
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [startupLoading, setStartupLoading] = useState(false);
  const [startupData, setStartupData] = useState<StartupData[] | null>([]);

  const getStartupData = useCallback(async () => {
    setStartupLoading(true)
    const { data, error } = await supabase
      .from("startups")
      .select("*");

    if (error) {
      setStartupLoading(false);
      return;
    } else {
      setStartupData(data);
    }
    setStartupLoading(false);

  }, [currentUser]);

  const fetchStartupPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, startups(id, display_image, name, cartegory), mentorship_page(id, topic, image_url)')
      .order('created_at', { ascending: false });

    setLoadingPosts(false);
    if (!error && data) {
      setPosts(data as any[]);
    }
  };

  // DELETE POST FUNCTION
  const handleDeletePost = async (postId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    const { data } = await supabase
      .from('posts')
      .select('image_url')
      .eq('id', postId)
      .single();

    if (data && data.image_url) {
      const publicId = extractPublicIdFromUrl(data.image_url);
      if (publicId) {
        const config = getCloudinaryConfig();
        const deleteResult = await cloudinaryDelete(publicId, config.API_KEY, config.API_SECRET);

        if (!deleteResult) {
          alert("Failed to delete image from cloud storage.");
          return;
        }
      }
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      alert("Failed to delete post. Please try again.");
    } else {
      alert("Post deleted successfully.");
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    }
  };

  useEffect(() => {
    getStartupData();

    const channel = supabase
      .channel('realtime-startups')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'startups' },
        (payload) => {
          setStartupData((prevState) => {
            if (!prevState) return prevState;

            const record = payload.new || payload.old;
            if (!record) return prevState;

            switch (payload.eventType) {
              case 'INSERT':
                return [...prevState, record as StartupData];
              case 'UPDATE':
                return prevState.map((item) =>
                  item.id === (record as StartupData).id ? (record as StartupData) : item
                );
              case 'DELETE':
                return prevState.filter((item) => item.id !== (record as StartupData).id);
              default:
                return prevState;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [getStartupData, currentUser]);

  return (
    <StartupContext.Provider value={{ startupData, startupLoading, loadingPosts, posts, getStartupData, setLoadingPosts, setPosts, fetchStartupPosts, handleDeletePost }}>
      {children}
    </StartupContext.Provider>
  );
};

export const useStartup = () => {
  const context = useContext(StartupContext);
  if (!context) {
    throw new Error("useStartup must be used within a StartupProvider");
  }
  return context;
};