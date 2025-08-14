import { Routes, Route, useLocation } from "react-router-dom";

import PrivateRoute from "../modules/PrivateRoute/PrivateRoute";
import PublicRoute from "../modules/PublicRoute/PublicRoute";

import LoginPage from "../pages/LoginPage/LoginPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import VerifyPage from "../pages/VerifyPage/VerifyPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetCompletePage from "../pages/ResetCompletePage/ResetCompletePage";
import ResetPasswordPage from "../pages/ResetPasswordPage/ResetPasswordPage";

import MainPage from "../pages/MainPage/MainPage";
import ExplorePage from "../pages/ExplorePage/ExplorePage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage/EditProfilePage";
import MessagesPage from "../pages/MessagesPage/MessagesPage";

import SinglePost from "./SinglePost/SinglePost";
import CreatePostModal from "./CreatePostModal/CreatePostModal";

import PrivacyPolicy from "../pages/TermsAndCookies/PrivacyPolicy/PrivacyPolicy";
import CookiesPolicy from "../pages/TermsAndCookies/CookiesPolicy/CookiesPolicy";
import TermsOfService from "../pages/TermsAndCookies/TermsOfService/TermsOfService";

import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

const Navigation = () => {
  const location = useLocation();
  const state = location.state as { background?: Location };
  return (
    <>
      <Routes location={state?.background || location}>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/forgot-password/complete"
            element={<ResetCompletePage />}
          />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies-policy" element={<CookiesPolicy />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<MainPage />} />
          <Route path="/users/:username" element={<ProfilePage />} />
          <Route
            path="/users/:username/edit-my-profile"
            element={<EditProfilePage />}
          />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/messages" element={<MessagesPage />} />

          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {state?.background && (
        <Routes>
          <Route path="/posts/:postId" element={<SinglePost />} />
          <Route path="/create-new-post" element={<CreatePostModal />} />
        </Routes>
      )}
    </>
  );
};

export default Navigation;
