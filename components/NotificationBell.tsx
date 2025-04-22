import type { ViewStyle } from 'react-native';

import React, { useState, useRef } from 'react';
import { FONTS, COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import ConditionalComponent from './ConditionalComponent';

interface NotificationType {
  key: string;
  color: string;
  emoji: string;
}

interface Notification {
  id: string;
  type: string;
  subject: string;
  message: string;
  time: string;
  read: boolean;
  archived: boolean;
  favorite: boolean;
}

interface NotificationBellProps {
  style?: ViewStyle;
  onGoBack?: () => void;
}

type TabKey = "all" | "unread" | "read" | "favorite" | "archive";

type Nav = {
  navigate: (value: string) => void;
};

const NOTIFICATION_TYPES = {
  SUCCESS: { key: 'SUCCESS', color: '#28a745', emoji: '🎉' },
  INFO: { key: 'INFO', color: '#0275d8', emoji: '📚' },
  WARNING: { key: 'WARNING', color: '#ffa500', emoji: '💪' },
  ALERT: { key: 'ALERT', color: '#dc3545', emoji: '📆' }
};

// Combined notification data
const notificationsData: Notification[] = [
  { id: "1",  type: "Progrès", subject: "Tu as atteint 80% de progrès en mathématiques.", message: "Bravo ! Tu as terminé ton exercice avec succès 🎉", time: "2 min", read: false, archived: false, favorite: false },
  { id: "2",  type: "Rappels", subject: "N'oublie pas de terminer les exercices de maths d'aujourd'hui.", message: "N'oublie pas de finir ton exercice de mathématiques 📚", time: "5 min", read: true, archived: false, favorite: false },
  { id: "3",  type: "Rappels", subject: "Nouveau défi : Géométrie disponible dans ton profil.", message: "Continue comme ça ! Chaque petit effort compte 💪", time: "12 min", read: false, archived: false, favorite: true },
  { id: "4",  type: "Mises à jour", subject: "La version 2.3.0 a été publiée ce matin.", message: "L'échéance de ton devoir est dans 2 jours ! 📆", time: "45 min", read: false, archived: true, favorite: false },
  { id: "5",  type: "Message", subject: "Ton prof a envoyé un message.", message: "Pense à réviser les fractions pour demain", time: "1 h", read: false, archived: false, favorite: false },
  { id: "6",  type: "Rappels", subject: "Tu es à 5 000 XP pour débloquer le prochain niveau.", message: "Continue à travailler dur !", time: "2 h", read: true, archived: false, favorite: false },
  { id: "7",  type: "Progrès", subject: "Chapitre 4 complété ! Félicitations.", message: "Excellente progression cette semaine", time: "3 h", read: true, archived: false, favorite: true },
  { id: "8",  type: "Conseils", subject: "Astuce : pratique 15 minutes par jour pour consolider tes compétences.", message: "Une routine quotidienne est importante", time: "4 h", read: false, archived: false, favorite: false },
  { id: "9",  type: "Trophée", subject: "Tu as obtenu le trophée 'Champion de calcul'.", message: "Continue de t'améliorer !", time: "5 h", read: true, archived: true, favorite: false },
  { id: "10", type: "Rappels", subject: "N'oublie pas ton exercice de français.", message: "Il reste 4 questions à compléter", time: "6 h", read: true, archived: true, favorite: false },
  { id: "11", type: "Progrès", subject: "Tu as maîtrisé la multiplication à deux chiffres !", message: "Super ! Tu progresses rapidement", time: "8 h", read: false, archived: false, favorite: false },
  { id: "12", type: "Rappels", subject: "Pense à réviser avant ton test de demain.", message: "Le test portera sur les chapitres 5 et 6", time: "12 h", read: true, archived: false, favorite: false },
  { id: "13", type: "Défi", subject: "Nouveau défi disponible : Les équations.", message: "Essaie de le terminer cette semaine", time: "18 h", read: false, archived: false, favorite: true },
  { id: "14", type: "Mises à jour", subject: "Maintenance prévue demain à 02h00.", message: "L'application sera indisponible pendant une heure", time: "22 h", read: true, archived: true, favorite: false },
  { id: "15", type: "Trophée", subject: "10 nouveaux trophées disponibles.", message: "Découvre-les dans ton profil", time: "1 j", read: false, archived: false, favorite: false },
  { id: "16", type: "Progrès", subject: "Score hebdomadaire : 92%.", message: "Tu fais du bon travail !", time: "1 j", read: true, archived: false, favorite: false },
  { id: "17", type: "Événement", subject: "Concours de mathématiques le 25 avril.", message: "Inscris-toi dans l'onglet événements", time: "2 j", read: false, archived: false, favorite: false },
  { id: "18", type: "Message", subject: "Message de ton professeur.", message: "N'oublie pas d'apporter ton livre demain", time: "2 j", read: true, archived: true, favorite: false },
  { id: "19", type: "Trophée", subject: "Félicitations ! Tu as gagné le trophée « Champion ».", message: "Continue sur cette lancée !", time: "3 j", read: false, archived: false, favorite: true },
  { id: "20", type: "Mises à jour", subject: "Nouveau mode hors‑ligne disponible.", message: "Tu peux maintenant étudier sans connexion", time: "3 j", read: false, archived: false, favorite: false },
  { id: "21", type: "Message", subject: "Ton parent a laissé un commentaire.", message: "Continue comme ça, on est fiers de toi !", time: "4 j", read: true, archived: false, favorite: false },
  { id: "22", type: "Progrès", subject: "100% au dernier quiz ! Bravo.", message: "Tu as tout compris sur les fractions", time: "4 j", read: false, archived: false, favorite: true },
  { id: "23", type: "Rappels", subject: "Test de niveau disponible cette semaine.", message: "Prépare-toi bien !", time: "5 j", read: false, archived: false, favorite: false },
  { id: "24", type: "Défi", subject: "Tu as terminé le défi hebdomadaire.", message: "Nouveau record personnel !", time: "5 j", read: true, archived: true, favorite: false },
  { id: "25", type: "Événement", subject: "Aide aux devoirs disponible ce soir.", message: "Connecte-toi à 18h si tu as besoin d'aide", time: "1 sem", read: false, archived: false, favorite: false },
  { id: "26", type: "Progrès", subject: "Tu es dans le top 10% de ta classe !", message: "Continue ton excellent travail", time: "1 sem", read: true, archived: false, favorite: true },
  { id: "27", type: "Message", subject: "Nouveau message du professeur principal.", message: "La réunion de classe est reportée à vendredi", time: "1 sem", read: false, archived: false, favorite: false },
];


const MENU_WIDTH = 200;    // match whatever width you use
const SCREEN_MARGIN = 8;   // minimum gap from screen edges
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const pageSize = 10;

const NotificationBell: React.FC<NotificationBellProps> = ({ style, onGoBack }) => {
  const navigation = useNavigation();
  const { dark, colors } = useTheme();
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { navigate } = useNavigation<Nav>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Notification | null>(null);
  const rawLeft = menuPosition.x - MENU_WIDTH / 2;
  const clampedLeft = Math.min(
    Math.max(rawLeft, SCREEN_MARGIN),
    SCREEN_WIDTH - MENU_WIDTH - SCREEN_MARGIN
  );
  const [page, setPage] = useState(1);
  const [headerMenuVisible, setHeaderMenuVisible] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const toggleHeaderMenu = () => setHeaderMenuVisible(v => !v);
  const toggleNotifications = () => setIsVisible(v => !v);
  
  const updateItem = (id: string, changes: Partial<Notification>) => {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, ...changes } : n));
    setSelectedItem(null);
  };

  const counts: Record<TabKey, number> = {
    all: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    read: notifications.filter(n => n.read).length,
    favorite: notifications.filter(n => n.favorite).length,
    archive: notifications.filter(n => n.archived).length,
  };

  const filtered = notifications.filter(n => {
    if (activeTab === "unread" && n.read) return false;
    if (activeTab === "read" && !n.read) return false;
    if (activeTab === "favorite" && !n.favorite) return false;
    if (activeTab === "archive" && !n.archived) return false;
    if (search && !n.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const renderBell = () => (
    <TouchableOpacity
      style={[styles.bellContainer, style]}
      onPress={toggleNotifications}
    >
      <Ionicons
        name="notifications"
        size={24}
        color={dark ? COLORS.white : COLORS.greyscale900}
      />

      <ConditionalComponent isValid={unreadCount>0}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
        </View>
      </ConditionalComponent>

    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          onPress={() => setIsVisible(false)}
          style={styles.actionButton}
        >
          <Feather
            name="arrow-left"
            size={24}
            color={dark ? COLORS.white : COLORS.black}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dark ? COLORS.white : COLORS.black }]}>
          Notifications
        </Text>
      </View>
      <TouchableOpacity onPress={toggleHeaderMenu} style={styles.actionButton}>
        <FontAwesome name="ellipsis-v" size={20} color={dark ? COLORS.white : COLORS.black} />
      </TouchableOpacity>
      <Modal transparent visible={headerMenuVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={toggleHeaderMenu}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.headerMenuContainer, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            onPress={() => {
              const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
              setNotifications(updatedNotifications);
              toggleHeaderMenu();
            }}
            style={styles.headerMenuItem}
          >
            <FontAwesome name="check" size={16} style={styles.menuIcon} />
            <Text style={styles.menuText}>Tout marquer comme lu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setNotifications([]); toggleHeaderMenu(); }}
            style={styles.headerMenuItem}
          >
            <FontAwesome name="trash" size={16} style={styles.menuIcon} />
            <Text style={styles.menuText}>Tout supprimer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );

  const renderSearch = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={[styles.searchInput, { backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale100 }]}
        placeholder="Rechercher dans les notifications"
        placeholderTextColor={COLORS.gray}
        value={search}
        onChangeText={t => { setSearch(t); setPage(1); }}
      />
    </View>
  );

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all",      label: "Tous"    },
    { key: "unread",   label: "Non lu"  },
    { key: "read",     label: "Lu"      },
    { key: "favorite", label: "Favoris" },
    { key: "archive",  label: "Archivé" },
  ];

  const renderTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.tabsContainer}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        const count = counts[tab.key];
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => { setActiveTab(tab.key); setPage(1); }}
            style={[
              styles.tabButton,
              isActive ? styles.tabButtonActive : styles.tabButtonInactive
            ]}
          >
            <View style={styles.tabContentContainer}>
              <Text 
                style={[
                  styles.tabText,
                  isActive ? styles.tabTextActive : styles.tabTextInactive
                ]}
              >
                {tab.label}
              </Text>
              <Text 
                style={[
                  styles.tabCountText,
                  isActive ? styles.tabCountTextActive : styles.tabCountTextInactive
                ]}
              >
                {count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const formatTimeAgo = (timeStr: string) => {
    const v = parseInt(timeStr, 10);
    if (timeStr.includes("min")) return `Il y a ${v} minute${v > 1 ? "s" : ""}`;
    if (timeStr.includes("h"))   return `Il y a ${v} heure${v > 1 ? "s" : ""}`;
    if (timeStr.includes("j"))   return `Il y a ${v} jour${v > 1 ? "s" : ""}`;
    if (timeStr.includes("sem")) return `Il y a ${v} semaine${v > 1 ? "s" : ""}`;
    return timeStr;
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={styles.notificationRow}>
      <View
        style={[
          styles.notificationCard,
          { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
        ]}
      >
        <View style={styles.notificationContent}>
          <Text
            style={[
              styles.notificationType,
              { color: dark ? COLORS.gray : COLORS.greyscale900 },
            ]}
          >
            {item.type}
          </Text>
          <Text
            style={[
              styles.notificationSubject,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            {item.subject}
          </Text>
          <Text
            style={[
              styles.notificationTime,
              { color: dark ? COLORS.gray : COLORS.grayscale400 },
            ]}
          >
            {formatTimeAgo(item.time)}
          </Text>
        </View>
        <View style={styles.metaAndMenu}>
          {!item.read && <View style={styles.unreadDot} />}
          <TouchableOpacity
            onPressIn={e => {
              const { pageX, pageY } = e.nativeEvent;
              setMenuPosition({ x: pageX, y: pageY });
            }}
            onPress={() => setSelectedItem(item)}
            style={styles.itemMenuButton}
          >
            <FontAwesome
              name="ellipsis-v"
              size={16}
              color={dark ? COLORS.white : COLORS.black}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderItemMenu = () => (
    <Modal transparent visible={!!selectedItem} animationType="fade">
      <TouchableWithoutFeedback onPress={() => setSelectedItem(null)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <ConditionalComponent isValid={Boolean(selectedItem)}>
      <View
          style={[
            styles.menuContainer,
            {
              backgroundColor: colors.background,
              top: menuPosition.y,
              left: clampedLeft,
              width: MENU_WIDTH,
            },
          ]}
        >
          <TouchableOpacity
              onPress={() => selectedItem?.id && updateItem(selectedItem.id, { read: !selectedItem.read })}
            style={styles.menuItem}
          >
            <FontAwesome name="envelope-open" size={16} style={styles.menuIcon} />
            <Text style={styles.menuText}>
              {selectedItem && (selectedItem.read ? "Marquer non lu" : "Marquer lu")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => {
            if (selectedItem) {
              updateItem(selectedItem.id, { favorite: !selectedItem.favorite });
            }
          }}
          style={styles.menuItem}
          >
            <FontAwesome name="star" size={16} style={styles.menuIcon} />
            <Text style={styles.menuText}>
            {selectedItem && (selectedItem.favorite ? "Retirer favori" : "Ajouter favori")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (selectedItem) {
                updateItem(selectedItem.id, { archived: !selectedItem.archived });
              }
            }}
            style={styles.menuItem}
          >
            <FontAwesome name="archive" size={16} style={styles.menuIcon} />
            <Text style={styles.menuText}>
            {selectedItem && (selectedItem.archived ? "Désarchiver" : "Archiver")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (selectedItem) {
                setNotifications(ns => ns.filter(n => n.id !== selectedItem.id));
              }
            }}
            style={[styles.menuItem, { borderTopWidth: 1, borderColor: COLORS.gray }]}
          >
            <FontAwesome name="trash" size={16} color={COLORS.error} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: COLORS.error }]}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </ConditionalComponent>
        
    </Modal>
  );

  const renderPagination = () =>
    <ConditionalComponent isValid={totalPages > 1}>
      <View style={styles.paginationContainer}>
        <TouchableOpacity disabled={page === 1} onPress={() => setPage(page - 1)}>
          <Feather name="chevron-left" size={20} color={page === 1 ? COLORS.gray : COLORS.black} />
        </TouchableOpacity>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <TouchableOpacity key={p} onPress={() => setPage(p)}>
            <View style={[styles.pageNumber, page === p && styles.activePageNumber]}>
              <Text style={page === p ? styles.activePageText : styles.pageText}>{p}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity disabled={page === totalPages} onPress={() => setPage(page + 1)}>
          <Feather
            name="chevron-right"
            size={20}
            color={page === totalPages ? COLORS.gray : COLORS.black}
          />
        </TouchableOpacity>
      </View>
    </ConditionalComponent>
      

  return (
    <>
      {renderBell()}
      <Modal
        visible={isVisible}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
          {renderHeader()}
          {renderSearch()}
          {renderTabs()}
          <FlatList
            data={paged}
            keyExtractor={i => i.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={renderPagination}
          />
          {renderItemMenu()}
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Bell Component
  bellContainer: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Header
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: { 
    ...FONTS.h2,
    marginLeft: 8,
  },
  actionButton: { padding: 8 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  headerMenuContainer: {
    position: "absolute",
    top: 56,
    right: 16,
    borderRadius: 8,
    elevation: 4,
    paddingVertical: 8,
    width: 200,
  },
  headerMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuIcon: { marginRight: 12 },
  menuText: { fontSize: 14, fontFamily: "medium" },

  // Search
  searchContainer: { paddingHorizontal: 16, marginBottom: 8 },
  searchInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: "regular",
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'visible',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    height: 40,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabButtonInactive: {
    backgroundColor: COLORS.greyscale100,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
  },
  tabContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'medium',
    marginRight: 6,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  tabTextInactive: {
    color: COLORS.greyscale900,
  },
  tabCountText: {
    fontSize: 12,
    fontFamily: 'medium',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    textAlign: 'center',
  },
  tabCountTextActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    color: COLORS.white,
  },
  tabCountTextInactive: {
    backgroundColor: COLORS.gray,
    color: COLORS.white,
  },

  // Notification Items
  notificationRow: { paddingHorizontal: 16 },
  notificationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  notificationContent: { flex: 1 },
  notificationType: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  notificationSubject: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.greyscale600,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: "medium",
    marginTop: 4,
  },
  metaAndMenu: { flexDirection: "row", alignItems: "center" },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  itemMenuButton: { padding: 4 },

  // Item Menu
  menuContainer: {
    position: "absolute",
    borderRadius: 8,
    elevation: 4,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  // Pagination
  listContent: { paddingBottom: 24 },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  pageNumber: {
    marginHorizontal: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  activePageNumber: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pageText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.black,
  },
  activePageText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white,
  },
});

export default NotificationBell;