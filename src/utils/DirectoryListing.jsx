export function convertToHierarchy(paths /* array of array of strings */) {
  // Build the node structure
  const rootNode = { name: "root", children: [] };

  for (let path of paths) {
    buildNodeRecursive(rootNode, path.split("/"), 0);
  }

  return rootNode;
}

export function buildNodeRecursive(node, path, idx) {
  if (idx < path.length) {
    let item = path[idx];
    let dir = node.children.find((child) => child.name === item);
    if (!dir) {
      node.children.push((dir = { name: item, children: [] }));
    }
    buildNodeRecursive(dir, path, idx + 1);
  }
}
