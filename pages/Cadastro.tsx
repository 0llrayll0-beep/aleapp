import React, { useState, useEffect, useRef } from 'react';
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
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

function gerarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

interface Erros {
  nome?: string;
  email?: string;
  senha?: string;
  confirmacao?: string;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  criadoEm: string;
}

export default function CadastroScreen({ navigation }: { navigation: any }) {
  const { width: W } = useWindowDimensions();
  const s = (v: number) => Math.round((v / 390) * W);
  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [mensagemSalvamento, setMensagemSalvamento] = useState('');

  const [nomeFocused, setNomeFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [senhaFocused, setSenhaFocused] = useState(false);
  const [confFocused, setConfFocused] = useState(false);
  const [forca, setForca] = useState(0);

  const fadeBack = useRef(new Animated.Value(0)).current;
  const fadeBadge = useRef(new Animated.Value(0)).current;
  const slideBadge = useRef(new Animated.Value(-16)).current;
  const fadeTag = useRef(new Animated.Value(0)).current;
  const slideTag = useRef(new Animated.Value(20)).current;
  const fadePanel = useRef(new Animated.Value(0)).current;
  const slidePanel = useRef(new Animated.Value(32)).current;
  const fadeFields = useRef(new Animated.Value(0)).current;
  const slideFields = useRef(new Animated.Value(20)).current;
  const fadeBtn = useRef(new Animated.Value(0)).current;
  const slideBtn = useRef(new Animated.Value(16)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const forcaAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeBack, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeBadge, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideBadge, { toValue: 0, speed: 18, bounciness: 5, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeTag, { toValue: 1, duration: 480, useNativeDriver: true }),
        Animated.spring(slideTag, { toValue: 0, speed: 16, bounciness: 4, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadePanel, { toValue: 1, duration: 520, useNativeDriver: true }),
        Animated.spring(slidePanel, { toValue: 0, speed: 14, bounciness: 3, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeFields, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(slideFields, { toValue: 0, speed: 18, bounciness: 3, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeBtn, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.spring(slideBtn, { toValue: 0, speed: 20, bounciness: 3, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    let score = 0;
    if (senha.length >= 8) score++;
    if (/[A-Z]/.test(senha)) score++;
    if (/[0-9]/.test(senha)) score++;
    if (/[^A-Za-z0-9]/.test(senha)) score++;
    setForca(score);
    Animated.timing(forcaAnim, {
      toValue: senha.length === 0 ? 0 : score / 4,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [senha]);

  const shake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 9, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -9, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 35, useNativeDriver: true }),
    ]).start();
  };

  const validar = (): boolean => {
    const e: Erros = {};
    if (!nome.trim()) e.nome = 'Informe seu nome completo.';
    if (!email.trim()) e.email = 'Informe seu e-mail.';
    else if (!validarEmail(email)) e.email = 'E-mail inválido.';
    if (!senha) e.senha = 'Crie uma senha.';
    else if (senha.length < 6) e.senha = 'Mínimo 6 caracteres.';
    if (!confirmacao) e.confirmacao = 'Confirme sua senha.';
    else if (confirmacao !== senha) e.confirmacao = 'As senhas não coincidem.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  // FUNÇÃO DE SALVAR COM DELAY
// Função que chama a API para salvar no banco.json
const salvarNoBancoJSON = async (usuario: Usuario): Promise<boolean> => {
  try {
    setMensagemSalvamento('Conectando ao banco de dados...');
    
    const response = await fetch('http://localhost:3001/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });

    // Aguardar o delay do servidor (simula processamento)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setMensagemSalvamento('Salvando dados...');
    
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const resultado = await response.json();
    
    if (!response.ok || !resultado.sucesso) {
      Alert.alert('Erro', resultado.erro || 'Falha ao cadastrar.');
      setMensagemSalvamento('');
      return false;
    }
    
    setMensagemSalvamento('✅ Cadastro realizado!');
    console.log('✅ Usuário salvo no banco.json:', usuario.email);
    console.log('📦 Total de usuários:', resultado.total);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setMensagemSalvamento('');
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro de conexão:', error);
    Alert.alert(
      'Erro de Conexão',
      'Não foi possível conectar ao servidor.\n\nCertifique-se de que o servidor está rodando:\n\nnode server.js'
    );
    setMensagemSalvamento('');
    return false;
  }
};

const handleCadastro = async () => {
  if (!validar()) {
    shake();
    return;
  }

  setEnviando(true);

  const novoUsuario: Usuario = {
    id: gerarId(),
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    senha: senha,
    criadoEm: new Date().toISOString().split('T')[0],
  };

  const salvou = await salvarNoBancoJSON(novoUsuario);

  if (!salvou) {
    setEnviando(false);
    return;
  }

  setEnviando(false);
  setSucesso(true);

  Animated.sequence([
    Animated.spring(successScale, { toValue: 1, speed: 14, bounciness: 12, useNativeDriver: true }),
    Animated.timing(successOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
  ]).start();

  setTimeout(() => {
    navigation.navigate('Login');
  }, 2000);
};
  const padH = clamp(s(24), 16, 40);
  const badgeTop = Platform.OS === 'ios' ? clamp(s(56), 44, 72) : clamp(s(36), 28, 52);
  const headingSize = clamp(s(28), 20, 36);
  const labelSize = clamp(s(9), 8, 11);
  const inputPadV = clamp(s(13), 10, 16);
  const inputFontSz = clamp(s(13), 11, 15);
  const btnPadV = clamp(s(15), 12, 18);
  const btnFontSz = clamp(s(11), 10, 13);
  const taglineSz = clamp(s(22), 15, 28);
  const panelPadT = clamp(s(28), 20, 40);
  const panelPadB = Platform.OS === 'ios' ? clamp(s(40), 28, 56) : clamp(s(24), 18, 36);
  const fieldGap = clamp(s(16), 10, 22);
  const sectionGap = clamp(s(22), 14, 30);

  const forcaCores = ['#B36B6A', '#C4854A', '#B8A44A', '#5A8C6B'];
  const forcaCor = forca === 0 ? T.rule : forcaCores[Math.min(forca - 1, 3)];
  const forcaLabel = ['', 'Fraca', 'Regular', 'Boa', 'Forte'][forca];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={T.bg} />

      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeBack }]}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000' }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </Animated.View>

      <Animated.View style={[
        styles.badge,
        { top: badgeTop, left: padH },
        { opacity: fadeBadge, transform: [{ translateX: slideBadge }] },
      ]}>
        <Text style={[styles.badgeLabel, { fontSize: labelSize }]}>GARAGEM</Text>
        <Text style={[styles.badgeTitle, { fontSize: clamp(s(20), 14, 26) }]}>Coleção</Text>
      </Animated.View>

      <Animated.View style={[
        styles.backBtn,
        { top: badgeTop + 2, right: padH },
        { opacity: fadeBadge },
      ]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtnText, { fontSize: labelSize }]}>← VOLTAR</Text>
        </Pressable>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kavWrapper}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={[
            styles.taglineBlock,
            { paddingHorizontal: padH, marginBottom: clamp(s(20), 12, 28) },
            { opacity: fadeTag, transform: [{ translateY: slideTag }] },
          ]}>
            <Text style={[styles.taglineText, { fontSize: taglineSz }]}>
              
            </Text>
            <Text style={[styles.taglineSub, { fontSize: labelSize }]}>
              CADASTRE SUA GARAGEM PRIVADA
            </Text>
          </Animated.View>

          <Animated.View style={[
            styles.panel,
            { paddingHorizontal: padH, paddingTop: panelPadT, paddingBottom: panelPadB },
            { opacity: fadePanel, transform: [{ translateY: slidePanel }] },
          ]}>
            <View style={{ marginBottom: sectionGap }}>
              <Text style={[styles.panelLabel, { fontSize: labelSize }]}>NOVO ACESSO</Text>
              <Text style={[styles.panelHeading, { fontSize: headingSize, lineHeight: headingSize * 1.2 }]}>
                Crie sua{'\n'}
                <Text style={styles.panelHeadingItalic}>conta.</Text>
              </Text>
            </View>

            <Animated.View style={{
              opacity: fadeFields,
              transform: [{ translateY: slideFields }, { translateX: shakeAnim }],
            }}>
              <View style={{ marginBottom: fieldGap }}>
                <Text style={[styles.fieldLabel, { fontSize: labelSize }]}>NOME COMPLETO</Text>
                <TextInput
                  style={[
                    styles.input,
                    { paddingVertical: inputPadV, fontSize: inputFontSz },
                    nomeFocused && styles.inputFocused,
                    erros.nome && styles.inputError,
                  ]}
                  placeholder="Como devemos te chamar"
                  placeholderTextColor={T.placeholderInner}
                  value={nome}
                  onChangeText={(t) => { setNome(t); setErros((e) => ({ ...e, nome: undefined })); }}
                  autoCapitalize="words"
                  onFocus={() => setNomeFocused(true)}
                  onBlur={() => setNomeFocused(false)}
                />
                {!!erros.nome && (
                  <Text style={[styles.erroTexto, { fontSize: clamp(s(10), 9, 12) }]}>
                    {erros.nome}
                  </Text>
                )}
              </View>

              <View style={{ marginBottom: fieldGap }}>
                <Text style={[styles.fieldLabel, { fontSize: labelSize }]}>E-MAIL</Text>
                <TextInput
                  style={[
                    styles.input,
                    { paddingVertical: inputPadV, fontSize: inputFontSz },
                    emailFocused && styles.inputFocused,
                    erros.email && styles.inputError,
                  ]}
                  placeholder="seu@email.com"
                  placeholderTextColor={T.placeholderInner}
                  value={email}
                  onChangeText={(t) => { setEmail(t); setErros((e) => ({ ...e, email: undefined })); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
                {!!erros.email && (
                  <Text style={[styles.erroTexto, { fontSize: clamp(s(10), 9, 12) }]}>
                    {erros.email}
                  </Text>
                )}
              </View>

              <View style={{ marginBottom: clamp(s(10), 8, 14) }}>
                <Text style={[styles.fieldLabel, { fontSize: labelSize }]}>SENHA</Text>
                <TextInput
                  style={[
                    styles.input,
                    { paddingVertical: inputPadV, fontSize: inputFontSz },
                    senhaFocused && styles.inputFocused,
                    erros.senha && styles.inputError,
                  ]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={T.placeholderInner}
                  value={senha}
                  onChangeText={(t) => { setSenha(t); setErros((e) => ({ ...e, senha: undefined })); }}
                  secureTextEntry
                  onFocus={() => setSenhaFocused(true)}
                  onBlur={() => setSenhaFocused(false)}
                />
                {!!erros.senha && (
                  <Text style={[styles.erroTexto, { fontSize: clamp(s(10), 9, 12) }]}>
                    {erros.senha}
                  </Text>
                )}
              </View>

              {senha.length > 0 && (
                <View style={{ marginBottom: fieldGap }}>
                  <View style={styles.forcaTrack}>
                    <Animated.View style={[
                      styles.forcaBar,
                      { flex: forcaAnim, backgroundColor: forcaCor },
                    ]} />
                  </View>
                  <Text style={[styles.forcaLabel, { fontSize: clamp(s(9), 8, 10), color: forcaCor }]}>
                    {forcaLabel.toUpperCase()}
                  </Text>
                </View>
              )}

              <View style={{ marginBottom: sectionGap }}>
                <Text style={[styles.fieldLabel, { fontSize: labelSize }]}>CONFIRMAR SENHA</Text>
                <TextInput
                  style={[
                    styles.input,
                    { paddingVertical: inputPadV, fontSize: inputFontSz },
                    confFocused && styles.inputFocused,
                    erros.confirmacao && styles.inputError,
                    confirmacao.length > 0 && confirmacao === senha && styles.inputSuccess,
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={T.placeholderInner}
                  value={confirmacao}
                  onChangeText={(t) => { setConfirmacao(t); setErros((e) => ({ ...e, confirmacao: undefined })); }}
                  secureTextEntry
                  onFocus={() => setConfFocused(true)}
                  onBlur={() => setConfFocused(false)}
                />
                {!!erros.confirmacao && (
                  <Text style={[styles.erroTexto, { fontSize: clamp(s(10), 9, 12) }]}>
                    {erros.confirmacao}
                  </Text>
                )}
                {confirmacao.length > 0 && confirmacao === senha && !erros.confirmacao && (
                  <Text style={[styles.sucessoTexto, { fontSize: clamp(s(10), 9, 12) }]}>
                    Senhas coincidem ✓
                  </Text>
                )}
              </View>
            </Animated.View>

            <Animated.View style={{ opacity: fadeBtn, transform: [{ translateY: slideBtn }] }}>
              {sucesso ? (
                <Animated.View style={[
                  styles.successBox,
                  { paddingVertical: btnPadV },
                  { opacity: successOpacity, transform: [{ scale: successScale }] },
                ]}>
                  <Text style={[styles.successText, { fontSize: btnFontSz }]}>
                    CONTA CRIADA COM SUCESSO ✓
                  </Text>
                </Animated.View>
              ) : (
                <>
                  <Pressable
                    onPress={handleCadastro}
                    disabled={enviando}
                    style={({ pressed }) => [
                      styles.btnPrimary,
                      { paddingVertical: btnPadV, marginBottom: clamp(s(20), 14, 28) },
                      pressed && !enviando && styles.btnPrimaryPressed,
                      enviando && { opacity: 0.7 },
                    ]}
                  >
                    {({ pressed }) =>
                      enviando ? (
                        <View style={{ alignItems: 'center', gap: 8 }}>
                          <ActivityIndicator size="small" color={T.closeBtnText} />
                          {mensagemSalvamento ? (
                            <Text style={{ color: T.inkLight, fontSize: 10, letterSpacing: 1 }}>
                              {mensagemSalvamento}
                            </Text>
                          ) : null}
                        </View>
                      ) : (
                        <Text style={[styles.btnPrimaryText, { fontSize: btnFontSz }, pressed && { opacity: 0.8 }]}>
                          CRIAR ACESSO
                        </Text>
                      )
                    }
                  </Pressable>
                </>
              )}

              {!sucesso && (
                <Text style={[styles.termosText, { fontSize: clamp(s(8), 7, 10) }]}>
                  Ao criar sua conta, você concorda com nossos{' '}
                  <Text style={styles.termosLink}>Termos de Uso</Text>{' '}e{' '}
                  <Text style={styles.termosLink}>Política de Privacidade</Text>.
                </Text>
              )}

              <View style={[styles.footer, { marginTop: clamp(s(20), 14, 28), paddingTop: clamp(s(18), 12, 24) }]}>
                <Text style={[styles.footerText, { fontSize: labelSize }]}>JÁ TEM CONTA?</Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
                  <Text style={[styles.footerLink, { fontSize: labelSize }]}>ENTRAR →</Text>
                </Pressable>
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(20,20,18,0.75)',
  },
  badge: { position: 'absolute', zIndex: 10 },
  badgeLabel: { letterSpacing: 4, color: T.inkLight, fontWeight: '600', marginBottom: 2 },
  badgeTitle: { fontWeight: '300', color: T.ink, letterSpacing: 1 },
  backBtn: { position: 'absolute', zIndex: 10 },
  backBtnText: { letterSpacing: 3, color: T.inkLight, fontWeight: '500' },
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
  inputSuccess: { borderColor: T.success },
  erroTexto: { color: T.danger, marginTop: 6, letterSpacing: 0.5 },
  sucessoTexto: { color: T.success, marginTop: 6, letterSpacing: 0.5 },
  forcaTrack: {
    height: 2,
    backgroundColor: T.rule,
    borderRadius: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  forcaBar: { height: 2, borderRadius: 1 },
  forcaLabel: { marginTop: 4, letterSpacing: 2 },
  btnPrimary: { backgroundColor: T.ink, borderRadius: 2, alignItems: 'center' },
  btnPrimaryPressed: { backgroundColor: '#FFFFFF', transform: [{ scale: 0.985 }] },
  btnPrimaryText: { letterSpacing: 3, color: T.closeBtnText, fontWeight: '500' },
  successBox: {
    backgroundColor: 'rgba(90,140,107,0.12)',
    borderWidth: 1,
    borderColor: T.success,
    borderRadius: 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  successText: { letterSpacing: 3, color: T.success, fontWeight: '500' },
  termosText: { textAlign: 'center', color: T.inkLight, letterSpacing: 0.3, lineHeight: 16 },
  termosLink: { color: T.accent, letterSpacing: 0.3 },
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