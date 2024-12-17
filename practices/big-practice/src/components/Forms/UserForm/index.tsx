import React, { useEffect, useState } from 'react';
import { FaUpload } from 'react-icons/fa';

// types
import { UserData, UserFormData } from '@/types';

// constant
import { defaultAvatarUrl } from '@/constant';

// hooks
import { useEmailValidation, useUserForm } from '@/hooks';

// components
import { Button } from '@/components/common';
import { Avatar } from '@/components';

// helpers
import { readFileAsBase64 } from '@/helpers';

interface UserFormProps {
  defaultValues: UserData;
  isEditUser: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  buttonLabel: string
};

const UserForm: React.FC<UserFormProps> = ({
  defaultValues,
  isEditUser,
  onClose,
  onSubmit,
  buttonLabel
}) => {
  const [avatarUrl, setAvatarPreview] = useState<string>(defaultAvatarUrl);
  const { isEmailDuplicate } = useEmailValidation(defaultValues?.email);
  const { register, handleSubmit, errors } = useUserForm(defaultValues);

  useEffect(() => {
    if (isEditUser && defaultValues?.avatarUrl) {
      setAvatarPreview(defaultValues.avatarUrl);
    }

  }, [isEditUser, defaultValues]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      readFileAsBase64(file, setAvatarPreview);
    }
  };

  const onSubmitWithPreview = (data: UserFormData) => {
    onSubmit({
      ...data,
      avatarUrl: avatarUrl,
    });
  };

  const renderError = (content: string | undefined) => {
    return (
      <p className="text-red-500 text-sm mt-1 ml-24">
        {content}
      </p>
    )
  };

  return (
    <form id="UserForm" onSubmit={handleSubmit(onSubmitWithPreview)} className="space-y-6">

      {/* Full Name */}
      <div>
        <div className="flex items-center">
          <label
            htmlFor="fullNameUserForm"
            className="w-24 text-gray-700 font-semibold">
            Full Name
          </label>
          <input
            id="fullNameUserForm"
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
                duplicate: (value) => !isEmailDuplicate(value) || "Email already exists",
              }
            })}
            placeholder="Enter email"
            aria-label='email-user'
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
            <Avatar
              src={avatarUrl}
              alt="Avatar Preview"
              size="w-24 h-24"
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
        <Button
          type="button"
          onClick={onClose}
          label="Cancel"
          variant="secondary"
        />
        <Button
          type="submit"
          label={buttonLabel}
          variant="primary"
          ariaLabel='save-user'
        />
      </div>
    </form>
  );
};

export default UserForm;