import { Separator } from "@/components/ui/separator";
import { UserBadge } from "./ui/UserBadge";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { useProfileDetails } from "../hooks/useProfileDetails";
import { Button } from "@/components/ui/button";
import { BookOpen, ChartArea, Clock, Layers, LibraryBig } from "lucide-react";
import { Skeleton } from "boneyard-js/react";

const ProfileDetails = () => {
  const { data: user, isPending, isFetching } = useProfileDetails();

  const isLoading = !user.id;
  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto px-2 lg:px-8 ">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start mb-20">
          {/* Avatar & Name Section */}
          <div className="flex-shrink-0 lg:sticky lg:top-0   flex flex-col items-center">
            <div className="relative p-2 mt-20">
              <Skeleton name="avatar" loading={isLoading}>
                <UserBadge user={user}>
                  <UserBadge.Avatar className="size-50 outline-4 outline-amber-400 outline-offset-4" />
                </UserBadge>
              </Skeleton>
            </div>

            <div className="mt-8 text-center ">
              <Skeleton loading={isLoading} name="profile-nickname">
                <h1 className="text-4xl w-fit font-semibold tracking-tight dark:text-neutral-100 text-zinc-900">
                  {user.nickname || user.username}
                </h1>
              </Skeleton>
              <Skeleton loading={isLoading} name="profile-username">
                <p className="text-zinc-500 mt-1 w-fit mx-auto text-lg">
                  @{user.username}
                </p>
              </Skeleton>
            </div>
          </div>
          <main className="flex flex-col w-full items-start gap-6">
            <div className=" text-base grid text-center grid-cols-4 w-full ">
              <NavLink
                className={({ isActive }) =>
                  `${isActive && "active-route"} p-2 lg:p-3`
                }
                to={`/app/profile/${user.id}/stats`}
              >
                <Skeleton loading={isLoading} name="button">
                  <Button
                    className="my-btn text-xs lg:text-base"
                    variant={"ghost"}
                  >
                    <ChartArea className="lg:size-7 size-5" />{" "}
                    <span className="lg:block hidden">Stats</span>
                  </Button>
                </Skeleton>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `${isActive && "active-route"} p-2 lg:p-3`
                }
                to={`/app/profile/${user.id}/collections`}
              >
                <Skeleton loading={isLoading} name="button">
                  <Button
                    className="my-btn text-xs lg:text-base "
                    variant={"ghost"}
                  >
                    <LibraryBig className="lg:size-7 size-5" />{" "}
                    <span className="lg:block hidden">Collections</span>
                  </Button>
                </Skeleton>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `${isActive && "active-route"} p-2 lg:p-3`
                }
                to={`/app/profile/${user.id}/decks`}
              >
                <Skeleton loading={isLoading} name="button">
                  <Button
                    className="my-btn  text-xs lg:text-base"
                    variant={"ghost"}
                  >
                    <Layers className="lg:size-7 size-5" />{" "}
                    <span className="lg:block hidden">Decks</span>
                  </Button>
                </Skeleton>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `${isActive && "active-route"} p-2 lg:p-3`
                }
                to={`/app/profile/${user.id}/history`}
              >
                <Skeleton loading={isLoading} name="button">
                  <Button
                    className="my-btn text-xs lg:text-base"
                    variant={"ghost"}
                  >
                    <Clock className="lg:size-7 size-5" />{" "}
                    <span className="lg:block hidden">History</span>
                  </Button>
                </Skeleton>
              </NavLink>
            </div>
            <Separator />
            <div className="w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
