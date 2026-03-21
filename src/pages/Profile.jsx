import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { saveUserProfile } from "../services/profileService";
import api from "../services/axios"; // For the password update call
import { FadeLoader } from "react-spinners";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, saveUser, logout } = useUser();
  const [name, setName] = useState(user?.name || "");
  const [genres, setGenres] = useState(user?.genres || []);
  const [language, setLanguage] = useState(user?.language || "");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const GENRES = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 16, name: "Animation" },
  ];

  const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "ml", label: "Malayalam" },
    { code: "ta", label: "Tamil" },
    { code: "te", label: "Telugu" },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedProfileData = { name, genres, language };

      
      const response = await saveUserProfile(updatedProfileData);

      if (response.success) {
        
        saveUser(response.user);
        toast.success("Profile updated successfully 🎉");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword) return toast.error("Enter a new password");
    if (newPassword.length < 6) return toast.error("Password too short");

    setLoading(true);
    try {
     
      await api.put("/profile/update-password", { newPassword });
      setNewPassword("");
      toast.success("Password updated 🔐");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center mb-8">
          <img
            src={
              user?.avatar ||
              `https://api.dicebear.com/7.x/micah/svg?seed=${user?.username}`
            }
            className="w-28 h-28 rounded-full border border-neutral-600"
            alt="User Avatar"
          />
          <button
            onClick={logout}
            className="mt-3 text-sm text-red-400 hover:underline"
          >
            Logout
          </button>
        </div>

        <div className="bg-[#1b1b1b] border border-neutral-700 rounded-2xl p-6 space-y-6">
          {loading && (
            <FadeLoader className="mx-auto" color="#FFC509" width={4} />
          )}

          <div>
            <label className="text-sm font-medium text-neutral-400">
              Display Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 outline-none focus:border-[#FFC509]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-400">
              Favorite Genres
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              {GENRES.map((g) => (
                <button
                  key={g.id}
                  onClick={() =>
                    setGenres((prev) =>
                      prev.includes(g.id)
                        ? prev.filter((i) => i !== g.id)
                        : [...prev, g.id],
                    )
                  }
                  className={`px-3 py-2 rounded-lg border transition ${
                    genres.includes(g.id)
                      ? "bg-[#FFC509] text-black border-[#FFC509]"
                      : "border-neutral-600 hover:bg-neutral-700"
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-400">
              Language
            </label>
            <div className="flex flex-wrap gap-3 mt-3">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    language === l.code
                      ? "bg-[#FFC509] text-black border-[#FFC509]"
                      : "border-neutral-600 hover:bg-neutral-700"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800">
            <label className="text-sm font-medium text-neutral-400">
              Update Password
            </label>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 outline-none focus:border-[#FFC509]"
                placeholder="New password"
              />
              <button
                onClick={handlePasswordChange}
                className="px-6 py-2 border border-neutral-600 rounded-lg hover:bg-neutral-800 transition"
              >
                Update
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-[#FFC509] py-3 rounded-xl text-black font-semibold hover:bg-amber-300 transition mt-4 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
