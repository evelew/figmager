let unexportedImages = [];

const getImagesFromLevel = (nodes) => {
  return nodes
    .filter((node) => node.fills && node.fills[0] && node.fills[0].type === 'IMAGE')
    .filter((img) => img.exportSettings.length === 0);
};

const getHighlighterRects = (nodes) => {
  return nodes.filter((node) => node.fills && node.fills[0] && node.fills[0].name === 'highlighter-rect');
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

const exportImagesAs = ({type}) => {
  const options = {
    PNG: {
      constraint: {
        type: 'SCALE',
        value: 1,
      },
      contentsOnly: true,
      format: 'PNG',
      suffix: '',
    },
    JPG: {
      constraint: {
        type: 'SCALE',
        value: 1,
      },
      contentsOnly: true,
      format: 'JPG',
      suffix: '',
    },
    SVG: {
      contentsOnly: true,
      format: 'SVG',
      suffix: '',
      svgIdAttribute: false,
      svgOutlineText: true,
      svgSimplifyStroke: true,
    },
    PDF: {
      contentsOnly: true,
      format: 'PDF',
      suffix: '',
    },
  };

  const nodes = figma.currentPage.children;
  const images = getImagesFromLevel(nodes);
  unexportedImages = [...unexportedImages, ...images];

  runInsideNodes(nodes);

  for (let i = 0; i < unexportedImages.length; i++) {
    const img = unexportedImages[i];

    img.exportSettings = [options[type]];
  }

  figma.closePlugin();
};

if (figma.command === 'highlight') {
  const nodes = figma.currentPage.children;
  const images = getImagesFromLevel(nodes);
  unexportedImages = [...unexportedImages, ...images];

  runInsideNodes(nodes);

  for (let i = 0; i < unexportedImages.length; i++) {
    const img = unexportedImages[i];

    const rect = figma.createRectangle();
    rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
    rect.x = img.x - 10;
    rect.y = img.y - 10;
    rect.name = 'highlighter-rect';
    rect.resize(img.width + 20, img.height + 20);

    img.parent.insertChild(0, rect);
  }

  figma.closePlugin();
}

if (figma.command === 'remove_highlight') {
  const getRectsFromLevel = (nodes) => nodes.filter((node) => node.name === 'highlighter-rect');

  let allRects = getRectsFromLevel(figma.currentPage.children);

  const getAllRects = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.children && node.children.length) {
        const imgs = getRectsFromLevel(node.children);
        allRects = [...allRects, ...imgs];

        getAllRects(node.children);
      }
    }
  };

  getAllRects(figma.currentPage.children);

  for (let i = 0; i < allRects.length; i++) {
    allRects[i].remove();
  }

  figma.closePlugin();
}

if (figma.command === 'export_all_png') {
  exportImagesAs({type: 'PNG'});
}

if (figma.command === 'export_all_jpg') {
  exportImagesAs({type: 'JPG'});
}

if (figma.command === 'export_all_svg') {
  exportImagesAs({type: 'SVG'});
}

if (figma.command === 'export_all_pdf') {
  exportImagesAs({type: 'PDF'});
}
