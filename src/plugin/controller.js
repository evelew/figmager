let unexportedImages = [];

const getImagesFromLevel = (nodes) => {
  return nodes
    .filter((node) => node.fills && node.fills[0] && node.fills[0].type === 'IMAGE')
    .filter((img) => img.exportSettings.length === 0);
};

const runInsideNodes = (nodes) => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.children && node.children.length) {
      const imgs = getImagesFromLevel(node.children);
      unexportedImages = [...unexportedImages, ...imgs];

      runInsideNodes(node.children);
    }
  }
};

if (figma.command === 'highlight') {
  const nodes = figma.currentPage.children;
  const images = getImagesFromLevel(nodes);
  unexportedImages = [...unexportedImages, ...images];

  runInsideNodes(nodes);

  for (let i = 0; i < unexportedImages.length; i++) {
    const img = unexportedImages[i];
    // append line to document

    img.strokeWeight = 4;
    img.strokes = [
      {
        blendMode: 'NORMAL',
        color: {
          r: 0.5600000619888306,
          g: 1,
          b: 0,
        },
        opacity: 1,
        type: 'SOLID',
        visible: true,
      },
    ];
  }

  figma.closePlugin();
}
