export const createInputSpec = function (dataDescription, taskList) {
  let localDataDescription = JSON.parse(dataDescription);

  //This code is currently for files with 1 assembly
  let fileIds = Object.keys(localDataDescription);
  let assemblyBuilds = {}; //===Sequences in our terminology
  let interconnection = {denseInterConnection:false,sparseInterConnection:false}


  fileIds.forEach((fileId) => {
    let inputConfigData = Object.assign({}, localDataDescription[fileId]);
    let featureDescription = `${inputConfigData["granularity"]}_${inputConfigData["availability"]}`;
    let assemblyBuildCounts = inputConfigData["assembly2"] === "N.A." ? 1 : 2;
    
    if(inputConfigData["fileType"] === "cooler" || inputConfigData["fileType"] === "bedpe")
    {interconnection = checkInterconnection(inputConfigData,featureDescription)}
  
    for (
      let assemblyIndex = 1;
      assemblyIndex <= assemblyBuildCounts;
      assemblyIndex++
    ) {
      if (
        typeof assemblyBuilds[inputConfigData["assembly" + assemblyIndex]] ===
        "undefined"
      ) {
        assemblyBuilds[inputConfigData["assembly" + assemblyIndex]] = {};
        //add features
        assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][
          featureDescription
        ] = {};
        //add attributes
        assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][
          featureDescription
        ]["attributes"] = {};
        assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][
          featureDescription
        ]["attributes"] = inputConfigData["data"];
      } else {
        //check features
        if (
          typeof assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][
            featureDescription
          ] === "undefined"
        ) {
          assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][
            featureDescription
          ] = {};
          assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][
            featureDescription
          ]["attributes"] = {};
          assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][
            featureDescription
          ]["attributes"] = inputConfigData["data"];
        } else {
          let inputAttrCounts = inputConfigData["data"];
          let attrs =
            assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][
              featureDescription
            ]["attributes"];

          Object.keys(attrs).map((key) => {
            return (attrs[key] += inputAttrCounts[key]);
          });
        }
      }
    }
  });

  let recommendationInputSpec = specStructure(assemblyBuilds,interconnection);
  activateTasks(taskList, assemblyBuilds);
  console.log(recommendationInputSpec)
  return recommendationInputSpec
};

function specStructure(assemblyBuilds,interconnection) {

  let sequences = []
  let intraSequenceTask = {"connectedNodes":[],"sequenceConservation":[],"edgeValues":[]}
  let denseConnection = interconnection.denseInterConnection
  let sparseConnection = interconnection.sparseInterConnection


  Object.keys(assemblyBuilds).map((val, index) => {
    sequences.push(
        getSequences(val, index, assemblyBuilds[val],interconnection)
    );
  });

return {sequences,intraSequenceTask,denseConnection,sparseConnection};
}

function getSequences(seqName, seqid, data,featureConnection) {
  let sequenceId = "sequence_" + seqid;
  let sequenceName = seqName;
  let interFeatureTasks = { compare: [], correlate: [] };
  let features = Object.keys(data).map((featureName,index) => getFeatures(index,featureName,data[featureName],featureConnection));
  return { sequenceId, sequenceName, interFeatureTasks, features };
}

function getFeatures(fId,fName,data,featureConnection) {
  let featureId ="feature_"+fId;
  let featureGranularity = fName.split("_")[0].toLowerCase() ;
  let featureDensity = fName.split("_")[1].toLowerCase() ;
  let featureLabel = fName;
  let featureInterconnection = featureConnection[fName] !== undefined ? featureConnection[fName].featureInterconnection:false;
  let denseInterconnection = featureConnection[fName] !== undefined ? featureConnection[fName].featureInterconnectionDense:false ;
  let intraFeatureTasks = [];
  let interactivity = true;
  let attr = [] 
  let globalAttrIndex = 0
  Object.keys(data["attributes"]).map((attributeType) => {
    
    for(let i=0;i<data["attributes"][attributeType];i++){
        attr.push(getAttributes(globalAttrIndex,attributeType))
        globalAttrIndex++
    }
    //getAttributes(attributeType)

  })
  
  return {featureId,featureGranularity,featureDensity,featureLabel,featureInterconnection,denseInterconnection,intraFeatureTasks,interactivity,attr}
}

function getAttributes(id,type)
{
    let dataTypeMapping = {"quant":"quantitative","cat":"categorical","text":"text"}
    let attrId = "attribute_"+id;
    let dataType = dataTypeMapping[type];
    let intraAttrTask = ["identify","compare"]

    return {attrId,dataType,intraAttrTask}
}

function activateTasks(taskList, assemblyBuilds) {
  let assemblies = Object.keys(assemblyBuilds);
  let attributes = [];
  let features = assemblies.map((val) => {
    var keys = Object.keys(assemblyBuilds[val]);
    keys.forEach((feature) => {
      attributes.push(assemblyBuilds[val][feature]);
    });
    return keys;
  });
  let assemblyCount = assemblies.length;
  let featureCountMax = features.reduce(
    (r, e) => (r = r.length > e.length ? r.length : e.length),
    []
  );
  let attributeCountMax = Math.max(
    ...attributes.map(
      (val) =>
        val["attributes"]["quant"] +
        val["attributes"]["cat"] +
        val["attributes"]["text"]
    )
  );

  taskList.forEach((task) => {
    let taskAssemblyReq = task["minAssembly"];
    let featureReq = task["minFeature"];
    let attributeReq = task["minAttr"];

    if(assemblyCount>=taskAssemblyReq && featureCountMax>=featureReq && attributeCountMax>=attributeReq) 
    {task["disabled"] = false}
    else{
        task["disabled"] = true
    }
  });
}

function checkInterconnection (inputConfigData,featureDescription)
{
  let denseInterConnection = false
  let sparseInterConnection = false
  let featureInterconnection = false
  let featureInterconnectionDense = false

  if(inputConfigData["fileType"] === "cooler"  && (inputConfigData["assembly1"]!==inputConfigData["assembly2"])) {
    denseInterConnection = true
  }
  else if(inputConfigData["fileType"] === "cooler"){
    featureInterconnection = true
    featureInterconnectionDense =true
  }
  else{
    featureInterconnection = false
    featureInterconnectionDense = false
  }
  if(inputConfigData["fileType"] === "bedpe" && inputConfigData["interconnection"] && (inputConfigData["assembly1"]!==inputConfigData["assembly2"])) {
    sparseInterConnection = true
  }
  else if(inputConfigData["fileType"] === "bedpe" && inputConfigData["interconnection"]){
    featureInterconnection = true
    featureInterconnectionDense =false
  }
  else{
    featureInterconnection = false
    featureInterconnectionDense = false
  }
  
  return {denseInterConnection,sparseInterConnection,[featureDescription]:{featureInterconnection,featureInterconnectionDense}}
}
