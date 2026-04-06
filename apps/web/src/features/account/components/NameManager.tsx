import { Button } from "@/components/ui/button";
import { useNameManager } from "../hooks/useNameManager";

export const NameManager = () => {
  const {
    user,
    handleChange,
    updateUser,
    isUpdatingUser,
    isFormValid,
    form,
    formError,
  } = useNameManager();
 
  return (
    <div className="mb-16">
      <h2 className="text-xs font-semibold tracking-[0.125em] uppercase text-stone-400 mb-6">
        PROFILE INFORMATION
      </h2>
      <div className="bg-white  border-stone-100 rounded-3xl p-8">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Avatar */}

          <div className="flex flex-col items-center gap-6">
            <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-stone-800 to-black flex items-center justify-center text-6xl text-white cursor-pointer hover:brightness-110 transition-all">
                👤
              </div>
              <p className="text-center text-[11px] text-stone-400 mt-3 tracking-wide">
                CHANGE AVATAR
              </p>
            </div>
            <Button variant={"outline"} className="px-6 py-5">
              Upload Avatar
            </Button>
          </div>
          {/* Form Fields */}
          <div className="flex-1 space-y-6">
            <div className="flex w-full gap-2 flex-col items-end">
              <div className="w-full">
                <label className="block text-xs font-semibold tracking-[0.125em] uppercase text-stone-400 mb-2">
                  NICKNAME
                </label>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={handleChange}
                  placeholder={user.nickname ?? 'your nickname'}
                  name="nickname"
                  className="w-full bg-stone-50 border border-stone-200 focus:border-stone-400 rounded-2xl px-5 py-3.5 text-[15px] focus:outline-none transition-colors"
                />
              </div>

              <div className="w-full">
                <label className="block text-xs font-semibold tracking-[0.125em] uppercase text-stone-400 mb-2">
                  USERNAME
                </label>
                <div className="flex w-full">
                  <span className="inline-flex items-center px-5 bg-stone-100 border border-r-0 border-stone-200 rounded-l-2xl text-stone-400 text-sm font-medium">
                    @
                  </span>
                  <input
                    type="text"
                    name="username"
                    placeholder={user.username}
                    onChange={handleChange}
                    value={form.username}
                    className="flex-1 bg-stone-50 border border-stone-200 focus:border-stone-400 rounded-r-2xl px-5 py-3.5 text-[15px] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <p className="text-red-400 text-xs">{formError}</p>
              <Button disabled = {isUpdatingUser || !isFormValid}  onClick={() => updateUser(form)} className="my-btn">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
