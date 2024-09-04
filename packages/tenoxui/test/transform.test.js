let props = {
  transform: ["transform"],
  rotate: ["transform"],
  translateX: ["transform"],
};

function makeTransform(property, value, unit) {
  this.property = props;
  console.log(props);
}
