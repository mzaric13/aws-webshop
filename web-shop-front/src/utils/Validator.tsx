export const validateUserData = (formData: any) => {
  if (
    formData.email === "" ||
    // eslint-disable-next-line no-useless-escape
    !RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(
      formData.email
    )
  )
    return "Email not in correct format";

  if (
    formData.password === "" ||
    !RegExp(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    ).test(formData.password)
  )
    return "Password must be at least 8 characters long and contain at least 1 capital letter, 1 number and 1 special character";
  if (formData.password !== formData.confirmPassword)
    return "Password and confirm password are not equal";
  if (
    formData.phoneNumber === "" ||
    !RegExp(/^[+][(]?[0-9]{3}[)]?[-\\s.]?[0-9]{2}[-\\s.]?[0-9]{5,7}$/).test(
      formData.phoneNumber
    )
  )
    return "Phone number not in correct format";
  if (!RegExp(/[A-Z]\w*/).test(formData.firstName))
    return "First name not in correct format.";
  if (!RegExp(/[A-Z]\w*/).test(formData.lastName))
    return "Last name not in correct format.";
  if (formData.birthdate === "" || isNaN(Date.parse(formData.birthdate)))
    return "Birthdate is not picked";
  if (!RegExp(/(^\d{5}$)|(^\d{9}$)|(^\d{5}-\d{4}$)/).test(formData.postalCode))
    return "Postal code not in correct format.";
  if (formData.country === "") return "Country not given";
  if (formData.streetAddress === "") return "Street address not given";
  if (formData.city === "") return "City not given";
  return "Success";
};
