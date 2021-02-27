export const inputFileFormats = {
  bigwig: 0,
  bed: 0,
  bedpe: 0,
  seg: 0,
  vcf: 0,
  cooler: 0,
};

export const colorScheme = {
  bed: "w3-deep-orange",
  bedpe: "w3-teal",
  bigwig: "w3-khaki",
  seg: "w3-amber",
  vcf: "w3-blue-gray",
  cooler: "w3-cyan",
};

export const fileInputFieldsActive = {
  bed: {
    assembly1: true,
    assembly2: false,
    interconnection: false,
    granularity: false,
    availability: false,
    data: true,
  },
  bedpe: {
    assembly1: true,
    assembly2: true,
    interconnection: true,
    granularity: false,
    availability: false,
    data: true,
  },
  bigwig: {
    assembly1: true,
    assembly2: false,
    interconnection: false,
    granularity: true,
    availability: false,
    data: false,
  },
  cooler: {
    assembly1: true,
    assembly2: true,
    interconnection: false,
    granularity: true,
    availability: false,
    data: false,
  },
  seg: {
    assembly1: true,
    assembly2: false,
    interconnection: false,
    granularity: false,
    availability: true,
    data: false,
  },
  vcf: {
    assembly1: true,
    assembly2: false,
    interconnection: false,
    granularity: true,
    availability: false,
    data: true,
  },
};

export const defaultInputForFiles = {
  bed: {
    assembly1: "hg38",
    assembly2: "N.A.",
    interconnection: false,
    granularity: "Segment",
    availability: "Sparse",
    data: { quant: 1, cat: 0, text: 0 },
    fileType:"bed"
  },
  bedpe: {
    assembly1: "hg38",
    assembly2: "hg38",
    interconnection: true,
    granularity: "Segment",
    availability: "Sparse",
    data: { quant: 1, cat: 0, text: 0 },
    fileType:"bedpe"
  },
  bigwig: {
    assembly1: "hg38",
    assembly2: "N.A.",
    interconnection: false,
    granularity: "Point",
    availability: "Continous",
    data: { quant: 1, cat: 0, text: 0 },
    fileType:"bigwig"
  },
  cooler: {
    assembly1: "hg38",
    assembly2: "hg38",
    interconnection: true,
    granularity: "Segment",
    availability: "Continous",
    data: { quant: 1, cat: 0, text: 0 },
    fileType:"cooler"
  },
  seg: {
    assembly1: "hg38",
    assembly2: "N.A.",
    interconnection: false,
    granularity: "Segment",
    availability: "Sparse",
    data: { quant: 1, cat: 0, text: 0 },
    fileType:"seg"
  },
  vcf: {
    assembly1: "hg38",
    assembly2: "N.A.",
    interconnection: false,
    granularity: "Segment",
    availability: "Sparse",
    data: { quant: 1, cat: 0, text: 0 },
    fileType:"vcf"
  },
};

export const taskList = [
  { task: "singleroi", taskLabel: "Identify Single ROI", image: "singleroi.png", taskInfo:"You will need atleast 1 assembly build and 1 attribute.", disabled:true, minAssembly:1, minFeature:1 ,minAttr:1 },
  { task: "multipleroi", taskLabel: "Compare Multiple ROI", image: "multipleroi.png", taskInfo:"You will need atleast 1 assembly build and 1 attribute.",disabled:true, minAssembly:1,minFeature:1,minAttr:1 },
  { task: "multipleattributes", taskLabel: "Compare Multiple Attributes", image: "multipleattributes.png",taskInfo:"You will need atleast 1 assembly build and 2 attributes.",disabled:true, minAssembly:1,minFeature:1,minAttr:2 },
  { task: "multiplefeatures", taskLabel: "Compare Multiple Features", image: "multiplefeatures.png", taskInfo: "You will need atleast 1 assembly build and 2 features.",disabled:true,  minAssembly:1,minFeature:2,minAttr:1 },
  { task: "multiplesequences", taskLabel: "Compare Multiple Sequences", image: "multiplesequences.png", taskInfo: "You will need atleast 2 assembly builds.",disabled:true, minAssembly:2, minFeature:1, minAttr:1 },
  { task: "overview", taskLabel: "Explore Sequences", image: "summarize.png", taskInfo: "Default task which supports exploration of data.",disabled:false,minAssembly:1, minFeature:1, minAttr:1},
]
;

export default {
  inputFileFormats: inputFileFormats,
  colorScheme: colorScheme,
  fileInputFieldsActive: fileInputFieldsActive,
  defaultInputForFiles: defaultInputForFiles,
  taskList: taskList
};
