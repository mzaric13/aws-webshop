import Brand from "./Brand";
import ItemType from "./ItemType";
import Tag from "./Tag";

export default interface SearchData {
  page: number;
  pageSize: number;
  itemType?: ItemType;
  brands?: Brand[];
  tags?: Tag[];
  sortOption?: string;
}
