/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: _____________Prabhleen Kaur_________ Student ID: _151653227_____________ Date: ____2025-03-11__________
*
*  Published URL:  
*
********************************************************************************/



const express = require("express");
const siteData = require("./modules/data-service");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Home Route
app.get("/", (req, res) => {
    res.render("home", { page: "/home" });
});

// About Route
app.get("/about", (req, res) => {
    res.render("about", { page: "/about" });
});

// Sites Route (Handles queries for region and provinceOrTerritory)
app.get("/sites", async (req, res) => {
    try {
        let sites;
        
        if (req.query.region) {

            sites = await siteData.getSitesByRegion(req.query.region);
            if (sites.length === 0) {
              throw new Error("I'm sorry, we're unable to find sites for the region you're looking for.");
            }

        } else if (req.query.provinceOrTerritory) {

            sites = await siteData.getSitesByProvinceOrTerritoryName(req.query.provinceOrTerritory);
            if (sites.length === 0) {
              throw new Error("I'm sorry, we're unable to find sites for province/territory you're looking for.");
            }

        } else {

            sites = await siteData.getAllSites();
            if (sites.length === 0) {
              throw new Error("I'm sorry,no site are found at this moment.");
            }

        }

        res.render("sites", { sites: sites });
    } catch (err) {
        res.status(404).render("404", { message: err.message });
    }
});

// Single Site Route by ID
app.get("/sites/:id", async (req, res) => {
    try {
        let site = await siteData.getSiteById(req.params.id);
        if (!site) {
            throw new Error("I'm Sorry, we couldn't find the site with the given ID.");
        }
        res.render("site", { site: site });
    } catch (err) {
        res.status(404).render("404", { message: err.message });
    }
});

// 404 Middleware for Undefined Routes
app.use((req, res, next) => {
    res.status(404).render("404", { message: "Page does not exist" });
});

// Initialize Data and Start Server
siteData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on port: ${HTTP_PORT}`);
    });
}).catch(err => {
    console.error("Failed to initialize data-service:", err);
});
