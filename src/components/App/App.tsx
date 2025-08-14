import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../redux/store";

import { selectToken } from "../../redux/auth/auth-selectors";
import { logout, getCurrent } from "../../redux/auth/auth-thunks";

import Navigation from "../Navigation";
import Footer from "../Footer/Footer";
import Sidebar from "../SidebarMenu/SidebarMenu";
import NotificationsPanel from "../NotificationsPanel/NotificationsPanel";
import Search from "../Search/Search";

import { setAuthHeader } from "../../shared/api/setAuthHeader";

import "../../styles/reset.css";
import "../../styles/variables.css";
import "../../styles/common.css";

import styles from "./App.module.css";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [openPanel, setOpenPanel] = useState<
    "notifications" | "search" | null
  >(null);

  const togglePanel = (panel: "notifications" | "search" ) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  useEffect(() => {
    if (!token) return;

    setAuthHeader(token);

    dispatch(getCurrent())
      .unwrap()
      .catch((err) => {
        if (
          err === "jwt expired" ||
          err === "Unauthorized" ||
          (typeof err === "string" && err.includes("401"))
        ) {
          dispatch(logout());
          navigate("/login");
        }
      });
  }, [token, dispatch, navigate]);

  return (
    <>
      {token && (
        <div className={styles.appLayout}>
          <Sidebar
            onToggleNotifications={() => togglePanel("notifications")}
            onToggleSearch={() => togglePanel("search")}
            onClosePanels={() => setOpenPanel(null)}
            activePanel={openPanel}
          />

          <NotificationsPanel
            isOpen={openPanel === "notifications"}
            onClose={() => setOpenPanel(null)}
            token={token}
          />

          <Search
            isOpen={openPanel === "search"}
            onClose={() => setOpenPanel(null)}
          />

          <div className={styles.mainContent}>
            <Navigation />
          </div>
        </div>
      )}

      {!token && <Navigation />}
      {token && <Footer />}
    </>
  );
}

export default App;
