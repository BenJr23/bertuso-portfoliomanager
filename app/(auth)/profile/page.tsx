import ProfileForm from "./ProfileForm";
import { getProfile } from "@/app/_actions/profile/getprofile";
import { editProfile } from "@/app/_actions/profile/editprofile";
import { uploadProfileImage } from "@/app/_actions/profile/uploadprofileimage";

export default async function ProfilePage() {
  const result = await getProfile();

  if (!result.success || !result.data) {
    return <div className="text-sm text-red-400">{result.error || "Failed to load profile."}</div>;
  }

  return (
    <ProfileForm
      initialData={result.data}
      editProfileAction={editProfile}
      uploadImageAction={uploadProfileImage}
    />
  );
}
