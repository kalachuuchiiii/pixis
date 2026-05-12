import { Button } from "@/components/ui/button";
import { UserBadge } from "./ui/UserBadge";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "../hooks/useProfile";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { Skeleton } from "boneyard-js/react";
import { pkmnTrainers } from "./data/pkmnTrainers";

export const AvatarManager = () => {
  const { data: user } = useAuthUser();
  const [file, setFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { updateAvatar, isUpdatingAvatar } = useProfile();
  const filePreview = useMemo(
    () => (file ? URL.createObjectURL(file) : user.avatarUrl),
    [file]
  );
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
  };

  const handleSelectPokemonTrainer = (file: File) => {
    if (!file) return;
    setFile(file);
  };

  return (
    <div className="flex flex-col lg:p-4 items-center gap-6">
      <UserBadge user={user}>
        <UserBadge.Avatar className="size-50 outline-4 avatar-ring outline-offset-4" />
      </UserBadge>

      <Dialog>
        <DialogTrigger>
          <Skeleton loading={!user.id} name="button">
            <Button variant={"outline"} className="my-btn">
              Upload Avatar
            </Button>
          </Skeleton>
        </DialogTrigger>
        <DialogContent>
          <div className="space-y-5">
            <div className="flex items-center gap-10 p-4">
              <Avatar className="size-40 lg:size-50 outline outline-4 outline-offset-4 avatar-ring">
                <AvatarImage src={filePreview || undefined} />
              </Avatar>

              <Input
                ref={fileInputRef}
                onChange={onFileChange}
                type="file"
                className="hidden"
                accept="/image"
              />
              <div className="flex flex-col w-full items-center justify-end gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant={"outline"}
                  className="my-btn w-full "
                >
                  Upload
                </Button>
                <Button
                  onClick={() => updateAvatar({ file })}
                  disabled={isUpdatingAvatar}
                  className="my-btn w-full"
                >
                  Save
                </Button>
              </div>
            </div>
            <footer className="flex flex-col gap-1">
              <p className="opacity-75 text-sm text-left w-fit">
                PKMN trainers
              </p>
              <div className="flex items-center justify-start w-full gap-2">
                {pkmnTrainers.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => handleSelectPokemonTrainer(t.file)}
                  >
                    <Avatar className="size-24 lg:size-26">
                      <AvatarImage src={URL.createObjectURL(t.file)} />
                      <AvatarFallback>{t.name}</AvatarFallback>
                    </Avatar>
                  </button>
                ))}
              </div>
            </footer>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
