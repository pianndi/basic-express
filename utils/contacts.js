//import validator from "validator";
//import chalk from "chalk";
import fs from "fs";

const dirPath = "./data";
const contactsPath = dirPath + "/contacts.json";

if (!fs.existsSync(dirPath)) fs.mkdirSync("data");
if (!fs.existsSync(contactsPath)) fs.writeFileSync(contactsPath, "[]");

export function loadKontak() {
  return JSON.parse(fs.readFileSync(contactsPath, "utf-8"));
}

export function findKontak(telp) {
  const contacts = loadKontak();
  return contacts.find((data) => data.telp == telp);
}

function saveKontak(data) {
  fs.writeFileSync(contactsPath, JSON.stringify(data));
}

export function addKontak(contact) {
  const data = loadKontak()
  data.push(contact);
  saveKontak(data);
}

export function deleteKontak(telp) {
  const data = loadKontak();
  const newData = data.filter((d) => d.telp !== telp);
  // console.log(data, newData);
  if (data.length === newData.length) {
    console.error(chalk.red.inverse.bold(`Data ${telp} tidak ditemukan`));
    return false;
  }
  fs.writeFileSync(contactsPath, JSON.stringify(newData));
  console.log(chalk.green.inverse.bold(`Berhasil menghapus data ${telp}`));
}
