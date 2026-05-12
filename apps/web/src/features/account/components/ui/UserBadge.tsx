import type { User, UserBadge as UB } from "@pixis/schemas";
import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  AvatarFallback,
  Avatar as AvatarIcon,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Link } from "react-router-dom";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { Skeleton } from "boneyard-js/react";

interface UserProviderProps {
  user: UB;
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
    <div {...props}>{children}</div>
  </UserContext.Provider>
);

const Avatar = ({ ...props }: ComponentProps<"div">) => {
  const user = useUser();

  const firstTwoLetters =
    String(user.username?.substring(0, 2) ?? "NA") ?? "NA";

  return (
    <Skeleton loading={!user} name="avatar">
      <AvatarIcon {...props}>
        <AvatarImage
          src={
            user.avatarUrl ||
            "https://i.pinimg.com/550x/04/29/6e/04296eecc2068ff6326efffca76f7836.jpg"
          }
        />
        <AvatarFallback>{firstTwoLetters}</AvatarFallback>
      </AvatarIcon>
    </Skeleton>
  );
};

const Username = () => {
  const user = useUser();
  const { data } = useAuthUser();

  const url =
    data.id === user.id
      ? `/app/profile/${data.id}/stats`
      : `/app/profile/${user.id}/stats`;

  return (
    <Skeleton name="username" loading={!user.username}>
      <Link className="cursor-pointer" to={url}>
        <p className="text-xs w-fit  lg:text-sm dark:text-zinc-300 opacity-75 text-zinc-500">
          @{user.username}
        </p>
      </Link>
    </Skeleton>
  );
};

const Nickname = () => {
  const user = useUser();
  return (
    <Skeleton loading={!user.nickname && !user.username} name="nickname">
      <p className="lg:text-lg  text-sm dark:text-zinc-200 w-fit font-semibold text-zinc-900 tracking-tighter truncate leading-tight">
        {user.nickname || user.username}
      </p>
    </Skeleton>
  );
};

const Info = () => {
  const user = useUser();

  return (
    <div className="min-w-0 flex-1 space-y-[1px] w-fit">
      <Nickname />
      <Username />
    </div>
  );
};

const Default = ({ user }: { user: UB }) => {
  return (
    <Root className="flex items-center gap-4" user={user}>
      <Avatar className="outline-[2px] outline-offset-3 avatar-ring" />
      <Info />
    </Root>
  );
};

export const UserBadge = Object.assign(Root, {
  Avatar,
  Username,
  Nickname,
  Default,
  Info,
});
