export interface ValueC {
  name: string;
  checked: boolean;
}

interface CategoryValues {
  category: string;
  values: ValueC[];
  handlerIndex: number;
}

export default CategoryValues;
