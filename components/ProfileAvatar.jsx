import { LogOutIcon } from "lucide-react";

const ProfileAvatar = ({ name, image, email, size = "md", onClick }) => {
  const initial = name?.charAt(0);
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-xl",
  };

  return (
    <div className="flex items-center gap-2 w-full" onClick={onClick}>
      <div className={`${sizes[size]} shrink-0`}>
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-brandPurple text-white flex items-center justify-center font-medium">
            {initial}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 text-14px mr-4 ">
        <h3 className="font-medium text-whiteColor ">{name}</h3>
        <p className="text-gray-200 truncate">{email}</p>
      </div>
      <LogOutIcon className="text-white shrink-0" size={20} />
    </div>
  );
};

export default ProfileAvatar;
