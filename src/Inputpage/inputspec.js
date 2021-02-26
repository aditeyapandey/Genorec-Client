export const createInputSpec = function (dataDescription){

let localDataDescription = JSON.parse(dataDescription)

//This code is currently for files with 1 assembly
let fileIds = Object.keys(localDataDescription)
let assemblyBuilds = {} //===Sequences in our terminology

fileIds.forEach((fileId) => {
    let inputConfigData = Object.assign({}, localDataDescription[fileId]) 
    let featureDescription = `${inputConfigData["granularity"]}_${inputConfigData["availability"]}`

    let assemblyBuildCounts = inputConfigData["assembly2"] === "N.A." ? 1:2

    for(let assemblyIndex=1;assemblyIndex<=assemblyBuildCounts;assemblyIndex++)
    {
    if(typeof assemblyBuilds[inputConfigData["assembly"+assemblyIndex]] === 'undefined')
    {
        assemblyBuilds[inputConfigData["assembly"+assemblyIndex]] = {}
        //check features
        if(typeof assemblyBuilds[inputConfigData["assembly"+assemblyIndex]][featureDescription] === 'undefined')
        {
            assemblyBuilds[inputConfigData["assembly"+assemblyIndex]][featureDescription] = {} 
            
            //Check attributes
            if(typeof assemblyBuilds[inputConfigData["assembly"+assemblyIndex]][featureDescription]["attributes"] === 'undefined')
            {
                assemblyBuilds[inputConfigData["assembly"+assemblyIndex]][featureDescription]["attributes"] = {}
                assemblyBuilds[inputConfigData["assembly"+assemblyIndex]][featureDescription]["attributes"] = inputConfigData["data"]
            }
             
        }
        else
        {
           let inputAttrCounts = inputConfigData["data"];
           let attrs = assemblyBuilds[inputConfigData["assembly"+assemblyIndex]][featureDescription]["attributes"]
           
          Object.keys(attrs).map((key) => {
           return attrs[key] += inputAttrCounts[key];
          });
        }

    }
    else{
        //check features
        if(typeof assemblyBuilds[inputConfigData["assembly"+assemblyIndex]][featureDescription] === 'undefined')
        {
            assemblyBuilds[inputConfigData["assembly"+assemblyIndex]][featureDescription] = {} 
            
            //Check attributes
            if(typeof assemblyBuilds[inputConfigData["assembly"+assemblyIndex]][featureDescription]["attributes"] === 'undefined')
            {
                assemblyBuilds[inputConfigData["assembly"+assemblyIndex]][featureDescription]["attributes"] ={}
                assemblyBuilds[inputConfigData["assembly"+assemblyIndex]][featureDescription]["attributes"] = inputConfigData["data"]
            }
             
        }
        else 
        {
            let inputAttrCounts = inputConfigData["data"];
            let attrs = assemblyBuilds[inputConfigData["assembly"+assemblyIndex]][featureDescription]["attributes"]
            
            Object.keys(attrs).map((key) => {
               return attrs[key] += inputAttrCounts[key]
            });
         }
        }
    }
})

//This is just a test
console.log(assemblyBuilds)
}

