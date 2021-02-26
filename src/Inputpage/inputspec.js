export const createInputSpec = function (dataDescription, taskList) {
  let localDataDescription = JSON.parse(dataDescription);

  //This code is currently for files with 1 assembly
  let fileIds = Object.keys(localDataDescription);
  let assemblyBuilds = {}; //===Sequences in our terminology

  fileIds.forEach((fileId) => {
    let inputConfigData = Object.assign({}, localDataDescription[fileId]);
    let featureDescription = `${inputConfigData["granularity"]}_${inputConfigData["availability"]}`;
    let assemblyBuildCounts = inputConfigData["assembly2"] === "N.A." ? 1 : 2;

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

  console.log(assemblyBuilds);
  specStructure(assemblyBuilds);
  activateTasks(taskList, assemblyBuilds);
};

function specStructure(assemblyBuilds) {
  let dataspec = { sequences: [] };

  Object.keys(assemblyBuilds).map((val, index) => {
    return dataspec["sequences"].push(
      sequences(val, index, assemblyBuilds[val])
    );
  });

  console.log(dataspec);
}

function sequences(seqName, seqid, data) {
  let sequenceId = "sequence_" + seqid;
  let sequenceName = seqName;
  let interFeatureTasks = { compare: [], correlate: [] };
  let features = [];
  return { sequenceId, sequenceName, interFeatureTasks, features };
}

function features() {
  let featureId;
  let featureGranularity;
  let featureDensity;
  let featureLabel;
  let featureInterconnection;
  let denseInterconnection;
  let intraFeatureTasks = [];
  let interactivity;
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
