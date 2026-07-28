import { createContext, useCallback, useContext, useEffect, useState } from "react";
import supabase from "../supabaseClient";

export const BUSINESS_PERSONNEL_ROLE = 'business personnel';
export const INVESTOR_ROLE = 'investor';
export const CUSTOMER_ROLE = 'customer';
export const MENTOR_ROLE = 'mentor';
export const ADMIN_ROLE = 'admin';

export type userData = {
  id: string;
  auth_id: string;
  full_name: string;
  created_at: string;
  user_name: string;
  user_name_updated_at?: string | null;
  bio: string;
  following: number;
  profile_image: string;
  TC_agreed: boolean;
  favorites: number;
  user_roles: string[];
  is_active: boolean;
  deleted_at: string;
}

type UserDataContextType = {
  userData: userData | null;
  selectedProfile: string | null;
  setSelectedProfile: any;
  loadingUserData: boolean;
  currentUser: userData | null;
  isBusinessPersonnel: boolean;
  isInvestor: boolean;
  isCustomer: boolean;
  isMentor: boolean;
  isAdmin: boolean;
  agreeToTC: () => Promise<boolean>;
};

const UserDataContext = createContext<UserDataContextType | null>(null);

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<userData | null>(null);
  const [currentUser, setCurrentUser] = useState<userData | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);

  const isBusinessPersonnel = Boolean(currentUser?.user_roles.includes(BUSINESS_PERSONNEL_ROLE));
  const isInvestor = Boolean(currentUser?.user_roles.includes(INVESTOR_ROLE));
  const isCustomer = Boolean(currentUser?.user_roles.includes(CUSTOMER_ROLE));
  const isMentor = Boolean(currentUser?.user_roles.includes(MENTOR_ROLE));
  const isAdmin = Boolean(currentUser?.user_roles.includes(ADMIN_ROLE));

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user

        if (!user) return;

        fetchCurrentUser(user.id)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const agreeToTC = async (): Promise<boolean> => {
    if (!currentUser?.id) return false;

    const { data, error } = await supabase
      .from('users')
      .update({ TC_agreed: true })
      .eq('id', currentUser.id)
      .select('*')
      .single();

    if (error || !data) {
      return false;
    }

    setCurrentUser(data);

    if (selectedProfile === data.id) {
      setUserData(data);
    }

    return Boolean(data.TC_agreed);
  };

  const fetchUserData = useCallback(async () => {
    if (!selectedProfile) {
      setUserData(null);
      return;
    }

    setLoadingUserData(true);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', selectedProfile)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user data:', error.message);
      setUserData(null);
    }

    if (data) {
      setUserData(data);
    }
    setLoadingUserData(false);
  }, [selectedProfile])

  const fetchCurrentUser = async (userId: string) => {
    setLoadingUserData(true);

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', userId)
      .single();

    if (data) {
      setCurrentUser(data);
    }
    setLoadingUserData(false);
  }

  useEffect(() => {
    if (selectedProfile) {
      fetchUserData();
    } else {
      setUserData(null);
    }
  }, [selectedProfile]);

  useEffect(() => {
    if (!selectedProfile) return;

    const channel = supabase
      .channel('public:users')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${selectedProfile}` },
        (payload) => {
          if (payload.new) {
            setUserData(prev => prev && prev.id === payload.new.id ? payload.new as userData : prev);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, [selectedProfile, setSelectedProfile, fetchUserData]);

  return (
    <UserDataContext.Provider value={{
      userData,
      loadingUserData,
      selectedProfile,
      setSelectedProfile,
      currentUser,
      isBusinessPersonnel,
      isInvestor,
      isCustomer,
      isMentor,
      isAdmin,
      agreeToTC
    }}>
      {children}
    </UserDataContext.Provider>
  );
}

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }

  return context;
};