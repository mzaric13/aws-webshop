export interface ReturnValueBrand {
  statusCode: number;
  body: Brand[];
}

interface Brand {
  id: number;
  name: string;
}

export default Brand;
