import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  BannerAdSize,
  BannerAdPosition,
} from "@capacitor-community/admob";

const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";

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
      adId: TEST_BANNER_ID,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 70,
      isTesting: true,
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