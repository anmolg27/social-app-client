const beautifyName = (name) => {
  if (name) {
    let splitName = name.split(" ");
    let newName = "";
    splitName.forEach((cur) => {
      newName = newName.concat(cur[0].toUpperCase() + cur.slice(1) + " ");
    });
    return newName;
  } else return null;
};
module.exports = beautifyName;
