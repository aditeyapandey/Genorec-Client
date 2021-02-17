export const inputFileFormats = {
  bed: 0 ,
  bedpe: 0,
  bigwig: 0,
  cooler: 0,
  seg: 0,
  vcf: 0,
};

export const colorScheme = {
  bed: "w3-deep-orange" ,
  bedpe: "w3-teal",
  bigwig: "w3-khaki",
  cooler: "w3-cyan",
  seg: "w3-amber",
  vcf: "w3-blue-gray",
}

export const fileInputFieldsActive = {
  bed: {
    assembly1:true,
    assembly2:false,
    interconnection:false,
    granularity:false,
    availability:false,
    data:true
  } ,
  bedpe: {
    assembly1:true,
    assembly2:true,
    interconnection:true,
    granularity:false,
    availability:false,
    data:true
  },
  bigwig: {
    assembly1:true,
    assembly2:false,
    interconnection:false,
    granularity:true,
    availability:false,
    data:false
  },
  cooler: {
    assembly1:true,
    assembly2:true,
    interconnection:false,
    granularity:true,
    availability:false,
    data:false
  },
  seg: {
    assembly1:true,
    assembly2:false,
    interconnection:false,
    granularity:true,
    availability:false,
    data:false
  },
  vcf: {
    assembly1:true,
    assembly2:false,
    interconnection:false,
    granularity:true,
    availability:false,
    data:true
  }
}

export default { inputFileFormats: inputFileFormats, colorScheme:colorScheme, fileInputFieldsActive:fileInputFieldsActive };
