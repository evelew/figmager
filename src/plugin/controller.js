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

    img.strokeWeight = 8;
    img.strokes = [
      {
        blendMode: 'NORMAL',
        color: {
          r: 1,
          g: 0,
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

// TODO: como remover apenas a borda que foi colocada pelo plugin?
// verificar configs, se todas as configurações forem iguais as que o plugin coloca então remove
if (figma.command === 'remove_highlight') {
  const nodes = figma.currentPage.children;
  const images = getImagesFromLevel(nodes);
  unexportedImages = [...unexportedImages, ...images];

  runInsideNodes(nodes);

  for (let i = 0; i < unexportedImages.length; i++) {
    const img = unexportedImages[i];

    img.strokeWeight = 0;
    img.strokes = [];
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
