import { FieldValues, UseFormRegister, RegisterOptions, Path } from "react-hook-form";

interface TextFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  validation?: RegisterOptions<T, Path<T>>;
  vertical?: boolean;
  error?: string;
  labelWidth?: string;
  withErrorMargin?: string;
}

export const TextField = <T extends FieldValues>({
  name,
  label,
  type = 'text',
  placeholder = '',
  register,
  validation,
  vertical = false,
  error,
  labelWidth = 'w-24',
  withErrorMargin = ''
}: TextFieldProps<T>) => (
  <div>
    <div className={`flex ${vertical ? "flex-col gap-[10px]" : "items-center"}`}>
      <label
        htmlFor={name}
        className={`${labelWidth} text-gray-700 font-semibold`}
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-black"
        {...register(name, validation)}
      />
    </div>
    {error && (
      <p
        className={`text-red-500 text-sm mt-1 ${withErrorMargin}`.trim()}
      >
        {error}
      </p>
    )}
  </div>
);
