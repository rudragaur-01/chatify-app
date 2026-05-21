import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  HomeIcon,
  MessageCircleIcon,
  ShipWheelIcon,
  UsersIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import NoFriendsFound from "./NoFriendsFound";
import FriendCard from "./FriendCard";
import FriendsList from "./FriendsList";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />

          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            SyncChat
          </span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <nav className="p-4 space-y-3 flex-shrink-0">
          <Link
            to="/"
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/" ? "btn-active" : ""
            }`}
          >
            <HomeIcon className="size-5 text-base-content opacity-70" />
            <span>Home</span>
          </Link>
        </nav>

        <div className="px-5 pb-3 flex-shrink-0">
          <h2 className="font-semibold text-base">Your Friends</h2>

          <p className="text-xs opacity-60">Available to chat</p>
        </div>

        <FriendsList friends={friends} loadingFriends={loadingFriends} />
      </div>

      <div className="p-4 border-t border-base-300 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>

          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="font-extralight opacity-80 text-sm">
              {authUser?.email}
            </p>

            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
