import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import imageOne from '../../images/imageOne.png';
import imageTwo from '../../images/imageTwo.png';

export const SidebarData = [
    {
        title: "Home", 
        icon: <HomeIcon />,
        link: "/",
        image: imageOne,
        description: 'Return Home'
    },
    {
        title: "General Analysis Analytics", 
        icon: <AnalyticsIcon />,
        link: "/GeneralAnalysis",
        image: imageTwo,
        description: 'general analysis'
    },
    {
        title: "Salesforce", 
        icon: <AnalyticsIcon />,
        link: "/Salesforce",
        image: imageOne,
        description: 'Salesforce data cleanup'
    },
    {
        title: "Affinia",
        icon: <AnalyticsIcon />,
        link: "/Affinia",
        image: imageTwo,
        description: "At home CKD test kit"
    },
    {
        title: "CE",
        icon: <AnalyticsIcon />,
        link: "/Ce",
        image: imageTwo,
        description: "CE"
    },
    {
        title: "TX Transplant",
        icon: <AnalyticsIcon />,
        link: "/TxTransplant",
        image: imageTwo,
        description: "TX TRNASPLANT"
    },
    {
        title: "Professional Membership",
        icon: <AnalyticsIcon />,
        link: "/Membership",
        image: imageTwo,
        description: "Professional Mmebership analysis and duplicate review of mmebers that need to be delete"
    },
    {
        title: "MO Pilot",
        icon: <AnalyticsIcon />,
        link: "/MoPilot",
        image: imageTwo,
        description: "MO Pilot project"
    },
    {
        title: "Project Echo",
        icon: <AnalyticsIcon />,
        link: "/ProjectEcho",
        image: imageTwo,
        description: "Project Echo"
    },
    {
        title: "BSOV ANALYTICS V4.4.1",
        icon: <AnalyticsIcon />,
        link: "/BsovAnalytics",
        image: imageTwo,
        description: "Practice Cards View Here"
    },
    {
        title: "Patient Portal",
        icon: <AnalyticsIcon />,
        link: "/PatientPortal",
        image: imageTwo,
        description: "Practice Cards View Here"
    },
    {
        title: "Standard Analysis",
        icon: <AnalyticsIcon />,
        link: "/StandardAnalysis",
        image: imageTwo,
        description: "General import and analytics page"
    },
    {
        title: "Information", 
        icon: <InfoIcon />,
        link: "/",
        image: imageTwo,
        description: 'information about the application'
    },
];