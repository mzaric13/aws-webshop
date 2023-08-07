import User from "../../../models/User";
import FormField from "../../molecules/FormField/FormField";

interface CheckoutFormFieldsProps {
  user: User;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckoutFormFields = ({
  user,
  handleInputChange,
}: CheckoutFormFieldsProps) => {
  return (
    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <FormField
        text="First name"
        name="firstName"
        type="text"
        fieldType="medium"
        handleInputChange={handleInputChange}
        value={user.givenName}
      />
      <FormField
        text="Last name"
        type="text"
        name="lastName"
        fieldType="medium"
        handleInputChange={handleInputChange}
        value={user.familyName}
      />
      <FormField
        text="Email address"
        type="email"
        name="email"
        fieldType="big"
        handleInputChange={handleInputChange}
        value={user.username}
      />
      <FormField
        text="Phone number"
        type="text"
        name="phoneNumber"
        fieldType="big"
        handleInputChange={handleInputChange}
        value={user.phoneNumber}
      />
      <FormField
        text="Country"
        type="text"
        name="country"
        fieldType="big"
        handleInputChange={handleInputChange}
        value={user.address.split(",")[0]}
      />
      <FormField
        text="Street address"
        type="text"
        name="streetAddress"
        fieldType="full"
        handleInputChange={handleInputChange}
        value={
          user.address.split(",").length === 4
            ? user.address.split(",")[2].trim()
            : user.address.split(",")[1].trim()
        }
      />
      <FormField
        text="City"
        type="text"
        name="city"
        fieldType="small-start"
        handleInputChange={handleInputChange}
        value={user.address
          .split(",")
          [user.address.split(",").length - 1].trim()
          .split(" ")
          .slice(1)
          .join(" ")}
      />
      <FormField
        text="State / Province"
        type="text"
        name="region"
        fieldType="small"
        handleInputChange={handleInputChange}
        value={
          user.address.split(",").length === 4
            ? user.address.split(",")[1].trim()
            : ""
        }
      />
      <FormField
        text="ZIP / Postal code"
        type="text"
        name="postalCode"
        fieldType="small"
        handleInputChange={handleInputChange}
        value={user.address
          .split(",")
          [user.address.split(",").length - 1].trim()
          .split(" ")[0]
          .trim()}
      />
    </div>
  );
};

export default CheckoutFormFields;
