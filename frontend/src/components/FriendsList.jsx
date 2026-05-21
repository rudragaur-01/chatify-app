

import { Link } from "react-router";
import { MessageCircleIcon } from "lucide-react";
import NoFriendsFound from "./NoFriendsFound";

const FriendsList = ({ friends, loadingFriends }) => {
  if (loadingFriends) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  if (friends.length === 0) {
    return <NoFriendsFound />;
  }

  return (
    <div className="space-y-2">
      {friends.map((friend) => (
        <Link
          key={friend._id}
          to={`/chat/${friend._id}`}
          className="flex items-center gap-3 p-3 rounded-2xl hover:bg-base-300 transition-all duration-200"
        >
          <div className="avatar online">
            <div className="w-12 rounded-full">
              <img
                src={friend.profilePic}
                alt={friend.fullName}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">
              {friend.fullName}
            </h3>

            <div className="flex items-center gap-1 text-xs opacity-60">
              <MessageCircleIcon className="size-3" />
              <span>Start chatting</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FriendsList;