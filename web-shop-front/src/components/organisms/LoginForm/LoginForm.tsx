import { FormEvent } from "react";
import Button from "../../atoms/Button/Button";
import FormField from "../../molecules/FormField/FormField";

interface LoginFormProps {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const LoginForm = ({ handleInputChange, handleSubmit }: LoginFormProps) => {
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <FormField
        fieldType="full"
        handleInputChange={handleInputChange}
        name="email"
        text="Email address"
        type="email"
      />

      <FormField
        fieldType="full"
        handleInputChange={handleInputChange}
        name="password"
        text="Password"
        type="password"
      />
      <div>
        <Button type="submit" text="Login" login={true} />
      </div>
    </form>
  );
};

export default LoginForm;
