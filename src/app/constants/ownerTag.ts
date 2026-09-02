import { useAuth } from '../contexts/authContext';
import { useUserData } from '../contexts/userDataContext';

type PageOwnerData = {
  user_id?: string | null;
  users?: {
    id?: string | null;
  } | null;
};

export const usePageDataOwner = (pageData: PageOwnerData | null | undefined) => {
  const { session } = useAuth();
  const { currentUser } = useUserData();
  const pageOwnerId = pageData?.user_id ?? pageData?.users?.id;

  return Boolean(
    pageOwnerId &&
    currentUser?.id === pageOwnerId &&
    currentUser.auth_id === session?.user?.id
  );
};
