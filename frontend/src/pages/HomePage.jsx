import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  MessageCircleIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { capitialize } from "../lib/utils";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 5;
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const [recommendedUsers, setRecommendedUsers] = useState([]);

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const {
    data = { users: [], hasMore: false },
    isLoading: loadingUsers,
    isFetching,
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () => getRecommendedUsers(page, limit),
    keepPreviousData: true,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  useEffect(() => {
    if (!data?.users?.length) return;

    setRecommendedUsers((prev) => {
      const existingIds = new Set(prev.map((u) => u._id));

      const newUsers = data.users.filter((u) => !existingIds.has(u._id));
      if (newUsers.length === 0) {
        return prev;
      }

      return [...prev, ...newUsers];
    });
  }, [data?.users]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="p-4 sm:p-4 lg:px-6">
      <div className="container mx-auto  lg:space-y-5">
        <section className="lg:hidden">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Your Friends
                </h2>

                <p className="opacity-70">
                  Connect, chat, and stay in touch with your friends
                </p>
              </div>

              {/* <div className="flex gap-2">
                <Link to={"/all-chat"}>
                  <button className="btn btn-outline btn-sm">
                    <UsersIcon className="mr-2 size-4" />
                    All Chat
                  </button>
                </Link>
              </div> */}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto  pb-4">
            {loadingFriends ? (
              <div className="flex justify-center py-10">
                <span className="loading loading-spinner loading-md" />
              </div>
            ) : friends.length === 0 ? (
              <NoFriendsFound />
            ) : (
              <div className="space-y-2">
                {friends.map((friend) => (
                  <Link
                    key={friend._id}
                    to={`/chat/${friend._id}`}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-base-300 transition-all duration-200"
                  >
                    <div className="avatar online">
                      <div className="w-12 rounded-full">
                        <img src={friend.profilePic} alt={friend.fullName} />
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
            )}
          </div>
        </section>

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Discover New Connections
                </h2>
                <p className="opacity-70">
                  Start conversations, make friends, and video call people who
                  share your interests
                </p>
              </div>
              <div>
                <Link
                  to="/notifications"
                  className="btn btn-outline btn-sm shrink-0"
                >
                  Friend Requests
                </Link>
              </div>
            </div>
          </div>
          <div>
            {loadingUsers ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : recommendedUsers.length === 0 ? (
              <div className="card bg-base-300 p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">
                  No recommendations available
                </h3>
                <p className="text-base-content opacity-70">
                  Check back later for new language partners!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendedUsers.map((user) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-base-200 hover:bg-base-300 transition-all duration-200"
                    >
                      {/* LEFT */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="avatar">
                          <div className="w-14 rounded-full">
                            <img src={user.profilePic} alt={user.fullName} />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h2 className="font-semibold truncate">
                            {user.fullName}
                          </h2>

                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="badge badge-secondary badge-md">
                              {getLanguageFlag(user.nativeLanguage)}
                              {capitialize(user.nativeLanguage)}
                            </span>

                            <span className="badge badge-secondary badge-md">
                              {user.gender}
                            </span>
                          </div>

                          {user.bio && (
                            <p className="text-xs opacity-70 mt-2 line-clamp-1">
                              {user.bio}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* RIGHT */}
                      <button
                        className={`btn btn-sm ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4" />
                            Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4" />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {data?.hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="btn btn-primary"
                disabled={isFetching}
              >
                {isFetching ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
