import {
  Client,
  Account,
  ID,
  Databases,
  OAuthProvider,
  Avatars,
  Query,
  Storage,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import * as Location from "expo-location";
import { getDistance } from "geolib";

export const config = {
  platform: "com.abasco.native",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  pharmaciesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_PHARMACIES_COLLECTIONS_ID,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTIONS_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");
    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!response) throw new Error("failed to login");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success") throw new Error("failed to login");
    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("failed to login");
    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("failed to create session");
    await createUserIfNotExists();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function loginWithApple() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Apple,
      redirectUri
    );
    if (!response)
      throw new Error("Échec lors de la création du token OAuth Apple");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success")
      throw new Error("Échec de la session OAuth Apple");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Session Apple invalide");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Échec lors de la création de session Apple");

    return true;
  } catch (error) {
    console.error("Apple login error:", error);
    return false;
  }
}

export async function logout() {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const response = await account.get();
    if (response.$id) {
      const userAvatar = avatar.getInitials(response.name);
      return {
        ...response,
        avatar: userAvatar.toString(),
      };
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getPharmacies({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "Toutes")
      buildQuery.push(Query.equal("commune", filter));

    if (query)
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("ville", query),
          Query.search("commune", query),
        ])
      );

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.pharmaciesCollectionId!,
      buildQuery
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPharmaciesById({ id }: { id: string }) {
  try {
    const result = await databases.getDocument(
      config.databaseId!,
      config.pharmaciesCollectionId!,
      id
    );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createUserIfNotExists() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Utilisateur non authentifié");

    const query = [Query.equal("userId", user.$id)];

    const result = await databases.listDocuments(
      config.databaseId!,
      config.userCollectionId!,
      query
    );

    if (result.documents.length === 0) {
      await databases.createDocument(
        config.databaseId!,
        config.userCollectionId!,
        ID.unique(),
        {
          userId: user.$id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }
      );
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
    return false;
  }
}

export async function getNearbyPharmacies(): Promise<any[]> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permission de localisation refusée");
      return [];
    }

    const userLocation = await Location.getCurrentPositionAsync({});
    const { latitude: userLat, longitude: userLon } = userLocation.coords;

    const result = await databases.listDocuments(
      config.databaseId!,
      config.pharmaciesCollectionId!,
      [Query.limit(100)] // Tu peux ajuster ce nombre selon ton besoin
    );

    const pharmaciesWithDistance = result.documents
      .map((pharmacy) => {
        const pharmacyLat = pharmacy.latitude;
        const pharmacyLon = pharmacy.longitude;

        if (
          typeof pharmacyLat !== "number" ||
          typeof pharmacyLon !== "number"
        ) {
          return null;
        }

        const distance = getDistanceFromLatLonInKm(
          userLat,
          userLon,
          pharmacyLat,
          pharmacyLon
        );

        return {
          ...pharmacy,
          distance,
        };
      })
      .filter(Boolean) // retire les null
      .sort((a, b) => {
        if (!a || !b) return 0;
        return a.distance - b.distance;
      }); // tri par distance

    return pharmaciesWithDistance;
  } catch (error) {
    console.error("Erreur getNearbyPharmacies:", error);
    return [];
  }
}

// Fonction utilitaire pour calculer la distance entre deux coordonnées
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la terre en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
