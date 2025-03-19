// FetchUser.jsx
import { useContext, useState } from "react";
import { MainContext } from "../providers/MainContext";
import { useNavigate } from "react-router-dom";

const FetchUser = () => {
  const { filteredUsers, search, setSearch } = useContext(MainContext);

  const [_, setClickedUser] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);

  const navigate = useNavigate();

  const handleUserClick = (user) => {
    setClickedUser(user);
    navigate(`/user/${user._id}`, { state: { clickedUser: user } });
    setActiveUserId(user._id);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Input */}
      <div className="mb-6 relative">
        <input
          type="text"
          className="w-full p-3 pl-10 text-gray-800 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-all"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg
          className="w-5 h-5 absolute left-3 top-3.5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* User List */}
      <ul className="flex-1 overflow-y-auto space-y-2 pr-2">
        {!filteredUsers || !Array.isArray(filteredUsers) ? (
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded-lg" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-gray-400 text-center py-4">No users found</div>
        ) : (
          filteredUsers.map((user) => (
            <li
              onClick={() => handleUserClick(user)}
              key={user._id}
              className={`group ${
                activeUserId === user._id ? "bg-cyan-800" : "bg-gray-700"
              }  hover:bg-cyan-900 p-3 rounded-lg transition-all duration-200 cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-100 capitalize">
                    {user.userName}
                  </span>
                  {user.status && (
                    <span className="ml-2 text-xs px-2 py-1 bg-teal-400/20 text-teal-400 rounded-full">
                      {user.status}
                    </span>
                  )}
                </div>
                <button className="opacity-0 group-hover:opacity-100 text-teal-400 hover:text-teal-300 p-1 rounded-full transition-opacity duration-200">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FetchUser;
