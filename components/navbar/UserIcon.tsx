import { currentUser, auth } from "@clerk/nextjs/server"
import { LuUser2 } from "react-icons/lu"


async function UserIcon() {
  const {userId} = auth()
  const user = await currentUser();
  const profileImage = user?.imageUrl;
  if (profileImage) {
    return (
      <img src={profileImage} className='w-6 h-6 rounded-full object-cover' />
    )
  }
  
  return <LuUser2 className='w-6 h-6 bg-primary rounded-full text-white' />;
  
}

export default UserIcon