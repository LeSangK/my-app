import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "./Form.css";

type Inputs = {
  example: string;
  gender: "male" | "female" | "other";
  exampleRequired: string;
};

export const Form: FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    alert(JSON.stringify(data));
  };

  console.log(watch("example")); // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Example</label>
      <input {...register("example")} defaultValue="test" />
      <label>ExampleRequired</label>
      <input
        {...register("exampleRequired", { required: true, maxLength: 10 })}
      />
      <select {...register("gender")}>
        <option value="female">female</option>
        <option value="male">male</option>
        <option value="other">other</option>
      </select>
      {errors.exampleRequired && <p>This field is required</p>}
      <input type="submit" />
    </form>
  );
};
