//BEDPE Complex Case
//DONE.......If BEDPE has network, then it will be a single track with intraconnection. 
//If BEDPE Multiple tracks then the network should only be first track
//Done....If BEDPE has no network then it will be a two different tracks with the same coordinates
//BEDPE should have not have different assemblies


export const createInputSpec = function (dataDescription, taskList) {
  let localDataDescription = JSON.parse(dataDescription);

  //This code is currently for files with 1 assembly
  let fileIds = Object.keys(localDataDescription);
  let assemblyBuilds = {}; //===Sequences in our terminology
  let interconnection = {denseInterConnection:false,sparseInterConnection:false, connectionType:"none"};

  fileIds.forEach((fileId) => {
    const inputConfigData = Object.assign({}, localDataDescription[fileId]);
    const inputConfigDataCopyForFileAttr = JSON.parse(JSON.stringify(localDataDescription[fileId]));
    let featureDescription = `${inputConfigData["granularity"]}_${inputConfigData["availability"]}`;
    let assemblyBuildCounts = inputConfigData["assembly2"] === "N.A." ? 1 : 2;
  

    if(inputConfigData["fileType"] === "cooler" || inputConfigData["fileType"] === "bedpe")
    {interconnection = checkInterconnection(inputConfigData,featureDescription)}
  
    for ( let assemblyIndex = 1; assemblyIndex <= assemblyBuildCounts; assemblyIndex++) 
    {
      if ( typeof assemblyBuilds[inputConfigData["assembly" + assemblyIndex]] === "undefined") 
      {
        assemblyBuilds[inputConfigData["assembly" + assemblyIndex]] = {};
        //add features
        assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription] = {};
        //add attributes
        assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription]["attributes"] = {};
        assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription]["attributes"] = inputConfigData["data"];
        //add filewise attributes
        assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription][fileId]= {}
        assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription][fileId]= inputConfigDataCopyForFileAttr["data"];
      } else {
        //check features
        if (
          typeof assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription] === "undefined"
        ) {
          assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription] = {};
          assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][
            featureDescription
          ]["attributes"] = {};
          assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][
            featureDescription
          ]["attributes"] = inputConfigData["data"];
          //add filewise attributes
        assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription][fileId]= {}
        assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription][fileId]= inputConfigDataCopyForFileAttr["data"];
        } 
        else {
          //Summing up the variables
          let inputAttrCounts = inputConfigData["data"];
          let attrs = assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription]["attributes"];
          Object.keys(attrs).map((key) => {
            return (attrs[key] += inputAttrCounts[key]);
          });
          //add filewise attributes
          //This may fail, try out!
          assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription][fileId]= {}
         
          //Special Case for BEDPE Files with no network connection
          if(inputConfigData["interconnection"])
          assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription][fileId]= inputConfigDataCopyForFileAttr["data"];
          else
          assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription][fileId]= inputConfigData["data"];

        }
      }
    }
  });

  console.log("Assembly Builds",assemblyBuilds);

  let recommendationInputSpec = specStructure(assemblyBuilds,interconnection);
  activateTasks(taskList, assemblyBuilds);
  console.log("InputSpec",recommendationInputSpec);
  return recommendationInputSpec;
};

function specStructure(assemblyBuilds,interconnection) {

  let sequences = [];
  let intraSequenceTask = {"connectedNodes":[],"sequenceConservation":[],"edgeValues":[]};
  let denseConnection = interconnection.denseInterConnection;
  let sparseConnection = interconnection.sparseInterConnection;
  let connectionType = interconnection.connectionType;
  //Need to populate these variables
  let tasks = [];
  let geneAnnotation = true;
  let ideogramDisplayed = true;

  Object.keys(assemblyBuilds).map((val, index) => {
    sequences.push(
        getSequences(val, index, assemblyBuilds[val],interconnection)
    );
  });

return {sequences,intraSequenceTask,denseConnection,sparseConnection,connectionType,tasks,geneAnnotation,ideogramDisplayed};
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
  let attr = [];
  let globalAttrIndex = 0;

  console.log("Current data we are focussing",data);

  // Object.keys(data["attributes"]).map((attributeType) => {
  //   for(let i=0;i<data["attributes"][attributeType];i++){
  //       attr.push(getAttributes(globalAttrIndex,attributeType,featureConnection,fName))
  //       globalAttrIndex++
  //   }
  //})

  const copyVarofDataWithAttr = JSON.parse(JSON.stringify(data));
  delete copyVarofDataWithAttr.attributes;
  console.log("Print all keys except attributes", copyVarofDataWithAttr);
  const copyVarofDataWithAttrKeys = Object.keys(copyVarofDataWithAttr);

  copyVarofDataWithAttrKeys.forEach(keyVal =>{
    Object.keys(copyVarofDataWithAttr[keyVal]).forEach((attributeType)=>{
      for(let i=0;i<copyVarofDataWithAttr[keyVal][attributeType];i++){
        let localFeatureInterconnection = false;
        let localDenseInterconnection = false;
        if(featureInterconnection && i===0)
        {
          localFeatureInterconnection = featureInterconnection;
          localDenseInterconnection = denseInterconnection;
        }
        attr.push(getAttributes(globalAttrIndex,attributeType,localFeatureInterconnection,localDenseInterconnection,fName,keyVal,attributeType+i))
        globalAttrIndex++
    }
    })
  })

  return {featureId,featureGranularity,featureDensity,featureLabel,featureInterconnection,denseInterconnection,intraFeatureTasks,interactivity,attr}
}

function getAttributes(id,type,featureInterconnectionIp,denseInterconnectionIp,fName,fileNameInput,encodingNameInput)
{
    let dataTypeMapping = {"quant":"quantitative","cat":"categorical","text":"text"}
    let attrId = "attribute_"+id;
    let dataType = dataTypeMapping[type];
    let intraAttrTask = [];
    let featureInterconnection = featureInterconnectionIp;
    let denseInterconnection = denseInterconnectionIp;
    let fileName = fileNameInput;
    let encodingName = encodingNameInput;

    if(dataType==="quantitative") intraAttrTask.push("identify");
    else intraAttrTask.push("identify");

    return {attrId,dataType,intraAttrTask,featureInterconnection,denseInterconnection,fileName,encodingName}
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
  let connectionType = "none";

  if(inputConfigData["fileType"] === "cooler")
  {
      if(inputConfigData["fileType"] === "cooler"  && (inputConfigData["assembly1"]!==inputConfigData["assembly2"])) {
        denseInterConnection = true
        connectionType = "dense"
      }
      else
      {
        featureInterconnection = true
        featureInterconnectionDense =true
      }
  }

  if(inputConfigData["fileType"] === "bedpe")
  {
      if(inputConfigData["fileType"] === "bedpe" && inputConfigData["interconnection"] && (inputConfigData["assembly1"]!==inputConfigData["assembly2"])) {
        sparseInterConnection = true
        connectionType = "sparse"
      }
      else if(inputConfigData["fileType"] === "bedpe" && inputConfigData["interconnection"]){
        featureInterconnection = true
        featureInterconnectionDense =false
      }
      else{
        featureInterconnection = false
        featureInterconnectionDense = false
      }
  }
  
  // console.log({denseInterConnection,sparseInterConnection,[featureDescription]:{featureInterconnection,featureInterconnectionDense}})
  return {denseInterConnection,sparseInterConnection,[featureDescription]:{featureInterconnection,featureInterconnectionDense}, connectionType}
}
