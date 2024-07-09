import { Store, User, Truck } from "lucide-react";
import { UserType } from "../FormSchemas";

interface UserTypeIconProps {
  type: UserType;
  isSelected: boolean;
  onClick: () => void;
}

const UserTypeIcon: React.FC<UserTypeIconProps> = ({ type, onClick }) => {
  const IconComponent = {
    vendor: Store,
    client: User,
    driver: Truck,
  }[type];

  return (
    <div
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-yellow-400 bg-yellow-100 p-4 px-6 transition-colors duration-200 dark:bg-gray-600`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">
        <IconComponent
          size={40}
          className="text-gray-600 dark:text-gray-300"
        />
      </div>
      <span className="mt-2 font-semibold text-gray-600 dark:text-gray-100">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    </div>
  );
};

export default UserTypeIcon;