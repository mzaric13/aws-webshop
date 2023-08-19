import jwtDecode from "jwt-decode";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/auth-service";
import { setToken } from "../../../services/token-service";
import LoginForm from "../../organisms/LoginForm/LoginForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    login({ email: formData.email, password: formData.password })
      .then((res) => {
        const decodedToken: any = jwtDecode(res.data.body.idToken);
        const navigateUrl = setToken(res.data.body.idToken, decodedToken);
        navigate(navigateUrl);
      })
      .catch((err) => console.log(err));
    event.preventDefault();
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default LoginPage;
