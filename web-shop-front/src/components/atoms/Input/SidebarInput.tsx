import "./SidebarInput.css";

interface InputProps {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  title: string;
  name: string;
}

const SidebarInput = ({ handleChange, value, title, name }: InputProps) => {
  return (
    <label className="sidebar-label-container">
      <input onChange={handleChange} type="radio" value={value} name={name} />
      <span className="checkmark"></span>
      {title}
    </label>
  );
};

export default SidebarInput;
