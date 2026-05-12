import elesajpg from "/elesa.jpg";
import nharmoniajpg from "/nharmonia.jpg";
import cynthiajpg from "/cynthia.jpg";
import { imageUrlToFile } from "../../utils/imageUrlToFile";

export const cynthia = await imageUrlToFile(cynthiajpg, "cynthia.jpg");
export const nharmonia = await imageUrlToFile(nharmoniajpg, "nharmonia.jpg");
export const elesa = await imageUrlToFile(elesajpg, "elesa.jpg");

export const pkmnTrainers = [
  { file: cynthia, name: "Cynthia" },
  { file: nharmonia, name: "N" },
  { file: elesa, name: "Elesa" },
];
