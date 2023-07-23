export interface ValueC {
  name: string;
  checked: boolean;
}

interface CategoryValues {
  category: string;
  values: ValueC[];
  handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default CategoryValues;
