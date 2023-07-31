import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import User from "../../../models/User";
import { signUp } from "../../../services/user-service";
import { validateUserData } from "../../../utils/Validator";
import Button from "../../atoms/Button/Button";
import SignUpFormFields from "../../organisms/SignUpFormFields/SignUpFormFields";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    birthdate: "",
    streetAddress: "",
    country: "",
    city: "",
    region: "",
    postalCode: "",
  });
  const navigate = useNavigate();

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
    const message = validateUserData(formData);
    if (message === "Success") {
      console.log("usao");
      const user: User = {
        username: formData.email,
        password: formData.password,
        givenName: formData.firstName,
        familyName: formData.lastName,
        birthdate: formData.birthdate,
        phoneNumber: formData.phoneNumber,
        address:
          formData.country +
          ", " +
          (formData.region === "" ? "" : formData.region + ", ") +
          formData.streetAddress +
          ", " +
          formData.postalCode +
          " " +
          formData.city,
      };
      signUp(user)
        .then((res) => {
          console.log(res);
          if (res.data.statusCode === 200) {
            toast.success(res.data.message);
            navigate("/");
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    } else toast.error(message);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mt-36 mx-auto md:h-screen lg:py-0">
        <div className="border-b-2 border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            User Information
          </h2>
          <SignUpFormFields handleInputChange={handleInputChange} />
        </div>
        <div className="mt-6 mb-36 flex items-center justify-end gap-x-6 sm:col-span-6">
          <Button type="submit" text="Register" />
        </div>
      </div>
    </form>
  );
};

export default SignUpPage;
