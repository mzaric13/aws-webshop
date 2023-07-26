export interface ReturnValueTags {
  statusCode: number;
  body: Tag[];
}

interface Tag {
  id: number;
  name: string;
  description: string;
}

export default Tag;
