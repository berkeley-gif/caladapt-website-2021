export const mouseoutBlur = (node, callback) => {
  node.addEventListener("mouseout", callback);
  node.addEventListener("blur", callback);

  return {
    destroy() {
      node.removeEventListener("mouseout", callback);
      node.removeEventListener("blur", callback);
    },
  };
};

export const mouseoverFocus = (node, callback) => {
  node.addEventListener("mouseover", callback);
  node.addEventListener("focus", callback);

  return {
    destroy() {
      node.removeEventListener("mouseover", callback);
      node.removeEventListener("focus", callback);
    },
  };
};
