module.exports = [
  {
    type: "input",
    name: "root",
    default: "public_html",
    message: "Enter the directory of your app"
  },
  {
    type: "confirm",
    name: "clean_urls",
    default: false,
    message: "Drop `.html` extensions from urls?"
  },
  {
    type: "input",
    name: "error_page",
    message: "Path to custom error page from root directory"
  }
];
