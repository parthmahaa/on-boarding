interface AvatarProps {
  name: string;
  email?: string;
}

const Avatar = ({ name }: AvatarProps) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
      {initials}
    </div>
  );
};

export default Avatar;
