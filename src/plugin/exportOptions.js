const exportOptions = {
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

export default exportOptions;
