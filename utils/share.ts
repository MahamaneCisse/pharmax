import { Share, Alert } from "react-native";

export const shareApp = async () => {
  try {
    const result = await Share.share({
      message:
        "Salut ! Découvre Pharmax une super application pour localiser les pharmacies à proximité. Télécharge-la ici : https://monapp.link",
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log("Partagé via :", result.activityType);
      } else {
        console.log("Lien partagé !");
      }
    } else if (result.action === Share.dismissedAction) {
      console.log("Partage annulé");
    }
  } catch (error: any) {
    Alert.alert("Erreur", "Impossible de partager le lien");
    console.error(error.message);
  }
};
