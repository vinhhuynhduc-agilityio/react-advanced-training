import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormData {
  firstName: string;
  email: string;
  age: number;
}

const App: React.FC = () => {
  // Initialize useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    alert("Form submitted successfully!");
  };

  return (
    <div>
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* First Name Field */}
        <div>
          <label>First Name</label>
          <input
            {...register("firstName", {
              required: "First name is required", // Required
              maxLength: {
                value: 20,
                message: "First name cannot exceed 20 characters", // Max length
              },
            })}
          />
          {/* Display error if exists */}
          {errors.firstName && <p>{errors.firstName.message}</p>}
        </div>

        {/* Email Field */}
        <div>
          <label>Email</label>
          <input
            {...register("email", {
              required: "Email is required", // Required
              pattern: {
                value: /^\S+@\S+$/i, // Email format validation
                message: "Email is not valid",
              },
            })}
          />
          {/* Display error if exists */}
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        {/* Age Field */}
        <div>
          <label>Age</label>
          <input
            type="number"
            {...register("age", {
              required: "Age is required", // Required
              min: {
                value: 18,
                message: "You must be at least 18 years old", // Min age
              },
              max: {
                value: 99,
                message: "You must be under 99 years old", // Max age
              },
            })}
          />
          {/* Display error if exists */}
          {errors.age && <p>{errors.age.message}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
