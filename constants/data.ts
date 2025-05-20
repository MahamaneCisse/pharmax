import icons from "./icons";
import { shareApp } from "@/utils/share";

export const settings = [
  {
    title: "Mon compte",
    icon: icons.person,
    onPress: () => console.log("EditProfile"),
  },
  {
    title: "Notifications",
    icon: icons.bell,
    onPress: () => console.log("Notifications"),
  },
  {
    title: "Sécurité",
    icon: icons.shield,
    onPress: () => console.log("Sécurité"),
  },
  {
    title: "Langue",
    icon: icons.language,
    onPress: () => console.log("Changer de langue"),
  },
  {
    title: "Centre d'aide",
    icon: icons.info,
    onPress: () => console.log("Centre d'aide"),
  },
  {
    title: "Inviter un ami",
    icon: icons.people,
    onPress: shareApp,
  },
];
