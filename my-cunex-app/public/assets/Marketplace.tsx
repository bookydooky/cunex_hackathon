"use client";

import IconButton from "@mui/material/IconButton";
import React from "react";
import CUNEXLogo from "../../assets/CUNEX-logo.png";
import batteryFull from "../../assets/battery-full.svg";
import cloudSun from "../../assets/cloud-sun.svg";
import fluentFood20Regular from "../../assets/fluent-food-20-regular.svg";
import hugeiconsPackageMoving from "../../assets/hugeicons-package-moving.svg";
import icon from "../../assets/icon.svg";
import image1 from "../../assets/image-1.png";
import mageBox3D from "../../assets/mage-box-3d.svg";
import materialSymbolsLightStylusLaserPointer from "../../assets/material-symbols-light-stylus-laser-pointer.svg";
import rectangle2 from "../../assets/rectangle-2.png";
import signal from "../../assets/signal.png";
import uilPlus from "../../assets/uil-plus.svg";
import wifi from "../../assets/wifi.svg";
import { BxsSchool } from "../BxsSchool/BxsSchool";
import { FaSolidMobileAlt } from "../FaSolidMobileAlt/FaSolidMobileAlt";
import { FluentPayment } from "../FluentPayment/FluentPayment";
import { IcBaselineHome } from "../IcBaselineHome/IcBaselineHome";
import { MaterialSymbols } from "../MaterialSymbols/MaterialSymbols";
import { MdiHelp } from "../MdiHelp/MdiHelp";
import { RiQrCodeFill } from "../RiQrCodeFill/RiQrCodeFill";
import { SolarChartBold } from "../SolarChartBold/SolarChartBold";
import { TablerBook } from "../TablerBook/TablerBook";
import { UisSchedule } from "../UisSchedule/UisSchedule";
import "../../styles/Marketplace.css";

export const Marketplace = (): JSX.Element => {
  return (
    <div className="marketplace">
      <header className="header">
        <span className="time">14:40</span>
        <img className="status-icon" alt="Battery full" src={batteryFull} />
        <img className="status-icon" alt="Wifi" src={wifi} />
        <img className="status-icon" alt="Signal" src={signal} />
      </header>

      <main className="content">
        <img className="logo" alt="CUNEX logo" src={CUNEXLogo} />

        <div className="search-bar">
          <input type="text" placeholder="What are you looking for?" />
          <IconButton color="default" size="medium">
            <img className="icon" alt="Search" src={icon} />
          </IconButton>
        </div>

        <section className="location-weather">
          <span>Chulalongkorn University</span>
          <span>27°C</span>
          <img className="weather-icon" alt="Cloud sun" src={cloudSun} />
        </section>

        <section className="quick-menu">
          <MdiHelp />
          <FluentPayment />
          <UisSchedule />
          <SolarChartBold />
          <TablerBook />
          <BxsSchool />
          <MaterialSymbols />
          <FaSolidMobileAlt />
        </section>

        <section className="request-services">
          <h2>Request Services</h2>
          <div className="services">
            <div className="service">
              <img alt="Item Delivery" src={hugeiconsPackageMoving} />
              <span>Item Delivery</span>
            </div>
            <div className="service">
              <img alt="Food Delivery" src={fluentFood20Regular} />
              <span>Food Delivery</span>
            </div>
            <div className="service">
              <img alt="3D Printing" src={mageBox3D} />
              <span>3D Printing</span>
            </div>
            <div className="service">
              <img
                alt="Laser Cutting"
                src={materialSymbolsLightStylusLaserPointer}
              />
              <span>Laser Cutting</span>
            </div>
          </div>
        </section>

        <section className="latest-jobs">
          <h2>Latest Jobs</h2>
          <div className="jobs">
            <div className="job">
              <img alt="Add job" src={uilPlus} />
              <span>Add your job!</span>
            </div>
            <div className="job">
              <img alt="Logo Design" src={rectangle2} />
              <span>Logo Design</span>
            </div>
            <div className="job">
              <img alt="Video Editing" src={image1} />
              <span>Video Editing</span>
            </div>
            <div className="job">
              <img alt="Math Tutoring" src={image1} />
              <span>Math Tutoring</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <IcBaselineHome />
        <RiQrCodeFill />
        <span>Home</span>
        <span>Calendar</span>
        <span>Digital ID</span>
        <span>K PLUS</span>
        <span>CU FASTWORK</span>
      </footer>
    </div>
  );
};
