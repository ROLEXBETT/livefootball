import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  BannerAdSize,
  BannerAdPosition,
} from "@capacitor-community/admob";

const BANNER_ID = "ca-app-pub-4998749451565889/9086882054";

export async function initializeAdMob() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await AdMob.initialize();
    console.log("AdMob initialized");
  } catch (error) {
    console.error("AdMob init error:", error);
  }
}

export async function showBannerAd() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await AdMob.showBanner({
      adId: BANNER_ID,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 70,
      isTesting: false,
    });

    console.log("AdMob banner shown");
  } catch (error) {
    console.error("AdMob banner error:", error);
  }
}

export async function hideBannerAd() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await AdMob.hideBanner();
  } catch (error) {
    console.error("AdMob hide banner error:", error);
  }
}