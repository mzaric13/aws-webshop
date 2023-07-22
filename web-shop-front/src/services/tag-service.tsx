import Tag from "../models/Tag";

export const getAllTags = () => {
  // DUMMY DATA
  let t1: Tag = {
    id: 1,
    name: "MEN",
    description: "SEX",
  };
  let t2: Tag = {
    id: 2,
    name: "WOMEN",
    description: "SEX",
  };
  let t3: Tag = {
    id: 3,
    name: "FOOTBALL",
    description: "SPORT",
  };
  let t4: Tag = {
    id: 4,
    name: "BASKETBALL",
    description: "SPORT",
  };
  let t5: Tag = {
    id: 5,
    name: "SWEATSHIRT",
    description: "CLOTHES_TYPE",
  };
  let t6: Tag = {
    id: 6,
    name: "SHORTS",
    description: "CLOTHES_TYPE",
  };
  return [t1, t2, t3, t4, t5, t6];

  // WHEN API READY
  // return axios.get<Tag[]>(`${baseUrl}tags/get-all/`);
};
