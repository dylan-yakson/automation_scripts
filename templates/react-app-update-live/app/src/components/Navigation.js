import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Drawer from "@material-ui/core/Drawer";
import MDButton from "components/MDButton";

import { useIsAuthenticated } from "@azure/msal-react";
// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";
import SignInBasic from "layouts/authentication/sign-in/signin";

import { SignOutButton } from "./SignOutButton";

// logo
// import KPlogo from "../images/KP_LOGO5.png";
import KPlogo from "assets/images/bg-sign-in-basic.jpeg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  full_nav: {
    padding: "3px",
    paddingBottom: "5px",
    textAlign: "center",
    color: "white",
    backgroundColor: "black",
    height: "100%",
    minHeight: "100vh",
  },
  mobile_nav: {
    textAlign: "center",
    padding: "3px",
    paddingBottom: "5px",
    color: "green",
    // textShadow: '1px 1px 1px rgb(255,255,255)',
    backgroundColor: "black",
    height: "100%",
    width: "100%",
  },
}));

export default function Navigation() {
  const classes = useStyles();
  const isAuthenticated = useIsAuthenticated();

  // for MobileNav
  const [drawerState, setDrawerState] = useState(false);
  // for Link
  const [myLink, setMyLink] = useState(null);

  const [hoveredOver, setHoveredOver] = useState("none");

  useEffect(() => {
    console.log("Linked");
  }, [setMyLink]);

  const fullNav = () => (
    <Grid className={classes.full_nav} item xs={12}>
      {myLink}
      <Paper elevation={1} style={{ padding: "5px", backgroundColor: "#999999", height: "100%" }}>
        <Grid container spacing={0}>
          <Grid item xs={12} style={{ paddingBottom: "10px" }}>
            <img src={KPlogo} width="50" height="50" />
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              fontSize: "16px",
              letterSpacing: "4px",
              fontWeight: 700,
              textShadow: "1px 1px 15px #105D15",
            }}
          >
            KEY PERFORMANCE
          </Grid>
          <Grid item xs={12} style={{ paddingTop: "40px" }}>
            <Grid
              container
              spacing={0}
              style={{ fontFamily: "'Lato', sans-serif", fontSize: "20px" }}
            >
              <Grid
                item
                xs={12}
                onClick={() => setMyLink(<Link to="/home" />)}
                onMouseEnter={() => setHoveredOver("home")}
                onMouseLeave={() => setHoveredOver("none")}
                style={{
                  padding: "5px",
                  paddingTop: "10px",
                  paddingBottom: "15px",
                  backgroundColor: hoveredOver == "home" ? "rgba(91,53,13,.8)" : "#999999",
                  color: hoveredOver == "home" ? "white" : "black",
                }}
              >
                HOME
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={8} style={{ backgroundColor: "black", height: "1px" }} />
              <Grid item xs={2} />
              <Grid
                item
                xs={12}
                onClick={() => setMyLink(<Link to="/newOrder" />)}
                onMouseEnter={() => setHoveredOver("newOrder")}
                onMouseLeave={() => setHoveredOver("none")}
                style={{
                  padding: "5px",
                  paddingTop: "10px",
                  backgroundColor: hoveredOver == "newOrder" ? "rgba(218,12,12,.8)" : "#999999",
                  color: hoveredOver == "newOrder" ? "white" : "black",
                }}
              >
                NEW ORDER
              </Grid>
              <Grid
                item
                xs={12}
                onClick={() => setMyLink(<Link to="/newQuote" />)}
                onMouseEnter={() => setHoveredOver("newQuote")}
                onMouseLeave={() => setHoveredOver("none")}
                style={{
                  padding: "5px",
                  paddingBottom: "10px",
                  backgroundColor: hoveredOver == "newQuote" ? "rgba(218,12,12,.8)" : "#999999",
                  color: hoveredOver == "newQuote" ? "white" : "black",
                }}
              >
                NEW QUOTE
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={8} style={{ backgroundColor: "black", height: "1px" }} />
              <Grid item xs={2} />
              <Grid
                item
                xs={12}
                onClick={() => setMyLink(<Link to="/warehouse" />)}
                onMouseEnter={() => setHoveredOver("warehouse")}
                onMouseLeave={() => setHoveredOver("none")}
                style={{
                  padding: "5px",
                  paddingTop: "10px",
                  backgroundColor: hoveredOver == "warehouse" ? "rgba(9,129,16,.8)" : "#999999",
                  color: hoveredOver == "warehouse" ? "white" : "black",
                }}
              >
                WAREHOUSE
              </Grid>
              <Grid
                item
                xs={12}
                onClick={() => setMyLink(<Link to="/allFuel" />)}
                onMouseEnter={() => setHoveredOver("allFuel")}
                onMouseLeave={() => setHoveredOver("none")}
                style={{
                  padding: "5px",
                  paddingBottom: "10px",
                  backgroundColor: hoveredOver == "allFuel" ? "rgba(206,178,5,.8)" : "#999999",
                  color: hoveredOver == "allFuel" ? "white" : "black",
                }}
              >
                ALL FUEL
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={8} style={{ backgroundColor: "black", height: "1px" }} />
              <Grid item xs={2} />
              {/* <Grid item xs={12} onClick={()=>setMyLink(<Link to="/newCustomer" />)} onMouseEnter={()=>setHoveredOver('newCustomer')} onMouseLeave={()=>setHoveredOver('none')} style={{ padding: '5px', paddingTop: '5px', paddingBottom: '15px', backgroundColor: hoveredOver == 'newCustomer' ? 'rgba(176,11,252,.8)' : '#999999', color: hoveredOver == 'newCustomer' ? 'white' : 'black' }}>
                                CUSTOMERS
                            </Grid> */}
              <Grid item xs={2} />
              <Grid item xs={8} style={{ backgroundColor: "black", height: "1px" }} />
              <Grid item xs={2} />

              <Grid item xs={12} style={{ paddingTop: "50px" }}>
                {isAuthenticated ? <SignOutButton /> : <SignInBasic />}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
  const mobileNav = () => (
    <Grid item xs={12} style={{ backgroundColor: "#999999" }}>
      {myLink}
      <MDButton onClick={() => setDrawerState(true)}>
        <img src={KPlogo} width="50" height="50" />
      </MDButton>
      <Drawer anchor="top" open={drawerState} onClose={() => setDrawerState(false)}>
        <div
          className={classes.mobile_nav}
          style={{ fontFamily: "'Lato', sans-serif", fontSize: "20px" }}
        >
          <Paper
            style={{ padding: "5px", backgroundColor: "#999999", height: "100%", width: "100%" }}
          >
            <Grid container spacing={0}>
              <Grid
                item
                xs={12}
                onClick={() => {
                  setMyLink(<Link to="/home" />);
                  setDrawerState(false);
                }}
                onMouseEnter={() => setHoveredOver("home")}
                onMouseLeave={() => setHoveredOver("none")}
                style={{
                  padding: "5px",
                  paddingTop: "10px",
                  paddingBottom: "15px",
                  backgroundColor: hoveredOver == "home" ? "rgba(91,53,13,.8)" : "#999999",
                  color: hoveredOver == "home" ? "white" : "black",
                }}
              >
                HOME
              </Grid>
              <Grid item xs={4} />
              <Grid item xs={4} style={{ backgroundColor: "black", height: "1px" }} />
              <Grid item xs={4} />
              <Grid
                item
                xs={12}
                onClick={() => {
                  setMyLink(<Link to="/newOrder" />);
                  setDrawerState(false);
                }}
                onMouseEnter={() => setHoveredOver("newOrder")}
                onMouseLeave={() => setHoveredOver("none")}
                style={{
                  padding: "5px",
                  paddingTop: "15px",
                  backgroundColor: hoveredOver == "newOrder" ? "rgba(218,12,12,.8)" : "#999999",
                  color: hoveredOver == "newOrder" ? "white" : "black",
                }}
              >
                NEW ORDER
              </Grid>
              <Grid
                item
                xs={12}
                onClick={() => {
                  setMyLink(<Link to="/newQuote" />);
                  setDrawerState(false);
                }}
                onMouseEnter={() => setHoveredOver("newQuote")}
                onMouseLeave={() => setHoveredOver("none")}
                style={{
                  padding: "5px",
                  paddingBottom: "15px",
                  backgroundColor: hoveredOver == "newQuote" ? "rgba(218,12,12,.8)" : "#999999",
                  color: hoveredOver == "newQuote" ? "white" : "black",
                }}
              >
                NEW QUOTE
              </Grid>
              <Grid item xs={4} />
              <Grid item xs={4} style={{ backgroundColor: "black", height: "1px" }} />
              <Grid item xs={4} />
              <Grid
                item
                xs={12}
                onClick={() => {
                  setMyLink(<Link to="/warehouse" />);
                  setDrawerState(false);
                }}
                onMouseEnter={() => setHoveredOver("warehouse")}
                onMouseLeave={() => setHoveredOver("none")}
                style={{
                  padding: "5px",
                  paddingTop: "15px",
                  backgroundColor: hoveredOver == "warehouse" ? "rgba(9,129,16,.8)" : "#999999",
                  color: hoveredOver == "warehouse" ? "white" : "black",
                }}
              >
                WAREHOUSE
              </Grid>
              <Grid
                item
                xs={12}
                onClick={() => {
                  setMyLink(<Link to="/allFuel" />);
                  setDrawerState(false);
                }}
                onMouseEnter={() => setHoveredOver("allFuel")}
                onMouseLeave={() => setHoveredOver("none")}
                style={{
                  padding: "5px",
                  paddingBottom: "15px",
                  backgroundColor: hoveredOver == "allFuel" ? "rgba(206,178,5,.8)" : "#999999",
                  color: hoveredOver == "allFuel" ? "white" : "black",
                }}
              >
                ALL FUEL
              </Grid>
              <Grid item xs={4} />
              <Grid item xs={4} style={{ backgroundColor: "black", height: "1px" }} />
              <Grid item xs={4} />
              <Grid
                item
                xs={12}
                onClick={() => {
                  setMyLink(<Link to="/analytics" />);
                  setDrawerState(false);
                }}
                onMouseEnter={() => setHoveredOver("analytics")}
                onMouseLeave={() => setHoveredOver("none")}
                style={{
                  padding: "5px",
                  paddingTop: "15px",
                  paddingBottom: "15px",
                  backgroundColor: hoveredOver == "analytics" ? "rgba(8,148,168,.8)" : "#999999",
                  color: hoveredOver == "analytics" ? "white" : "black",
                }}
              >
                ANALYTICS
              </Grid>
              {/* <Grid item xs={12} onClick={()=>{setMyLink(<Link to="/newCustomer" />);setDrawerState(false);}} onMouseEnter={()=>setHoveredOver('newCustomer')} onMouseLeave={()=>setHoveredOver('none')} style={{ padding: '5px', paddingTop: '5px', paddingBottom: '15px', backgroundColor: hoveredOver == 'newCustomer' ? 'rgba(176,11,252,.8)' : '#999999', color: hoveredOver == 'newCustomer' ? 'white' : 'black' }}>
                                CUSTOMERS
                            </Grid> */}
              <Grid item xs={4} />
              <Grid item xs={4} style={{ backgroundColor: "black", height: "1px" }} />
              <Grid item xs={4} />
              <Grid item xs={12} style={{ height: "20px" }} />
              <Grid
                item
                xs={12}
                onClick={() => setDrawerState(false)}
                style={{ fontSize: "20px", fontWeight: 800 }}
              >
                X
              </Grid>
            </Grid>
          </Paper>
        </div>
      </Drawer>
    </Grid>
  );

  return window.screen.width > 500 ? fullNav() : mobileNav();
}
