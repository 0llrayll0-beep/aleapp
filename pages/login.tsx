import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  ImageBackground,
  StatusBar,
  Platform,
  useWindowDimensions,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import bancoJson from './banco.json';

//  Paleta 
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
  placeholderInner: '#302D2A',
  closeBtnText: '#141412',
};

//  Tipos 
interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
  criadoEm: string;
}

interface Database {
  usuarios: User[];
}

//  Caminho destino no dispositivo 
async function carregarBanco(): Promise<Database> {
  return {
    usuarios: bancoJson.usuarios || [],
  };
}

//  Autenticação 
function autenticar(db: Database, identificador: string, senha: string): User | null {
  const id = identificador.trim().toLowerCase();
  const s  = senha.trim();

  return (
    db.usuarios.find(
      (u) =>
        (u.email.toLowerCase() === id || u.nome.toLowerCase() === id) &&
        u.senha === s
    ) ?? null
  );
}

//  Componente 
export default function LoginScreen({ navigation }: { navigation: any }) {
  const { width: W } = useWindowDimensions();

  const s     = (v: number) => Math.round((v / 390) * W);
  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha]                 = useState('');
  const [idFocused, setIdFocused]         = useState(false);
  const [senhaFocused, setSenhaFocused]   = useState(false);
  const [carregando, setCarregando]       = useState(false);
  const [erroBanco, setErroBanco]         = useState('');
  const [erroSenha, setErroSenha]         = useState('');
  const [banco, setBanco]                 = useState<Database | null>(null);

  // Animações
  const fadeTitle  = React.useRef(new Animated.Value(0)).current;
  const slideTitle = React.useRef(new Animated.Value(20)).current;
  const fadeForm   = React.useRef(new Animated.Value(0)).current;
  const slideForm  = React.useRef(new Animated.Value(24)).current;
  const fadeBtn    = React.useRef(new Animated.Value(0)).current;
  const slideBtn   = React.useRef(new Animated.Value(16)).current;
  const shakeAnim  = React.useRef(new Animated.Value(0)).current;

  // Carrega banco ao montar(não atualiza o cadastro por algum motivo arrumar se der tempo)
  useEffect(() => {
    (async () => {
      const db = await carregarBanco();
      setBanco(db);
    })();
  }, []);

  // Animação de entrada
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeTitle,  { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(slideTitle, { toValue: 0, speed: 18, bounciness: 4, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeForm,  { toValue: 1, duration: 550, useNativeDriver: true }),
        Animated.spring(slideForm, { toValue: 0, speed: 18, bounciness: 3, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeBtn,  { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(slideBtn, { toValue: 0, speed: 20, bounciness: 3, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const shake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue:  8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:  6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:  0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    setErroBanco('');
    setErroSenha('');

    if (!identificador.trim()) {
      setErroBanco('Preencha o nome ou e-mail.');
      shake();
      return;
    }
    if (!senha.trim()) {
      setErroSenha('Preencha a senha.');
      shake();
      return;
    }

    setCarregando(true);
    await new Promise((r) => setTimeout(r, 400));

    const db      = banco ?? (await carregarBanco());
    const usuario = autenticar(db, identificador, senha);

    setCarregando(false);

    if (!usuario) {
      setErroBanco('Usuário não encontrado.');
      setErroSenha('Senha incorreta ou usuário não existe.');
      shake();
      return;
    }

    navigation.navigate('Home', { usuario });
  };

  // Dimensões responsivas
  const padH        = clamp(s(24), 16, 40);
  const badgeTop    = Platform.OS === 'ios' ? clamp(s(56), 44, 72) : clamp(s(36), 28, 52);
  const headingSize = clamp(s(30), 22, 38);
  const labelSize   = clamp(s(9), 8, 11);
  const inputPadV   = clamp(s(13), 10, 16);
  const inputFontSz = clamp(s(13), 11, 15);
  const btnPadV     = clamp(s(15), 12, 18);
  const btnFontSz   = clamp(s(11), 10, 13);
  const taglineSz   = clamp(s(24), 16, 32);
  const panelPadT   = clamp(s(28), 20, 40);
  const panelPadB   = Platform.OS === 'ios' ? clamp(s(40), 28, 56) : clamp(s(24), 18, 36);
  const fieldGap    = clamp(s(18), 12, 24);
  const sectionGap  = clamp(s(24), 16, 32);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={T.bg} />

      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000' }}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={[styles.badge, { top: badgeTop, left: padH }]}>
          <Text style={[styles.badgeLabel, { fontSize: labelSize }]}>GARAGEM</Text>
          <Text style={[styles.badgeTitle, { fontSize: clamp(s(20), 14, 26) }]}>Coleção</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.kavWrapper}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={[styles.taglineBlock, { paddingHorizontal: padH, marginBottom: clamp(s(20), 12, 28) }]}>
              <Text style={[styles.taglineText, { fontSize: taglineSz }]}>
                Cada carro{'\n'}conta uma história.
              </Text>
              <Text style={[styles.taglineSub, { fontSize: labelSize }]}>
                ACESSE SUA GARAGEM PRIVADA
              </Text>
            </View>

            <View style={[styles.panel, { paddingHorizontal: padH, paddingTop: panelPadT, paddingBottom: panelPadB }]}>

              <Animated.View style={[{ opacity: fadeTitle, transform: [{ translateY: slideTitle }] }, { marginBottom: sectionGap }]}>
                <Text style={[styles.panelLabel, { fontSize: labelSize }]}>ACESSO</Text>
                <Text style={[styles.panelHeading, { fontSize: headingSize, lineHeight: headingSize * 1.2 }]}>
                  Bem-vindo{'\n'}
                  <Text style={styles.panelHeadingItalic}>de volta.</Text>
                </Text>
              </Animated.View>

              <Animated.View style={{ opacity: fadeForm, transform: [{ translateY: slideForm }, { translateX: shakeAnim }] }}>

                <View style={{ marginBottom: fieldGap }}>
                  <Text style={[styles.fieldLabel, { fontSize: labelSize }]}>NOME OU E-MAIL</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { paddingVertical: inputPadV, fontSize: inputFontSz },
                      idFocused && styles.inputFocused,
                      erroBanco ? styles.inputError : null,
                    ]}
                    placeholder="nome ou seu@email.com"
                    placeholderTextColor={T.placeholderInner}
                    value={identificador}
                    onChangeText={(t) => { setIdentificador(t); setErroBanco(''); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setIdFocused(true)}
                    onBlur={() => setIdFocused(false)}
                  />
                  {!!erroBanco && (
                    <Text style={[styles.erroTexto, { fontSize: clamp(s(10), 9, 12) }]}>
                      {erroBanco}
                    </Text>
                  )}
                </View>

                <View style={{ marginBottom: fieldGap }}>
                  <Text style={[styles.fieldLabel, { fontSize: labelSize }]}>SENHA</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { paddingVertical: inputPadV, fontSize: inputFontSz },
                      senhaFocused && styles.inputFocused,
                      erroSenha ? styles.inputError : null,
                    ]}
                    placeholder="••••••••"
                    placeholderTextColor={T.placeholderInner}
                    value={senha}
                    onChangeText={(t) => { setSenha(t); setErroSenha(''); }}
                    secureTextEntry
                    onFocus={() => setSenhaFocused(true)}
                    onBlur={() => setSenhaFocused(false)}
                  />
                  {!!erroSenha && (
                    <Text style={[styles.erroTexto, { fontSize: clamp(s(10), 9, 12) }]}>
                      {erroSenha}
                    </Text>
                  )}
                </View>

                <Text style={[styles.forgotLink, { fontSize: labelSize, marginBottom: sectionGap }]}>
                  ESQUECI A SENHA
                </Text>
              </Animated.View>

              <Animated.View style={{ opacity: fadeBtn, transform: [{ translateY: slideBtn }] }}>

                <Pressable
                  onPress={handleLogin}
                  disabled={carregando}
                  style={({ pressed }) => [
                    styles.btnPrimary,
                    { paddingVertical: btnPadV, marginBottom: clamp(s(16), 12, 20) },
                    pressed && !carregando && styles.btnPrimaryPressed,
                    carregando && { opacity: 0.7 },
                  ]}
                >
                  {({ pressed }) =>
                    carregando ? (
                      <ActivityIndicator size="small" color={T.closeBtnText} />
                    ) : (
                      <Text style={[styles.btnPrimaryText, { fontSize: btnFontSz }, pressed && { opacity: 0.8 }]}>
                        ENTRAR
                      </Text>
                    )
                  }
                </Pressable>

                <View style={[styles.orRow, { marginBottom: clamp(s(16), 12, 20) }]}>
                  <View style={styles.orLine} />
                  <Text style={[styles.orText, { fontSize: labelSize }]}>OU</Text>
                  <View style={styles.orLine} />
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.btnGhost,
                    { paddingVertical: clamp(s(13), 10, 16) },
                    pressed && styles.btnGhostPressed,
                  ]}
                >
                  <Text style={[styles.btnGhostText, { fontSize: btnFontSz }]}>
                    CONTINUAR COM GOOGLE
                  </Text>
                </Pressable>

                <View style={[styles.footer, { marginTop: clamp(s(24), 16, 32), paddingTop: clamp(s(20), 14, 26) }]}>
                  <Text style={[styles.footerText, { fontSize: labelSize }]}>SEM CONTA?</Text>
                  
                  <Pressable onPress={() => navigation.navigate('Cadastro')}>
                  <Text style={[styles.footerLink, { fontSize: labelSize }]}>CRIAR ACESSO →</Text>
                  </Pressable>
                </View>

              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

      </ImageBackground>
    </View>
  );
}

//  Estilos 
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  bgImage: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(20,20,18,0.72)',
  },

  badge: { position: 'absolute', zIndex: 10 },
  badgeLabel: { letterSpacing: 4, color: T.inkLight, fontWeight: '600', marginBottom: 2 },
  badgeTitle: { fontWeight: '300', color: T.ink, letterSpacing: 1 },

  kavWrapper: { flex: 1, justifyContent: 'flex-end' },
  scrollContent: { flexGrow: 1, justifyContent: 'flex-end' },

  taglineBlock: { paddingTop: 8 },
  taglineText: { fontWeight: '300', fontStyle: 'italic', color: T.ink, letterSpacing: -0.3 },
  taglineSub: { marginTop: 8, letterSpacing: 3, color: T.inkLight },

  panel: {
    backgroundColor: 'rgba(29,28,26,0.97)',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: T.rule,
  },

  panelLabel: { letterSpacing: 4, color: T.inkLight, marginBottom: 6 },
  panelHeading: { fontWeight: '300', color: T.ink, letterSpacing: -0.3 },
  panelHeadingItalic: { fontStyle: 'italic', color: T.inkMid },

  fieldLabel: { letterSpacing: 3, color: T.inkLight, marginBottom: 8 },
  input: {
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.rule,
    borderRadius: 2,
    paddingHorizontal: 16,
    color: T.ink,
    letterSpacing: 0.3,
  },
  inputFocused: { borderColor: T.accent },
  inputError: { borderColor: T.danger },

  erroTexto: { color: T.danger, marginTop: 6, letterSpacing: 0.5 },

  forgotLink: { textAlign: 'right', letterSpacing: 2, color: T.inkLight, marginTop: -4 },

  btnPrimary: { backgroundColor: T.ink, borderRadius: 2, alignItems: 'center' },
  btnPrimaryPressed: { backgroundColor: '#FFFFFF', transform: [{ scale: 0.985 }] },
  btnPrimaryText: { letterSpacing: 3, color: T.closeBtnText, fontWeight: '500' },

  orRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  orLine: { flex: 1, height: 1, backgroundColor: T.rule },
  orText: { letterSpacing: 2, color: T.inkLight },

  btnGhost: { borderWidth: 1, borderColor: T.rule, borderRadius: 2, alignItems: 'center' },
  btnGhostPressed: { borderColor: T.inkLight, transform: [{ scale: 0.985 }] },
  btnGhostText: { letterSpacing: 3, color: T.inkMid },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: T.rule,
  },
  footerText: { letterSpacing: 2, color: T.inkLight },
  footerLink: { letterSpacing: 2, color: T.accent },
});