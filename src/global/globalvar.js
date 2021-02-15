export const inputFileFormats = {
  bed: 0 ,
  bedpe: 0,
  bigwig: 0,
  cooler: 0,
  seg: 0,
  vcf: 0,
};

export const colorScheme = {
  bed: "w3-pale-red" ,
  bedpe: "w3-pale-green",
  bigwig: "w3-pale-yellow",
  cooler: "w3-pale-blue",
  seg: "w3-amber",
  vcf: "w3-blue-gray",
}

export const fileInputFieldsActive = {
  bed: {
    assembly1:true,
    assembly2:false,
    interconnection:false,
    point: false,
    segment:true,
    continous:false,
    quant: true,
    categorical: true,
    text:true
  } ,
  bedpe: {
    assembly1:true,
    assembly2:true,
    interconnection:true,
    point: false,
    segment:true,
    continous:false,
    quant: true,
    categorical: true,
    text:true
  },
  bigwig: 0,
  cooler: 0,
  seg: 0,
  vcf: 0,
}

export default { inputFileFormats: inputFileFormats, colorScheme:colorScheme, fileInputFieldsActive:fileInputFieldsActive };
