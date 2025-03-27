

require("dotenv").config();
const Sequelize = require("sequelize");
require('pg'); 
const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "postgres",
      port: 5432,
      dialectOptions: {
        ssl: { rejectUnauthorized: false },
      },
    }
  );
  
  const ProvinceOrTerritory = sequelize.define(
    "ProvinceOrTerritory",
    {
      code: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      type: Sequelize.STRING,
      region: Sequelize.STRING,
      capital: Sequelize.STRING,
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
  
  const Site = sequelize.define(
    "Site",
    {
      siteId: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      site: Sequelize.STRING,
      description: Sequelize.TEXT,
      date: Sequelize.INTEGER,
      dateType: Sequelize.STRING,
      image: Sequelize.STRING,
      location: Sequelize.STRING,
      latitude: Sequelize.FLOAT,
      longitude: Sequelize.FLOAT,
      designated: Sequelize.INTEGER,
      provinceOrTerritoryCode: Sequelize.STRING,
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
  
  Site.belongsTo(ProvinceOrTerritory, {
    foreignKey: "provinceOrTerritoryCode",
  });
  
function initialize() {
  return new Promise((resolve, reject) => {
    sequelize.sync().
    then(()=>resolve())
    .catch(err=>reject("No site retrieved"));
  });

}

function getAllSites() {
  return new Promise((resolve, reject) => {
    Site.findAll({include: [ProvinceOrTerritory]})
    .then(data=>resolve(data))
    .catch(err=>reject(err.message))
  });
}

function getSiteById(id) {

  return new Promise((resolve, reject) => {
   Site.findAll({
    include: [ProvinceOrTerritory],
    where:{siteId:id}
    }).then(data=>{
        if(data.length >0){
            resolve(data[0]);
        }else{
            reject("Unable to find requested sites");
        }
    }).catch(()=>reject("Unable to find requested sites"));
  });
}

function getSitesByProvinceOrTerritoryName(name) {
Site.findAll({
    include: [ProvinceOrTerritory], where: { 
        '$ProvinceOrTerritory.provinceOrTerritory$': {
          [Sequelize.Op.iLike]: `%${provinceOrTerritory}%`
        }
      }
       
}).then(data=>{
    if(data.length >0){
        resolve(data);
    }else{
        reject("Unable to find requested sites");
    }
}).catch(()=>reject("Unable to find requested sites"));
};

function getSitesByRegion(region) {
    return new Promise((resolve, reject) => {
      Site.findAll({
        include: [ProvinceOrTerritory],
        where: {
          "$ProvinceOrTerritory.region$": {
            [Sequelize.Op.iLike]: `%${region}%`
          }
        }
      }).then(data => {
        if (data.length > 0) {
          resolve(data);
        } else {
          reject("Unable to find requested sites");
        }
      }).catch(() => reject("Unable to find requested sites"));
    });
  }
  
  function addSite(siteData) {
    return new Promise((resolve, reject) => {
      Site.create(siteData)
        .then(() => resolve())
        .catch(err => reject(err.errors[0].message));
    });
  }
  
  function getAllProvincesAndTerritories() {
    return new Promise((resolve, reject) => {
      ProvinceOrTerritory.findAll()
        .then(data => resolve(data))
        .catch(() => reject("Unable to retrieve provinces/territories"));
    });
  }
  
  function editSite(id, siteData) {
    return new Promise((resolve, reject) => {
      Site.update(siteData, {
        where: { siteId: id }
      })
        .then(() => resolve())
        .catch(err => reject(err.errors[0].message));
    });
  }

  function deleteSite(id) {
    return new Promise((resolve, reject) => {
      Site.destroy({ where: { siteId: id } })
        .then(() => resolve())
        .catch(err => reject(err.errors[0].message));
    });
  }
  
  
module.exports = { initialize, getAllSites, getSiteById, getSitesByRegion,
   getSitesByProvinceOrTerritoryName,addSite,getAllProvincesAndTerritories 
  ,editSite,  deleteSite};


