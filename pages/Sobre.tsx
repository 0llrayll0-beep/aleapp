import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Animated,
  ImageBackground,
  StatusBar,
  Platform,
  useWindowDimensions,
  ScrollView,
  SafeAreaView,
  Linking,
} from 'react-native';

// Paleta (mesma do Login/Cadastro)
const T = {
  bg: '#141412',
  surface: '#1D1C1A',
  surfaceRaised: '#252422',
  ink: '#EAE8E3',
  inkMid: '#9A9590',
  inkLight: '#5A5752',
  rule: '#2E2C29',
  accent: '#3D5A6C',
  cta: '#D4845A',
  danger: '#B36B6A',
  success: '#5A8C6B',
  placeholderInner: '#302D2A',
  closeBtnText: '#141412',
};

// Dados do app
const APP_INFO = {
  nome: 'app maroto',
  versao: '1.7.1',
  descricao: 'Um aplicativo para colecionadores e entusiastas de automóveis. Organize, descubra e compartilhe sua paixão por carros com uma comunidade de apaixonados por velocidade, design e engenharia automotiva.',
  desenvolvedor: 'equipe adoramos o alê',
  ano: '2026',
  email: 'contato@adoramos_o_ale.com',
  website: 'https://adoramos_o_ale.com',
  tecnologias: [
    'React Native',
    'TypeScript',
    'Expo',
    'AsyncStorage',
    'Node.js',
    'Express',
  ],
  features: [
    ' Tema claro/escuro',
    ' Catálogo de carros clássicos e modernos',
    ' Adicione seus próprios carros com fotos',
    ' Compartilhe com a comunidade',
    ' Filtros por categoria',
    ' Persistência local de dados',
    ' Sistema de autenticação',
  ],
};

export default function SobreScreen({ navigation }: { navigation: any }) {
  const { width: W } = useWindowDimensions();
  const s = (v: number) => Math.round((v / 390) * W);
  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  // Animações
  const fadeOverlay = useRef(new Animated.Value(0)).current;
  const fadeBadge = useRef(new Animated.Value(0)).current;
  const slideBadge = useRef(new Animated.Value(-16)).current;
  const fadeContent = useRef(new Animated.Value(0)).current;
  const slideContent = useRef(new Animated.Value(24)).current;
  const fadeVersion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeOverlay, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeBadge, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideBadge, { toValue: 0, speed: 18, bounciness: 5, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeContent, { toValue: 1, duration: 550, useNativeDriver: true }),
        Animated.spring(slideContent, { toValue: 0, speed: 16, bounciness: 3, useNativeDriver: true }),
      ]),
      Animated.timing(fadeVersion, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  // Dimensões responsivas
  const padH = clamp(s(24), 16, 40);
  const badgeTop = Platform.OS === 'ios' ? clamp(s(56), 44, 72) : clamp(s(36), 28, 52);
  const headingSize = clamp(s(28), 20, 36);
  const labelSize = clamp(s(9), 8, 11);
  const bodySize = clamp(s(13), 11, 15);
  const panelPadT = clamp(s(28), 20, 40);
  const panelPadB = Platform.OS === 'ios' ? clamp(s(40), 28, 56) : clamp(s(24), 18, 36);
  const sectionGap = clamp(s(24), 16, 32);
  const itemGap = clamp(s(14), 10, 18);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={T.bg} />

      {/* Background */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeOverlay }]}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000' }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </Animated.View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* Badge */}
        <Animated.View style={[
          styles.badge,
          { top: badgeTop, left: padH },
          { opacity: fadeBadge, transform: [{ translateX: slideBadge }] },
        ]}>
          <Text style={[styles.badgeLabel, { fontSize: labelSize }]}>GARAGEM</Text>
          <Text style={[styles.badgeTitle, { fontSize: clamp(s(20), 14, 26) }]}>Coleção</Text>
        </Animated.View>

        {/* Botão voltar */}
        <Animated.View style={[
          styles.backBtn,
          { top: badgeTop + 2, right: padH },
          { opacity: fadeBadge },
        ]}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={[styles.backBtnText, { fontSize: labelSize }]}>← VOLTAR</Text>
          </Pressable>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Painel principal */}
          <Animated.View style={[
            styles.panel,
            { paddingHorizontal: padH, paddingTop: panelPadT, paddingBottom: panelPadB },
            { opacity: fadeContent, transform: [{ translateY: slideContent }] },
          ]}>
            {/* Cabeçalho */}
            <View style={{ marginBottom: sectionGap }}>
              <Text style={[styles.panelLabel, { fontSize: labelSize }]}>SOBRE</Text>
              <Text style={[styles.panelHeading, { fontSize: headingSize, lineHeight: headingSize * 1.2 }]}>
                Nossa{'\n'}
                <Text style={styles.panelHeadingItalic}>história.</Text>
              </Text>
            </View>

            {/* Descrição */}
            <View style={{ marginBottom: sectionGap }}>
              <Text style={[styles.sectionTitle, { fontSize: labelSize }]}>
                O QUE FAZEMOS
              </Text>
              <Text style={[styles.bodyText, { fontSize: bodySize, lineHeight: bodySize * 1.6 }]}>
                {APP_INFO.descricao}
              </Text>
            </View>

            {/* Funcionalidades */}
            <View style={{ marginBottom: sectionGap }}>
              <Text style={[styles.sectionTitle, { fontSize: labelSize }]}>
                FUNCIONALIDADES
              </Text>
              <View style={{ gap: itemGap }}>
                {APP_INFO.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Text style={[styles.featureText, { fontSize: bodySize }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Tecnologias */}
            <View style={{ marginBottom: sectionGap }}>
              <Text style={[styles.sectionTitle, { fontSize: labelSize }]}>
                TECNOLOGIAS
              </Text>
              <View style={styles.techContainer}>
                {APP_INFO.tecnologias.map((tech, index) => (
                  <View key={index} style={styles.techBadge}>
                    <Text style={[styles.techText, { fontSize: clamp(s(9), 8, 10) }]}>
                      {tech}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Informações */}
            <View style={{ marginBottom: sectionGap }}>
              <Text style={[styles.sectionTitle, { fontSize: labelSize }]}>
                INFORMAÇÕES
              </Text>
              <View style={{ gap: clamp(s(10), 8, 14) }}>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { fontSize: clamp(s(10), 9, 11) }]}>Versão</Text>
                  <Text style={[styles.infoValue, { fontSize: clamp(s(10), 9, 11) }]}>
                    {APP_INFO.versao}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { fontSize: clamp(s(10), 9, 11) }]}>Desenvolvedor</Text>
                  <Text style={[styles.infoValue, { fontSize: clamp(s(10), 9, 11) }]}>
                    {APP_INFO.desenvolvedor}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { fontSize: clamp(s(10), 9, 11) }]}>Ano</Text>
                  <Text style={[styles.infoValue, { fontSize: clamp(s(10), 9, 11) }]}>
                    {APP_INFO.ano}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { fontSize: clamp(s(10), 9, 11) }]}>Licença</Text>
                  <Text style={[styles.infoValue, { fontSize: clamp(s(10), 9, 11) }]}>
                    MIT
                  </Text>
                </View>
              </View>
            </View>

            {/* Contato */}
            <View style={{ marginBottom: sectionGap }}>
              <Text style={[styles.sectionTitle, { fontSize: labelSize }]}>
                CONTATO
              </Text>
              <View style={{ gap: clamp(s(10), 8, 14) }}>
                <Pressable onPress={() => Linking.openURL(`mailto:${APP_INFO.email}`)}>
                  <Text style={[styles.linkText, { fontSize: bodySize }]}>
                     {APP_INFO.email}
                  </Text>
                </Pressable>
                <Pressable onPress={() => Linking.openURL(APP_INFO.website)}>
                  <Text style={[styles.linkText, { fontSize: bodySize }]}>
                     {APP_INFO.website}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Versão no rodapé */}
            <Animated.View style={[
              styles.versionContainer,
              { opacity: fadeVersion },
            ]}>
              <View style={styles.versionLine} />
              <Text style={[styles.versionText, { fontSize: clamp(s(9), 8, 10) }]}>
                {APP_INFO.nome} v{APP_INFO.versao}
              </Text>
              <Text style={[styles.versionSubtext, { fontSize: clamp(s(8), 7, 9) }]}>
                desenvolvido com ódio e gambiarra por {APP_INFO.desenvolvedor}
              </Text>
              <Text style={[styles.versionSubtext, { fontSize: clamp(s(8), 7, 9) }]}>
                © {APP_INFO.ano} {APP_INFO.desenvolvedor}. Todos os direitos reservados.
              </Text>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.bg,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(20,20,18,0.82)',
  },

  // Badge e navegação
  badge: {
    position: 'absolute',
    zIndex: 10,
  },
  badgeLabel: {
    letterSpacing: 4,
    color: T.inkLight,
    fontWeight: '600',
    marginBottom: 2,
  },
  badgeTitle: {
    fontWeight: '300',
    color: T.ink,
    letterSpacing: 1,
  },
  backBtn: {
    position: 'absolute',
    zIndex: 10,
  },
  backBtnText: {
    letterSpacing: 3,
    color: T.inkLight,
    fontWeight: '500',
  },

  // Layout
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingTop: 100,
  },

  // Painel
  panel: {
    backgroundColor: 'rgba(29,28,26,0.97)',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: T.rule,
  },
  panelLabel: {
    letterSpacing: 4,
    color: T.inkLight,
    marginBottom: 6,
  },
  panelHeading: {
    fontWeight: '300',
    color: T.ink,
    letterSpacing: -0.3,
  },
  panelHeadingItalic: {
    fontStyle: 'italic',
    color: T.inkMid,
  },

  // Seções
  sectionTitle: {
    letterSpacing: 3,
    color: T.inkLight,
    fontWeight: '600',
    marginBottom: 12,
  },
  bodyText: {
    color: T.inkMid,
    fontWeight: '300',
    letterSpacing: 0.2,
  },

  // Features
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  featureText: {
    color: T.inkMid,
    fontWeight: '300',
    letterSpacing: 0.2,
  },

  // Tecnologias
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techBadge: {
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.rule,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  techText: {
    color: T.inkLight,
    letterSpacing: 1,
    fontWeight: '500',
  },

  // Informações
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    color: T.inkLight,
    letterSpacing: 1,
    fontWeight: '500',
  },
  infoValue: {
    color: T.ink,
    letterSpacing: 0.5,
  },

  // Links
  linkText: {
    color: T.accent,
    letterSpacing: 0.3,
    textDecorationLine: 'underline',
  },

  // Versão
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionLine: {
    width: 40,
    height: 1,
    backgroundColor: T.rule,
    marginBottom: 16,
  },
  versionText: {
    color: T.inkLight,
    letterSpacing: 2,
    fontWeight: '500',
    marginBottom: 4,
  },
  versionSubtext: {
    color: T.inkLight,
    letterSpacing: 0.5,
    opacity: 0.6,
  },
});