import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { MessageCircleIcon } from "lucide-react";



const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-all w-full">
      <div className="card-body p-4">

     
        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-3 min-w-0">

            <div className="avatar">
              <div className="w-14 rounded-full">
                <img
                  src={friend.profilePic}
                  alt={friend.fullName}
                />
              </div>
            </div>

            <div className="min-w-0 flex flex-col gap-1">
              <h3 className="font-semibold truncate text-lg">
                {friend.fullName}
              </h3>

              <div className="flex flex-wrap gap-2 mt-1">
                <span className="badge badge-primary badge-md">
                  {getLanguageFlag(friend.nativeLanguage)}
                  Native: {friend.nativeLanguage}
                </span>

                <span className="badge badge-outline badge-md">
                  {friend.gender}
                </span>
              </div>
            </div>

          </div>

         
          <Link
            to={`/chat/${friend._id}`}
            className="btn btn-primary btn-sm btn-circle shrink-0"
          >
            <MessageCircleIcon size={18} />
          </Link>

        </div>

      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}