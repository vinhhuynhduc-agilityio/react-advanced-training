import { useForm, useController, Control } from "react-hook-form";

type FormValues = {
  firstName: string;
};

const CustomInput = ({ control }: { control: Control<FormValues> }) => {
  const { field, fieldState } = useController({
    name: "firstName",
    control,
    rules: { required: "First name is required" },
  });

  return (
    <div>
      <input
        {...field}
        placeholder="First Name"
        onChange={(e) => {
          field.onChange(e); // Call onChange function from field
          console.log("Input changed:", e.target.value); // Specific action when input changes
        }}
      />
      {fieldState.invalid && <p>{fieldState.error?.message}</p>}
    </div>
  );
};

const App = () => {
  const { control, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomInput control={control} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default App;
