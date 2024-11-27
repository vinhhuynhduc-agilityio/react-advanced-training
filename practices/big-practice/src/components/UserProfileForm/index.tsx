import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUpload } from 'react-icons/fa';

// types
import { UserData, UserFormData } from '@/types';

// hooks
import { useDashboardContext } from '@/hooks';

interface UserProfileFormProps {
  defaultValues: UserData;
  isEditUser: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  buttonLabel: string
};

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  defaultValues,
  isEditUser,
  onClose,
  onSubmit,
  buttonLabel
}) => {
  const { users } = useDashboardContext();
  const [avatarUrl, setAvatarPreview] = useState<string>("https://via.placeholder.com/80");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserFormData>({
    defaultValues,
  });

  useEffect(() => {
    if (isEditUser && defaultValues?.avatarUrl) {
      setAvatarPreview(defaultValues.avatarUrl);
    }

  }, [isEditUser, defaultValues]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      // Start reading the file
      reader.readAsDataURL(file);

      // Set a handler function when the file reading process is complete
      reader.onloadend = () => {

        // base64 string, can be displayed directly in an <img>
        const avatarUrl = reader.result as string;

        setAvatarPreview(avatarUrl);
      };
    }
  };

  const onSubmitWithPreview = (data: UserFormData) => {
    onSubmit({
      ...data,
      avatarUrl: avatarUrl,
    });
  };

  const isEmailDuplicate = (email: string, users: UserData[]) => {
    return users.some(
      user => user.email === email
        && user.email !== defaultValues?.email
    );
  };

  const renderError = (content: string | undefined) => {
    return (
      <p className="text-red-500 text-sm mt-1 ml-24">
        {content}
      </p>
    )
  };

  return (
    <form id="userProfileForm" onSubmit={handleSubmit(onSubmitWithPreview)} className="space-y-6">

      {/* Full Name */}
      <div>
        <div className="flex items-center">
          <label
            htmlFor="fullNameUserProfileForm"
            className="w-24 text-gray-700 font-semibold">
            Full Name
          </label>
          <input
            id="fullNameUserProfileForm"
            className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-black"
            type="text"
            {...register("fullName", {
              required: "Full Name is required",
              maxLength: {
                value: 20,
                message: "Full Name cannot exceed 20 characters",
              },
            })}
            placeholder="Enter full name"
          />
        </div>
        {errors.fullName && renderError(errors.fullName.message)}
      </div>

      {/* Email */}
      <div>
        <div className="flex items-center">
          <label
            className="w-24 text-gray-700 font-semibold"
            htmlFor="emailUserProfileForm"
          >
            Email
          </label>
          <input
            id="emailUserProfileForm"
            className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-black"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Invalid email format",
              },
              validate: {
                duplicate: (value) => !isEmailDuplicate(value, users) || "Email already exists",
              }
            })}
            placeholder="Enter email"
          />
        </div>
        {errors.email && renderError(errors.email.message)}
      </div>

      {/* Avatar */}
      <div>
        <div className="flex items-center">
          <label
            className="w-24 text-gray-700 font-semibold"
            htmlFor="avatar-upload"
          >
            Avatar
          </label>
          <div className="flex items-center space-x-4">
            <img
              src={avatarUrl}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover"
            />
            <input
              type="file"
              accept="image/*"
              {...register("avatar", {
                onChange: handleAvatarChange,
              })}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer text-blue-500 flex items-center space-x-1"
            >
              <FaUpload />
              <span>Upload new photo</span>
            </label>
          </div>
        </div>
        {errors.avatar && renderError(errors.avatar.message)}
      </div>

      {/* Registered */}
      {isEditUser && (
        <div className="flex items-center">
          <label className="w-24 text-gray-700 font-semibold">Registered</label>
          <p className="text-gray-600">{defaultValues.registered}</p>
        </div>
      )}

      {/* Last visited */}
      {isEditUser && (
        <div className="flex items-center">
          <label className="w-24 text-gray-700 font-semibold">Last visited</label>
          <p className="text-gray-600">{defaultValues.lastUpdated}</p>
        </div>
      )}

      {/* Footer with Cancel and Save buttons */}
      <div className="border-t border-gray-300 pt-3 flex justify-between">
        <button
          className="bg-slate-200 text-pink-600 font-bold"
          onClick={onClose}
          type="button"
        >
          Cancel
        </button>
        <button
          className="bg-slate-200 text-blue-600 font-bold active:bg-slate-400"
          type="submit"
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
};

export default UserProfileForm;