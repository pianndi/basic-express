import express from "express";
import expressLayouts from "express-ejs-layouts";
import { body, check, validationResult } from "express-validator";
import { loadKontak, findKontak, addKontak } from "./utils/contacts.js";
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const mahasiswa = [
    {
      nama: "Pianndi",
      email: "pian@gmail.com",
    },
    {
      nama: "Yanto",
      email: "yanti@gmail.com",
    },
    {
      nama: "Budiyanto",
      email: "budi@gmail.com",
    },
  ];
  res.render("index", {
    layout: "layouts/main-layouts.ejs",
    title: "Home",
    mahasiswa,
  });
});
app.get("/about", (req, res) => {
  res.render("about", { layout: "layouts/main-layouts.ejs", title: "About" });
});
app.get("/contact", (req, res) => {
  const contacts = loadKontak();
  res.render("contact", {
    layout: "layouts/main-layouts.ejs",
    title: "Contact",
    contacts,
  });
});
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    layout: "layouts/main-layouts.ejs",
    title: "Add Contact",
  });
});
app.post(
  "/contact/add",
  [
    check("telp", "No telepon tidak valid").isMobilePhone("id-ID"),
    body("telp").custom((val) => {
      if (findKontak(val)) {
        throw new Error("No telepon sudah terdaftar");
      } else {
        return true;
      }
    }),
    check("email", "Email tidak valid").isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        layout: "layouts/main-layouts.ejs",
        title: "Add Contact",
        errors: errors.errors,
        req: req.body,
      });
    } else {
      
    addKontak(req.body);
    res.redirect("/contact");
    }
    // res.send(req.body);
  }
);
app.get("/contact/:telp", (req, res) => {
  const contact = findKontak(req.params.telp);
  res.render("contact-detail", {
    layout: "layouts/main-layouts.ejs",
    title: "Contact Details",
    contact,
  });
});
app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
