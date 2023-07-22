interface CategoryValues {
  category: string;
  values: string[];
  handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default CategoryValues;
