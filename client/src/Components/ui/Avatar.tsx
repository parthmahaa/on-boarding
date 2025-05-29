import { useNavigate } from "react-router-dom";

interface AvatarProps {
  name: string;
  email?: string;
}

const Avatar = ({ name }: AvatarProps) => {
  const navigate = useNavigate()
  return (
    <>
    <div className="flex items-center justify-center w-auto h-10 p-2 rounded-lg bg-gray-200 text-sm font-semibold text-gray-700">  
      {name}
    </div>
    </>
  );
};

export default Avatar;