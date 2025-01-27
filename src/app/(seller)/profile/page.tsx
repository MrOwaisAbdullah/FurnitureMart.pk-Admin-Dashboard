"use client"
import SettingsPage from "@/components/Profile/ProfileSetting";
import { useSeller } from "@/hooks/useSeller";

const ProfilePage = () =>{

  const { data: seller } = useSeller();
  if (!seller) {
    return <div>Seller not found</div>;
  }

  return <SettingsPage seller={seller} />;
}

export default ProfilePage;