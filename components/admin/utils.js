const getAllCkbx = (name) => {
  const rawNode = document.querySelectorAll(
    `input[type=checkbox][name=${name}]`
  );
  const checked = [];
  const items = [];
  for (const value of rawNode) {
    checked.push(value.checked);
    value.checked &&
      items.push({
        id: value.getAttribute("id"),
        image: value.dataset.image,
        name: value.dataset.name,
      });
  }
  return { checked, items, rawNode };
};

export { getAllCkbx };
