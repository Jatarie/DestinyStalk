
const express = require('express');
const router = express.Router();
const fs = require('fs');
var path = require('path');

var recipeData;
var auctionData;

router.get('/', (req, res) => {
    recipeData = JSON.parse(fs.readFileSync(__dirname + "/data.json"));
    auctionData = fs.readFileSync("D:\\World of Warcraft\\_classic_\\WTF\\Account\\108778585#1\\SavedVariables\\Auctionator.lua").toString();
    auctionData = auctionDataToJSON();
    Object.keys(recipeData).map(x => auctionCosts(recipeData[x]))
    Object.keys(recipeData).map(x => calcMatCosts(recipeData[x]))
    // fs.writeFileSync("cache.json", JSON.stringify(recipeData));
    // var data = JSON.parse(fs.readFileSync("cache.json"));
    return res.send({ "data": recipeData });
})

function auctionDataToJSON() {
    var RX1 = /(?<=AUCTIONATOR_PRICE_DATABASE =).+?(?=AUCTIONATOR)/gms
    var RX2 = /[\[\]]/gms
    var RX3 = /=/gms
    var RX4 = /(?<=\d|\"),[\t\r\n]+(?=})/gms
    var RX5 = /(?<=}),[\t\n\r]+(?=})/gms
    auctionData = auctionData.match(RX1)[0];
    auctionData = auctionData.replace(RX2, "");
    auctionData = auctionData.replace(RX3, ":");
    auctionData = auctionData.replace(RX4, "");
    auctionData = auctionData.replace(RX5, "");
    fs.writeFileSync("test.json", auctionData.toString())
    auctionData = JSON.parse(auctionData);
    return { "data": auctionData["Flamelash_Alliance"] };
}

function auctionCosts(recipe) {
    if (Object.keys(auctionData["data"]).includes(recipe["name"])) {
        recipe["auctionCostPer"] = auctionData["data"][recipe["name"]]["mr"];
        recipe["auctionCostTotal"] = auctionData["data"][recipe["name"]]["mr"] * recipe["quantity"];
    }
    else {
        recipe["auctionCostPer"] = null;
        recipe["auctionCostTotal"] = null;
    }
    if (Object.keys(recipe).includes("materials")) {
        Object.keys(recipe["materials"]).map(x => {
            if (recipe["name"] == "Silverleaf") {

            }
            auctionCosts(recipe["materials"][x])
        })
    }
}

function matCosts(material) {
    var matCost = 0;
    var craftCost = 0;
    if (Object.keys(material).includes("materials")) {
        Object.keys(material["materials"]).map(x => {
            if (Object.keys(material["materials"][x]).includes("materials")) {
                if (material["materials"][x]["auctionCostTotal"] != null) {
                    craftCost += Math.min(material["materials"][x]["auctionCostTotal"], material["materials"][x]["matCost"], material["materials"][x]["craftCost"])
                }
                else {
                    craftCost += Math.min(material["materials"][x]["matCost"], material["materials"][x]["craftCost"])
                }
            }
            else {
                if (material["materials"][x]["auctionCostTotal"] != null) {
                    craftCost += Math.min(material["materials"][x]["auctionCostTotal"], material["materials"][x]["matCost"])
                }
                else {
                    craftCost += material["materials"][x]["matCost"]
                }
            }
        })
        material["craftCost"] = craftCost;
    }
    if (material["isPurchasable"]) {
        if (material["auctionCostPer"] != null) {
            matCost += Math.min(material["auctionCostPer"], material["vendorBuyPrice"]) * material["quantity"];
        }
        else {
            matCost += material["vendorBuyPrice"] * material["quantity"];
        }
    }
    else {
        if (material["auctionCostPer"] != null) {
            matCost = material["auctionCostTotal"]
        }
        else {
            matCost = null;
        }
    }
    material["matCost"] = matCost;
}

function calcMatCosts(recipe) {
    if (recipe["name"] == "Goblin Rocket Boots") {
        console.log("hey");
    }
    if (Object.keys(recipe).includes("materials")) {
        Object.keys(recipe["materials"]).map(x => calcMatCosts(recipe["materials"][x]))
    }
    matCosts(recipe)
}


module.exports = router;