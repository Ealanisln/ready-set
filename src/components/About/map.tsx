import { Component } from "react";

import Head from "next/head";
import Script from "next/script";

export default class StreetView extends Component {
    componentDidMount() {
        window.googleMapsDidInitialize = this.googleMapsDidInitialize;
    };

    googleMapsDidInitialize() {
        const mapElement = document.getElementById("map");
        const panoramaElement = document.getElementById("pano");

        const fenway = {
            lat: 42.345573,
            lng: -71.098326
        };

        const map = new google.maps.Map(mapElement, {
            center: fenway,
            zoom: 14
        });

        const panorama = new google.maps.StreetViewPanorama(panoramaElement, {
            position: fenway,

            pov: {
                heading: 34,
                pitch: 10,
            }
        });

        map.setStreetView(panorama);
    };

    render() {
        return (
            <div style={{ height: "100%" }}>
                <Head>
                    <title>Street View</title>

                    <style>
                        {`
                            html,
                            body {
                                height: 100%;
                                margin: 0;
                                padding: 0;
                            }
                            #__next,
                            main {
                                height: 100%;
                            }
                            #map,
                            #pano {
                                float: left;
                                height: 100%;
                                width: 50%;
                            }
                        `}
                    </style>
                </Head>

                <main>
                    <div id="map"></div>
                    <div id="pano"></div>
                </main>

                <Script src="https://polyfill.io/v3/polyfill.min.js?features=default"/>
                <Script src="https://maps.googleapis.com/maps/api/js?key=API_KEY&callback=googleMapsDidInitialize&v=weekly" defer/>
            </div>
        );
    };
};