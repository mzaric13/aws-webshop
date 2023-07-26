import Button from "../../atoms/Button/Button";
import SignUpFormFields from "../../organisms/SignUpFormFields/SignUpFormFields";

const SignUpPage = () => {
  return (
    <form>
      <div className="flex flex-col items-center justify-center px-6 py-8 mt-20 mx-auto md:h-screen lg:py-0">
        <div className="border-b-2 border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            User Information
          </h2>
          <SignUpFormFields />
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button type="submit" />
        </div>
      </div>
    </form>
  );
};

export default SignUpPage;
