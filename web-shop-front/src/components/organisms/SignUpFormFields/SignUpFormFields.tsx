import FormField from "../../molecules/FormField/FormField";

interface SignUpFormProps {
  handleInputChange: (evnt: React.ChangeEvent<HTMLInputElement>) => void;
}

const SignUpFormFields = ({ handleInputChange }: SignUpFormProps) => {
  return (
    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <FormField
        text="First name"
        name="firstName"
        type="text"
        fieldType="medium"
        handleInputChange={handleInputChange}
      />
      <FormField
        text="Last name"
        type="text"
        name="lastName"
        fieldType="medium"
        handleInputChange={handleInputChange}
      />
      <FormField
        text="Email address"
        type="email"
        name="email"
        fieldType="big"
        handleInputChange={handleInputChange}
      />
      <FormField
        text="Phone number"
        type="text"
        name="phoneNumber"
        fieldType="big"
        handleInputChange={handleInputChange}
      />
      <FormField
        text="Password"
        type="password"
        name="password"
        fieldType="medium"
        handleInputChange={handleInputChange}
      />
      <FormField
        text="Confirm password"
        type="password"
        name="confirmPassword"
        fieldType="medium"
        handleInputChange={handleInputChange}
      />
      <FormField
        text="Birthdate"
        type="date"
        name="birthdate"
        fieldType="big"
        handleInputChange={handleInputChange}
      />
      <FormField
        text="Country"
        type="text"
        name="country"
        fieldType="big"
        handleInputChange={handleInputChange}
      />
      <FormField
        text="Street address"
        type="text"
        name="streetAddress"
        fieldType="full"
        handleInputChange={handleInputChange}
      />
      <FormField
        text="City"
        type="text"
        name="city"
        fieldType="small-start"
        handleInputChange={handleInputChange}
      />
      <FormField
        text="State / Province"
        type="text"
        name="region"
        fieldType="small"
        handleInputChange={handleInputChange}
      />
      <FormField
        text="ZIP / Postal code"
        type="text"
        name="postalCode"
        fieldType="small"
        handleInputChange={handleInputChange}
      />
    </div>
  );
};

export default SignUpFormFields;
