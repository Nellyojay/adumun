import { createHashRouter } from "react-router";
import { Landing } from "./pages/Landing";
import { Feed } from "./pages/Feed";
import { StartupProfile } from "./pages/StartupProfile";
import { CreateStartup } from "./pages/CreateStartup";
import { UserProfile } from "./pages/UserProfile";
import { AddPost } from "./pages/AddPost";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/auth/login";
import { Signup } from "./pages/auth/signup";
import { ForgotPassword } from "./pages/ForgotPassword";
import { EditStartup } from "./pages/EditStartup";
import { EditProfile } from "./pages/EditProfile";
import { Feedback } from "./pages/Feedback";
import { FollowingStartups } from "./pages/FollowingStartups";
import { Settings } from "./pages/Settings";
import { HelpCenter } from "./pages/HelpCenter";
import TC_agree from "./pages/TC_agree";
import PostFeed from "./pages/PostFeed";
import MentorshipPage from "./pages/MentorshipPage";
import CreateMentorship from "./pages/CreateMentorship";
import EditMentorship from "./pages/EditMentorshipPage";
import { Catalogue } from "./pages/Catalogue";
import ShowProductDetail from "./pages/ShowProductDetail";
import { ManageAccount } from "./pages/ManageAccount";
import { ChangePassword } from "./pages/ChangePassword";
import { RecoverAccount } from "./pages/RecoverAccount";
import { ResetPassword } from "./pages/ResetPassword";

export const router = createHashRouter([
  {
    path: "/",
    Component: PostFeed,
  },
  {
    path: "/about",
    Component: Landing,
  },
  {
    path: "/TC_agree",
    Component: TC_agree,
  },
  {
    path: "/feed",
    Component: Feed,
  },
  {
    path: "/feedback",
    Component: Feedback,
  },
  {
    path: "/following",
    Component: FollowingStartups,
  },
  {
    path: "/startup/:id",
    Component: StartupProfile,
  },
  {
    path: "/startup/:id/edit",
    Component: EditStartup,
  },
  {
    path: "/startup/:id/add-post",
    Component: AddPost,
  },
  {
    path: "/mentorship-page/:id/add-post",
    Component: AddPost,
  },
  {
    path: "/create",
    Component: CreateStartup,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/profile/:id",
    Component: UserProfile,
  },
  {
    path: "/profile/:id/edit",
    Component: EditProfile,
  },
  {
    path: "/mentorship-page/:id",
    Component: MentorshipPage,
  },
  {
    path: "/mentorship-page/create",
    Component: CreateMentorship,
  },
  {
    path: "/mentorship-page/:id/edit",
    Component: EditMentorship,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/help-center",
    Component: HelpCenter,
  },
  {
    path: "/catalogue",
    Component: Catalogue,
  },
  {
    path: "/catalogue/:id",
    Component: ShowProductDetail,
  },
  {
    path: "/change-password",
    Component: ChangePassword,
  },
  {
    path: "/reset-password",
    Component: ResetPassword,
  },
  {
    path: "/manage-account",
    Component: ManageAccount,
  },
  {
    path: "/recover-account",
    Component: RecoverAccount,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);