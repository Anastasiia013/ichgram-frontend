import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DropdownPanel from "../../layouts/DropdownPanel/DropdownPanel";
import { searchUsers } from "../../shared/api/profile-api";
import styles from "./Search.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  _id: string;
  username: string;
  fullname: string;
  avatarUrl?: string;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Search: React.FC<Props> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [recentSearches, setRecentSearches] = useState<User[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const data = await searchUsers(query);
        setResults(data);
      } catch (err) {
        console.error("Ошибка при поиске:", err);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  const handleUserClick = (user: User) => {
    navigate(`/users/${user.username}`);
    onClose();

    setRecentSearches((prev) => {
      const exists = prev.find((u) => u._id === user._id);
      if (exists) {
        return [user, ...prev.filter((u) => u._id !== user._id)];
      }
      return [user, ...prev.slice(0, 4)]; // максимум 5 записей
    });
  };

  const displayedList = query.trim() ? results : recentSearches;

  return (
    <DropdownPanel isOpen={isOpen} onClose={onClose} title="Search">
      <input
        type="text"
        placeholder="Search"
        className={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {displayedList.length > 0 && (
        <>
          {!query.trim() && <p className={styles.subheading}>Recent</p>}

          <ul className={styles.list}>
            {displayedList.map((user) => (
              <li
                key={user._id}
                className={styles.item}
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={
                    user.avatarUrl && user.avatarUrl.trim() !== ""
                      ? user.avatarUrl.startsWith("/uploads")
                        ? backendUrl + user.avatarUrl
                        : user.avatarUrl
                      : "/no-profile-pic-icon-11.jpg"
                  }
                  alt={`${user.username} avatar`}
                  className={styles.avatar}
                />
                <div className={styles.userInfo}>
                  <p>{user.username}</p>
                  <span className={styles.fullname}>{user.fullname}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </DropdownPanel>
  );
};

export default Search;
