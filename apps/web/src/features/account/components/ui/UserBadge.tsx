import type { User } from "@pixis/schemas";
import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import {
  AvatarFallback,
  Avatar as AvatarIcon,
  AvatarImage,
} from "@/components/ui/avatar.tsx";

interface UserProviderProps {
  user: User;
  children: ReactNode;
}

const UserContext = createContext<Partial<User> | undefined>(undefined);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
};

const Root = ({
  children,
  user,
  ...props
}: UserProviderProps & ComponentProps<"div">) => (
  <UserContext.Provider value={user}>
    <div {...props}>
     {children}
    </div>
  </UserContext.Provider>
);

const Avatar = ({ ...props }: ComponentProps<"div">) => {
  const user = useUser();

  const firstTwoLetters =
    String(user.username?.substring(0, 2) ?? "NA") ?? "NA";

  return (
    <>
      <AvatarIcon {...props}>
        <AvatarImage
          src={
            user.avatarPublicUrl
              ? `https://res.cloudinary.com/<cloud-name>/image/upload/${user.avatarPublicUrl}`
              : undefined
          }
        />
        <AvatarFallback>{firstTwoLetters}</AvatarFallback>
      </AvatarIcon>
    </>
  );
};

const Info = () => {
  const user = useUser();

  return (

      !user.username ? (
        <div className="w-full flex-1 space-y-1">
          {/* Nickname / Username skeleton */}
          <div className="h-3 w-26 bg-stone-200 rounded animate-pulse"></div>

          {/* Username skeleton */}
          <div className="h-2 w-20 bg-stone-200 rounded animate-pulse"></div>
        </div>
      ) : (
        <div className="min-w-0 flex-1 w-fit">
          <p className="text-[13px] w-fit font-semibold text-stone-800 truncate leading-tight">
            {user.nickname || user.username}
          </p>
          <p className="text-[11px] text-stone-400 truncate">{user.username}</p>
        </div>
      )
   
  );
};

export const UserBadge = Object.assign(Root, {
  Avatar,
  Info,
});
