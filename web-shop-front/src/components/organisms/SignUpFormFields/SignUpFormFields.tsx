import FormField from "../../molecules/FormField/FormField";

const SignUpFormFields = () => {
  return (
    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <FormField
        text="First name"
        name="first-name"
        type="text"
        fieldType="medium"
      />
      <FormField
        text="Last name"
        type="text"
        name="last-name"
        fieldType="medium"
      />
      <FormField
        text="Email address"
        type="email"
        name="email"
        fieldType="big"
      />
      <FormField
        text="Phone number"
        type="text"
        name="phone-number"
        fieldType="big"
      />
      <FormField
        text="Password"
        type="password"
        name="password"
        fieldType="medium"
      />
      <FormField
        text="Confirm password"
        type="password"
        name="confirm-password"
        fieldType="medium"
      />
      <FormField
        text="Birthdate"
        type="date"
        name="birthdate"
        fieldType="big"
      />
      <FormField text="Country" type="text" name="country" fieldType="big" />
      <FormField
        text="Street address"
        type="text"
        name="street-address"
        fieldType="full"
      />
      <FormField text="City" type="text" name="city" fieldType="small-start" />
      <FormField
        text="State / Province"
        type="text"
        name="region"
        fieldType="small"
      />
      <FormField
        text="ZIP / Postal code"
        type="text"
        name="postal-code"
        fieldType="small"
      />
    </div>
  );
};

export default SignUpFormFields;
