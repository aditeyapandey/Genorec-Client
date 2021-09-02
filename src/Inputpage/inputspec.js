//BEDPE Complex Case
//DONE.......If BEDPE has network, then it will be a single track with intraconnection. 
//If BEDPE Multiple tracks then the network should only be first track
//Done....If BEDPE has no network then it will be a two different tracks with the same coordinates
//BEDPE should have not have different assemblies

//COOLER Complex Case
//It should not have any variables that will be represented as tracks associated with it.



export const createInputSpec = function (dataDescription, taskList, selectedTask, geneAnnotation = true, ideogramDisplayed = false) {

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
    {interconnection = checkInterconnection(inputConfigData,featureDescription);}
  
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
        assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription][fileId]= {};
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
          assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription][fileId]= {};
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
          assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription][fileId]= {};
          assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription][fileId]= inputConfigDataCopyForFileAttr["data"];

                   
          //Special Case for BEDPE, if there is no network then the attributes are duplicated as seperate tracks
          if(!inputConfigData["interconnection"] && inputConfigData["fileType"]==="bedpe")
          {
            // assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription][fileId] = inputConfigDataCopyForFileAttr["data"];
            let tempAttr = assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription][fileId];
            let localKeys = Object.keys(tempAttr);
            let updatedTempAttr = {};
            localKeys.forEach(key=>{updatedTempAttr[key] = tempAttr[key]*2;});
            assemblyBuilds[inputConfigData["assembly" + assemblyIndex]][featureDescription][fileId] = updatedTempAttr;
          }

        }
      }
    }
  });


  let recommendationInputSpec = specStructure(assemblyBuilds,interconnection,selectedTask,geneAnnotation, ideogramDisplayed);
  activateTasks(taskList, assemblyBuilds);
  console.log("InputSpec",recommendationInputSpec);
  return recommendationInputSpec;
};

function specStructure(assemblyBuilds,interconnection,selectedTask,geneAnnotationInput, ideogramDisplayedInput) {

  let sequences = [];
  let intraSequenceTask = {"connectedNodes":[],"sequenceConservation":[],"edgeValues":[]};
  let denseConnection = interconnection.denseInterConnection;
  let sparseConnection = interconnection.sparseInterConnection;
  let connectionType = interconnection.connectionType;
  //Need to populate these variables
  let tasks = [selectedTask];
  let geneAnnotation = geneAnnotationInput;
  let ideogramDisplayed = ideogramDisplayedInput;

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
  let features = [];
  Object.keys(data).forEach((featureName,index) => {
    let returnedFeature = getFeatures(index,featureName,data[featureName],featureConnection);
    if(returnedFeature!=="undefined")
    {features.push(returnedFeature);}
  });

  return { sequenceId, sequenceName, interFeatureTasks, features };
}

function getFeatures(fId,fName,data,featureConnection) {
  
  
  let featureId ="feature_"+fId;
  let featureGranularity = fName.split("_")[0].toLowerCase();
  let featureDensity = fName.split("_")[1].toLowerCase() ;
  let featureLabel = fName;
  let featureInterconnection = featureConnection[fName] !== undefined ? featureConnection[fName].featureInterconnection:false;
  let denseInterconnection = featureConnection[fName] !== undefined ? featureConnection[fName].featureInterconnectionDense:false ;
  let intraFeatureTasks = [];
  let interactivity = true;
  let attr = [];
  let globalAttrIndex = 0;

  //Checking if a data attribute has been added
  if(data["attributes"]["quant"]===0 && data["attributes"]["cat"]===0 && data["attributes"]["text"]===0)
  {
    return "undefined";
  }
  else
  {
    const copyVarofDataWithAttr = JSON.parse(JSON.stringify(data));
    delete copyVarofDataWithAttr.attributes;
    const copyVarofDataWithAttrKeys = Object.keys(copyVarofDataWithAttr);
    let interConnectionSet = false;

    copyVarofDataWithAttrKeys.forEach(keyVal =>{
      Object.keys(copyVarofDataWithAttr[keyVal]).forEach((attributeType)=>{
        for(let i=1;i<=copyVarofDataWithAttr[keyVal][attributeType];i++)
        {
          //Notes: check attribute for each to see if we can 
          let localFeatureInterconnection = false;
          let localDenseInterconnection = false;
          if(featureInterconnection && keyVal.includes("bedpe") && !interConnectionSet)
          {
            localFeatureInterconnection = featureInterconnection;
            localDenseInterconnection = denseInterconnection;
            interConnectionSet = true;
          }

          attr.push(getAttributes(globalAttrIndex,attributeType,localFeatureInterconnection,localDenseInterconnection,fName,keyVal,attributeType+i));
          globalAttrIndex++;
        }
      });
    });

    return {featureId,featureGranularity,featureDensity,featureLabel,featureInterconnection,denseInterconnection,intraFeatureTasks,interactivity,attr};
  }

}

function getAttributes(id,type,featureInterconnectionIp,denseInterconnectionIp,fName,fileNameInput,encodingNameInput)
{
  console.log("Input to attr variable", id,type,featureInterconnectionIp,denseInterconnectionIp,fName,fileNameInput.toUpperCase(),encodingNameInput);
  let dataTypeMapping = {"quant":"quantitative","cat":"categorical","text":"text"};
  let attrId = "attribute_"+id;
  let dataType = dataTypeMapping[type];
  let intraAttrTask = [];
  let featureInterconnection = featureInterconnectionIp; 
  let denseInterconnection = denseInterconnectionIp; 
  let fileName = fileNameInput.toUpperCase();
  let encodingName = encodingNameInput.toUpperCase();

  if(dataType==="quantitative") intraAttrTask.push("identify");
  else intraAttrTask.push("identify");

  return {attrId,dataType,intraAttrTask,featureInterconnection,denseInterconnection,fileName,encodingName};
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
    {task["disabled"] = false;}
    else{
      task["disabled"] = true;
    }
  });
}

function checkInterconnection (inputConfigData,featureDescription)
{
  let denseInterConnection = false;
  let sparseInterConnection = false;
  let featureInterconnection = false;
  let featureInterconnectionDense = false;
  let connectionType = "none";

  //Cooler file format should have interconnection
  if(inputConfigData["fileType"] === "cooler")
  {
           
    denseInterConnection = true;
    connectionType = "dense";
  }

  if(inputConfigData["fileType"] === "bedpe")
  {
    if(inputConfigData["fileType"] === "bedpe" && inputConfigData["interconnection"] && (inputConfigData["assembly1"]!==inputConfigData["assembly2"])) {
      sparseInterConnection = true;
      connectionType = "sparse";
    }
    else if(inputConfigData["fileType"] === "bedpe" && inputConfigData["interconnection"]){
      featureInterconnection = true;
      featureInterconnectionDense =false;
    }
    else{
      featureInterconnection = false;
      featureInterconnectionDense = false;
    }
  }
  
  // console.log({denseInterConnection,sparseInterConnection,[featureDescription]:{featureInterconnection,featureInterconnectionDense}})
  return {denseInterConnection,sparseInterConnection,[featureDescription]:{featureInterconnection,featureInterconnectionDense}, connectionType};
}
