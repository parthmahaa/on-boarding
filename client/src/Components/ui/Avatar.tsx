import { useNavigate } from "react-router-dom";

interface AvatarProps {
  name: string;
  email?: string;
}

const Avatar = ({ name }: AvatarProps) => {
  const navigate = useNavigate()
  const handleLogout = () =>{
    localStorage.removeItem('isLoggedIn')
    navigate('/')
  }
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <>
    <button 
                className="mt-2 text-end text-red-600 hover:underline text-sm"
                onClick={handleLogout}
              >
                Log out
              </button>
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-sm font-semibold text-gray-700">  
      {initials}
    </div>
    </>
  );
};

export default Avatar;
