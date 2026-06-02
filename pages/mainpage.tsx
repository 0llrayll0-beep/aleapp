import React, { useState, useRef, useCallback, createContext, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  StatusBar,
  FlatList,
  Animated,
  SafeAreaView,
  Platform,
  useColorScheme,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TEMA (css, doc e claude ajudou)
type ThemeMode = 'light' | 'dark';

interface ThemeTokens {
  bg: string;
  surface: string;
  surfaceRaised: string;
  ink: string;
  inkMid: string;
  inkLight: string;
  rule: string;
  ruleHeavy: string;
  placeholder: string;
  placeholderInner: string;
  closeBtnText: string;
  accent: string;
  cta: string;
  success: string;
  danger: string;
}

const THEMES: Record<ThemeMode, ThemeTokens> = {
  light: {
    bg: '#F2F0EC',
    surface: '#E3E0D9',
    surfaceRaised: '#FFFFFF',
    ink: '#232629',
    inkMid: '#5E656E',
    inkLight: '#9BA4AE',
    rule: '#D8D5CE',
    ruleHeavy: '#232629',
    placeholder: '#E8E5DF',
    placeholderInner: '#D5D1CA',
    closeBtnText: '#FFFFFF',
    accent: '#3D5A6C',
    cta: '#B86B3E',
    success: '#5E7B65',
    danger: '#8E4A49',
  },
  dark: {
    bg: '#141412',
    surface: '#1D1C1A',
    surfaceRaised: '#252422',
    ink: '#EAE8E3',
    inkMid: '#9A9590',
    inkLight: '#5A5752',
    rule: '#2E2C29',
    ruleHeavy: '#EAE8E3',
    placeholder: '#221F1C',
    placeholderInner: '#302D2A',
    closeBtnText: '#141412',
    accent: '#6B8FA3',
    cta: '#D4845A',
    success: '#7A9E82',
    danger: '#B36B6A',
  },
};

interface ThemeContextValue {
  mode: ThemeMode;
  T: ThemeTokens;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  T: THEMES.light,
  toggle: () => {},
});

const useTheme = () => useContext(ThemeContext);

// TIPOS - dos carros lá
type Category = 'Sport' | 'SUV' | 'Sedan' | 'Classico' | 'Eletrico' | 'Personalizado';

interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  horsepower: number;
  torque: string;
  engine: string;
  topSpeed: number;
  acceleration: string;
  price: string;
  category: Category;
  image: any;
  description: string;
  origin: string;
  featured: boolean;
  isUserCar?: boolean;
  userId?: string;
  createdAt?: string;
}

interface CarDatabase {
  users: {
    [userId: string]: {
      username: string;
      cars: Car[];
    }
  };
  defaultCars: Car[];
}

// SIMULAÇÃO DO BANCO DE DADOS - carrosbd.json
const CARROS_DB: CarDatabase = {
  users: {},
  defaultCars: [
    {
      id: '1',
      name: '911 Carrera S',
      brand: 'Porsche',
      year: 2023,
      horsepower: 450,
      torque: '530 Nm',
      engine: '3.0 Flat-6 Biturbo',
      topSpeed: 308,
      acceleration: '3.5s',
      price: 'R$ 890.000',
      category: 'Sport',
      image: require('./cars/id1.png'),
      description: 'O 911 é a alma da Porsche. Produzido desde 1963, este esportivo de motor traseiro defende há mais de seis décadas a tese de que forma e função podem coexistir sem concessões. A versão Carrera S eleva a receita com o flat-six biturbo de 3.0 litros, entregando 450 cv com refinamento cirúrgico e a sonoridade inconfundível que nenhum concorrente conseguiu replicar.',
      origin: 'Alemanha',
      featured: true,
    },
    {
      id: '2',
      name: 'F40',
      brand: 'Ferrari',
      year: 1992,
      horsepower: 478,
      torque: '577 Nm',
      engine: '2.9 V8 Biturbo',
      topSpeed: 324,
      acceleration: '4.1s',
      price: 'R$ 18.000.000',
      category: 'Classico',
      image: require('./cars/id2.png'),
      description: 'Ultimo carro aprovado pessoalmente por Enzo Ferrari antes de sua morte em 1988, a F40 nasceu para celebrar os 40 anos da marca e se tornou o poster mais pregado nos quartos de adolescentes dos anos 90. Sem assistencias eletrônicas, sem conforto supérfluo — apenas 1.100 kg de fibra de carbono e kevlar empurrados por um V8 biturbo de 478 cv. Uma maquina honesta até o ultimo parafuso.',
      origin: 'Italia',
      featured: true,
    },
    {
      id: '3',
      name: 'Defender 110',
      brand: 'Land Rover',
      year: 2024,
      horsepower: 400,
      torque: '550 Nm',
      engine: '3.0 I6 Mild Hybrid',
      topSpeed: 191,
      acceleration: '6.1s',
      price: 'R$ 520.000',
      category: 'SUV',
      image: require('./cars/id3.png'),
      description: 'O Defender carrega no nome o peso de uma lenda. Durante décadas foi o veiculo de escolha de exercitos, exploradores e agricultores nos terrenos mais hostis do planeta. A geracao atual manteve a capacidade off-road implacavel e adicionou tecnologia de ponta, tornando-se ao mesmo tempo um capaz utilitario e um SUV de luxo desejado nos grandes centros urbanos.',
      origin: 'Reino Unido',
      featured: false,
    },
    {
      id: '4',
      name: 'Model S Plaid',
      brand: 'Tesla',
      year: 2023,
      horsepower: 1020,
      torque: '1.420 Nm',
      engine: 'Tri-motor Electrico',
      topSpeed: 322,
      acceleration: '2.1s',
      price: 'R$ 780.000',
      category: 'Eletrico',
      image: require('./cars/id4.png'),
      description: 'O Model S Plaid redefiniu o que se espera de um sedan de quatro portas. Com tres motores eletricos produzindo 1.020 cv e torque disponivel instantaneamente, ele destrona supercarros europeus com o dobro do preco. O interior minimalista centrado na tela panoramica e a autonomia de mais de 600 km completam o argumento de que o futuro dos carros de alto desempenho ja chegou.',
      origin: 'Estados Unidos',
      featured: false,
    },
    {
      id: '5',
      name: 'Giulia Quadrifoglio',
      brand: 'Alfa Romeo',
      year: 2022,
      horsepower: 510,
      torque: '600 Nm',
      engine: '2.9 V6 Biturbo',
      topSpeed: 307,
      acceleration: '3.9s',
      price: 'R$ 480.000',
      category: 'Sedan',
      image: require('./cars/id5.png'),
      description: 'A Giulia Quadrifoglio e a prova de que a Alfa Romeo ainda sabe fazer carros que emocionam. Com o motor V6 biturbo de 2.9 litros desenvolvido em parceria com Ferrari, ela e o sedan mais rapido em Nurburgring por anos. Dirigir uma Giulia e aceitar que tecnologia e paixao nao sao opostos — sao, na verdade, a mesma coisa com nomes diferentes.',
      origin: 'Italia',
      featured: false,
    },
    {
      id: '6',
      name: 'Regera',
      brand: 'Koenigsegg',
      year: 2015,
      horsepower: 1500,
      torque: '2.000 Nm',
      engine: '5.0 V8 Twin Turbo + 3 motores elétricos',
      topSpeed: 404,
      acceleration: '1.8s',
      price: 'R$ 11.500.000',
      category: 'Sport',
      image: require('./cars/id6.png'),
      description: 'Megacarro híbrido sueco que combina um V8 biturbo de 5.0 litros com três motores elétricos, somando 1.500 cv. Utiliza o sistema Koenigsegg Direct Drive, que elimina a transmissão tradicional em favor de uma conexão direta entre motor e rodas. Apenas 80 unidades foram produzidas, todas esgotadas antes mesmo da entrega.',
      origin: 'Suécia',
      featured: true,
    },
    {
      id: '7',
      name: 'LaFerrari',
      brand: 'Ferrari',
      year: 2013,
      horsepower: 963,
      torque: '900 Nm',
      engine: '6.3 V12 + motor elétrico',
      topSpeed: 350,
      acceleration: '2.7s',
      price: 'R$ 38.000.000',
      category: 'Sport',
      image: require('./cars/id7.png'),
      description: 'Hipercarro híbrido de edição limitada lançado em 2013, projetado para ser o ápice da engenharia da marca. Com apenas 499 unidades produzidas na versão cupê, destaca-se pelo design aerodinâmico e por possuir uma das mecânicas mais potentes da história da Ferrari.',
      origin: 'Itália',
      featured: true,
    },
    {
      id: '8',
      name: 'Uno 1.0 Firefly',
      brand: 'Fiat',
      year: 2017,
      horsepower: 77,
      torque: '10.9 kgfm',
      engine: '1.0 Firefly 3 cilindros',
      topSpeed: 157,
      acceleration: '12.5s',
      price: 'R$ 45.000',
      category: 'Sedan',
      image: require('./cars/id8.png'),
      description: 'O Uno 1.0 Firefly 2017 marcou a chegada do motor de três cilindros à linha Fiat no Brasil. Um dos aspirados 1.0 mais torcionais do segmento, com corrente de distribuição para maior durabilidade. Econômico no consumo e confiável no dia a dia, consolidou-se como escolha popular entre quem busca mobilidade urbana sem complicações.',
      origin: 'Brasil',
      featured: true,
    },
    {
      id: '9',
      name: 'La Voiture Noire',
      brand: 'Bugatti',
      year: 2019,
      horsepower: 1500,
      torque: '1.600 Nm',
      engine: '8.0 W16 Quad Turbo',
      topSpeed: 420,
      acceleration: '2.4s',
      price: 'R$ 99.000.000',
      category: 'Sport',
      image: require('./cars/id9.png'),
      description: 'Criado em 2019 como homenagem ao lendário Type 57 SC Atlantic dos anos 1930, pertencente a Jean Bugatti e desaparecido misteriosamente durante a Segunda Guerra Mundial. Peça única encomendada por Ferdinand Piëch, é considerado o carro de produção mais caro já vendido.',
      origin: 'França',
      featured: true,
    },
    {
      id: '10',
      name: 'Veneno',
      brand: 'Lamborghini',
      year: 2013,
      horsepower: 750,
      torque: '690 Nm',
      engine: '6.5 V12 Aspirado',
      topSpeed: 355,
      acceleration: '2.9s',
      price: 'R$ 48.000.000',
      category: 'Sport',
      image: require('./cars/id10.png'),
      description: 'Lançado em 2013 para celebrar os 50 anos da Lamborghini, o Veneno é baseado no Aventador e elevado ao extremo. Design de influência aeroespacial, V12 naturalmente aspirado e apenas 14 unidades produzidas — três cupês e onze roadsters — fazem dele uma das raridades absolutas da história automotiva.',
      origin: 'Itália',
      featured: true,
    },
  ]
};

// Simular ID do usuário atual (em produção viria do sistema de autenticação)
const CURRENT_USER_ID = 'user_123';
const CURRENT_USERNAME = 'Entusiasta';

const CATEGORIES: Array<'Todos' | Category> = ['Todos', 'Sport', 'SUV', 'Sedan', 'Classico', 'Eletrico', 'Personalizado'];

const CATEGORY_LABEL: Record<string, string> = {
  Todos: 'Todos',
  Sport: 'Sport',
  SUV: 'SUV',
  Sedan: 'Sedan',
  Classico: 'Clássico',
  Eletrico: 'Elétrico',
  Personalizado: 'Personalizado',
};

// UTILITARIO(vulgo tortura)
function scale(value: number, screenWidth: number): number {
  return Math.round((value / 390) * screenWidth);
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

// PLACEHOLDER DE IMAGEM
function ImgBlock({ style }: { style?: object }) {
  const { T } = useTheme();
  return (
    <View style={[
      { flex: 1, backgroundColor: T.placeholder, alignItems: 'center', justifyContent: 'center' }, 
      style
    ]}>
      <View style={{ width: 36, height: 36, borderRadius: 2, backgroundColor: T.placeholderInner }} />
    </View>
  );
}

// ICONE SOL
function SunIcon({ color, size }: { color: string; size: number }) {
  const coreSize = size * 0.44;
  const rayW = size * 0.1;
  const rayH = size * 0.2;
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {rays.map((deg) => (
        <View
          key={deg}
          style={{
            position: 'absolute',
            width: rayW,
            height: rayH,
            borderRadius: rayW / 2,
            backgroundColor: color,
            top: size * 0.02,
            left: (size - rayW) / 2,
            transformOrigin: `${rayW / 2}px ${size / 2 - size * 0.02}px`,
            transform: [{ rotate: `${deg}deg` }],
          }}
        />
      ))}
      <View style={{
        width: coreSize,
        height: coreSize,
        borderRadius: coreSize / 2,
        backgroundColor: color,
      }} />
    </View>
  );
}

// ICONE LUA
function MoonIcon({ color, bg, size }: { color: string; bg: string; size: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }} />
      <View style={{
        position: 'absolute',
        width: size * 0.72,
        height: size * 0.72,
        borderRadius: (size * 0.72) / 2,
        backgroundColor: bg,
        top: -size * 0.08,
        left: size * 0.22,
      }} />
    </View>
  );
}

// BOTAO DE TEMA
function ThemeToggle() {
  const { mode, toggle } = useTheme();
  const slideX = useRef(new Animated.Value(mode === 'dark' ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(mode === 'dark' ? 1 : 0)).current;

  const handleToggle = () => {
    const toVal = mode === 'dark' ? 0 : 1;
    Animated.parallel([
      Animated.spring(slideX, { toValue: toVal, useNativeDriver: true, speed: 28, bounciness: 6 }),
      Animated.timing(rotateAnim, { toValue: toVal, duration: 300, useNativeDriver: true }),
    ]).start();
    toggle();
  };

  const PILL_W = 58;
  const PILL_H = 30;
  const KNOB = 22;
  const PAD = (PILL_H - KNOB) / 2;
  const travel = PILL_W - KNOB - PAD * 2;

  const translateX = slideX.interpolate({ inputRange: [0, 1], outputRange: [PAD, PAD + travel] });
  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  const isDark = mode === 'dark';
  const pillBg = isDark ? '#1A2136' : '#FFF5D6';
  const pillBorder = isDark ? '#2C3A55' : '#E8D99A';
  const knobBg = isDark ? '#2E3F66' : '#FFFFFF';
  const iconColor = isDark ? '#7EB3FF' : '#F5A300';

  return (
    <TouchableOpacity
      onPress={handleToggle}
      activeOpacity={0.9}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={{
        width: PILL_W,
        height: PILL_H,
        borderRadius: PILL_H / 2,
        backgroundColor: pillBg,
        borderWidth: 1.5,
        borderColor: pillBorder,
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <Animated.View style={{
          width: KNOB,
          height: KNOB,
          borderRadius: KNOB / 2,
          backgroundColor: knobBg,
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.18,
          shadowRadius: 3,
          elevation: 3,
          transform: [{ translateX }, { rotate }],
        }}>
          {isDark ? (
            <MoonIcon color={iconColor} bg={knobBg} size={11} />
          ) : (
            <SunIcon color={iconColor} size={13} />
          )}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

// CARD DESTAQUE
function FeaturedCard({ car, onPress, featW, imgH }: {
  car: Car;
  onPress: () => void;
  featW: number;
  imgH: number;
}) {
  const { T } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.984, useNativeDriver: true, speed: 40 }).start();
  const pressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[
        {
          width: featW,
          backgroundColor: T.surface,
          borderWidth: 1,
          borderColor: T.rule,
          borderRadius: 2,
          overflow: 'hidden',
        },
        { transform: [{ scale: scaleAnim }] },
      ]}>
        <View style={{ width: '100%', height: imgH, backgroundColor: T.placeholder }}>
          {car.image ? (
            <Image source={car.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <ImgBlock />
          )}
        </View>

        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 9, letterSpacing: 3, color: T.inkLight, fontWeight: '700', marginBottom: 4 }}>
              {car.brand.toUpperCase()}
            </Text>
            {car.isUserCar && (
              <View style={{
                backgroundColor: T.accent,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 10,
              }}>
                <Text style={{ fontSize: 8, color: '#FFFFFF', fontWeight: '600' }}>
                  USUÁRIO
                </Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: T.ink, letterSpacing: -0.4 }}>
            {car.name}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: T.inkMid }}>{car.year}</Text>
            <Text style={{ marginHorizontal: 5, color: T.inkLight, fontSize: 12 }}>·</Text>
            <Text style={{ fontSize: 12, color: T.inkMid }}>{CATEGORY_LABEL[car.category]}</Text>
            <Text style={{ marginHorizontal: 5, color: T.inkLight, fontSize: 12 }}>·</Text>
            <Text style={{ fontSize: 12, color: T.inkMid }}>{car.origin}</Text>
          </View>

          <View style={{ height: 1, backgroundColor: T.rule, marginBottom: 12 }} />

          <Text style={{ fontSize: 13, lineHeight: 20, color: T.inkMid }} numberOfLines={2}>
            {car.description}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// CARD LISTA CORRIGIDO – botão excluir agora funciona sem interferência
function ListCard({ car, onPress, onDelete, thumbW, thumbH }: {
  car: Car;
  onPress: () => void;
  onDelete?: () => void;
  thumbW: number;
  thumbH: number;
}) {
  const { T } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14 }}>
      {/* Área clicável principal (imagem + texto) */}
      <TouchableOpacity
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={{
          width: thumbW,
          height: thumbH,
          borderRadius: 2,
          backgroundColor: T.placeholder,
          overflow: 'hidden',
          marginRight: 16,
        }}>
          {car.image ? (
            <Image source={car.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <View style={{ flex: 1, backgroundColor: T.placeholder }} />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 9, letterSpacing: 2, color: T.inkLight, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 }}>
              {car.brand}
            </Text>
            {car.isUserCar && (
              <View style={{
                backgroundColor: car.userId === CURRENT_USER_ID ? T.success : T.accent,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 8,
                marginBottom: 2,
              }}>
                <Text style={{ fontSize: 7, color: '#FFFFFF', fontWeight: '600' }}>
                  {car.userId === CURRENT_USER_ID ? 'SEU' : 'USUÁRIO'}
                </Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: 15, fontWeight: '700', color: T.ink, letterSpacing: -0.2 }} numberOfLines={1}>
            {car.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Text style={{ fontSize: 11, color: T.inkMid }}>{car.year}</Text>
            <Text style={{ marginHorizontal: 5, color: T.inkLight, fontSize: 11 }}>·</Text>
            <Text style={{ fontSize: 11, color: T.inkMid }}>{CATEGORY_LABEL[car.category]}</Text>
            {car.userId && car.userId !== CURRENT_USER_ID && (
              <>
                <Text style={{ marginHorizontal: 5, color: T.inkLight, fontSize: 11 }}>·</Text>
                <Text style={{ fontSize: 11, color: T.accent }}>Público</Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Botão excluir separado, não dentro do TouchableOpacity do card */}
      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: T.danger + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12,
          }}
        >
          <Text style={{ fontSize: 16, color: T.danger, fontWeight: '600' }}>×</Text>
        </TouchableOpacity>
      )}

      <Text style={{ fontSize: 22, color: T.inkLight, fontWeight: '300', marginLeft: onDelete ? 4 : 0 }}>›</Text>
    </View>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  const { T } = useTheme();
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: T.rule,
    }}>
      <Text style={{ fontSize: 13, color: T.inkMid, fontWeight: '400' }}>{label}</Text>
      <Text style={{ fontSize: 13, color: T.ink, fontWeight: '600' }}>{value}</Text>
    </View>
  );
}

// MODAL DETALHE COM OPÇÃO DE EXCLUIR
function DetailSheet({ car, onClose, onDelete, screenHeight }: {
  car: Car;
  onClose: () => void;
  onDelete?: () => void;
  screenHeight: number;
}) {
  const { T, mode } = useTheme();
  const slideY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideY, { toValue: 0, useNativeDriver: true, speed: 22, bounciness: 2 }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [slideY, opacity]);

  const close = () => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: 80, duration: 180, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(onClose);
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Carro',
      `Tem certeza que deseja excluir "${car.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir',
          onPress: () => {
            if (onDelete) {
              onDelete();
              close();
            }
          }
        },
      ]
    );
  };

  const hpStr = car.horsepower > 0 ? `${car.horsepower} cv` : '-';
  const topStr = car.topSpeed > 0 ? `${car.topSpeed} km/h` : '-';
  const sheetImgH = clamp(screenHeight * 0.28, 180, 300);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        StyleSheet.absoluteFill,
        {
          justifyContent: 'flex-end',
          zIndex: 100,
          opacity,
        },
      ]}
    >
      <View style={[StyleSheet.absoluteFill, {
        backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(13,13,13,0.45)',
      }]} />
      
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={close} activeOpacity={1} />

      <Animated.View style={{
        backgroundColor: T.surface,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        maxHeight: screenHeight * 0.92,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
        transform: [{ translateY: slideY }],
      }}>
        <View style={{
          width: 36, 
          height: 4, 
          borderRadius: 2,
          backgroundColor: T.rule, 
          alignSelf: 'center',
          marginTop: 10, 
          marginBottom: 4,
        }} />

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View style={{ width: '100%', height: sheetImgH, backgroundColor: T.placeholder }}>
            {car.image ? (
              <Image source={car.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <ImgBlock style={{ flex: 1, borderRadius: 0 }} />
            )}
          </View>

          <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 11, color: T.inkLight, fontWeight: '500' }}>{car.year}</Text>
              <Text style={{ marginHorizontal: 6, color: T.inkLight, fontSize: 11 }}>·</Text>
              <Text style={{ fontSize: 11, color: T.inkLight, fontWeight: '500' }}>{CATEGORY_LABEL[car.category]}</Text>
              <Text style={{ marginHorizontal: 6, color: T.inkLight, fontSize: 11 }}>·</Text>
              <Text style={{ fontSize: 11, color: T.inkLight, fontWeight: '500' }}>{car.origin}</Text>
              {car.isUserCar && (
                <>
                  <Text style={{ marginHorizontal: 6, color: T.inkLight, fontSize: 11 }}>·</Text>
                  <Text style={{ fontSize: 11, color: car.userId === CURRENT_USER_ID ? T.success : T.accent, fontWeight: '600' }}>
                    {car.userId === CURRENT_USER_ID ? 'Seu carro' : 'Carro público'}
                  </Text>
                </>
              )}
            </View>
            <Text style={{ fontSize: 10, letterSpacing: 3, color: T.inkLight, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 }}>
              {car.brand}
            </Text>
            <Text style={{ fontSize: 28, fontWeight: '900', color: T.ink, letterSpacing: -1 }}>
              {car.name}
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: T.rule, marginHorizontal: 24 }} />

          <View style={{ paddingHorizontal: 24, paddingVertical: 20 }}>
            <Text style={{ fontSize: 9, letterSpacing: 3, color: T.inkLight, fontWeight: '700', textTransform: 'uppercase', marginBottom: 12 }}>
              Sobre
            </Text>
            <Text style={{ fontSize: 14, lineHeight: 22, color: T.inkMid, fontWeight: '400' }}>
              {car.description}
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: T.rule, marginHorizontal: 24 }} />

          <View style={{ paddingHorizontal: 24, paddingVertical: 20 }}>
            <Text style={{ fontSize: 9, letterSpacing: 3, color: T.inkLight, fontWeight: '700', textTransform: 'uppercase', marginBottom: 12 }}>
              Especificacoes
            </Text>
            <SpecRow label="Motor" value={car.engine} />
            <SpecRow label="Potencia" value={hpStr} />
            <SpecRow label="Torque" value={car.torque} />
            <SpecRow label="Velocidade max." value={topStr} />
            <SpecRow label="0 a 100 km/h" value={car.acceleration} />
            <SpecRow label="Preco" value={car.price} />
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>

        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 24, marginTop: 8 }}>
          {onDelete && (
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 14,
                backgroundColor: T.danger,
                borderRadius: 2,
                alignItems: 'center',
              }}
              onPress={handleDelete}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
                Excluir
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              flex: onDelete ? 1 : 2,
              paddingVertical: 14,
              backgroundColor: T.ink,
              borderRadius: 2,
              alignItems: 'center',
            }}
            onPress={close}
          >
            <Text style={{ color: T.closeBtnText, fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// MODAL ADICIONAR CARRO - DESIGN MELHORADO
function AddCarModal({ visible, onClose, onAddCar }: {
  visible: boolean;
  onClose: () => void;
  onAddCar: (car: Car) => void;
}) {
  const { T } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para campos do formulário
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState('');
  const [horsepower, setHorsepower] = useState('');
  const [torque, setTorque] = useState('');
  const [engine, setEngine] = useState('');
  const [topSpeed, setTopSpeed] = useState('');
  const [acceleration, setAcceleration] = useState('');
  const [price, setPrice] = useState('');
  const [origin, setOrigin] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Personalizado');

  // Função para lidar com upload de imagem
  const handleImageUpload = useCallback(() => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback((event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleAddCar = () => {
    if (!name || !brand || !year) {
      Alert.alert('Erro', 'Preencha pelo menos nome, marca e ano.');
      return;
    }

    const newCar: Car = {
      id: `car_${Date.now()}`,
      name,
      brand,
      year: parseInt(year) || 0,
      horsepower: parseInt(horsepower) || 0,
      torque: torque || '-',
      engine: engine || '-',
      topSpeed: parseInt(topSpeed) || 0,
      acceleration: acceleration || '-',
      price: price || 'Preço não informado',
      category,
      image: selectedImage ? { uri: selectedImage } : require('./cars/placeholder.png'),
      description: description || 'Carro adicionado pelo usuário.',
      origin: origin || 'Desconhecida',
      featured: false,
      isUserCar: true,
      userId: CURRENT_USER_ID,
      createdAt: new Date().toISOString(),
    };

    onAddCar(newCar);
    Alert.alert('Sucesso', 'Carro adicionado com sucesso!');
    
    // Limpar campos
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setBrand('');
    setYear('');
    setHorsepower('');
    setTorque('');
    setEngine('');
    setTopSpeed('');
    setAcceleration('');
    setPrice('');
    setOrigin('');
    setDescription('');
    setCategory('Personalizado');
    setSelectedImage(null);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep === 1 && (!name || !brand || !year)) {
      Alert.alert('Erro', 'Preencha nome, marca e ano para continuar.');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          backgroundColor: T.surfaceRaised,
          borderRadius: 20,
          width: '90%',
          maxWidth: 600,
          maxHeight: '90%',
          overflow: 'hidden',
        }}>
          {/* Cabeçalho do Modal */}
          <View style={{
            backgroundColor: T.accent,
            padding: 30,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
            <Text style={{
              fontSize: 28,
              fontWeight: '800',
              color: '#FFFFFF',
              textAlign: 'center',
            }}>
              {currentStep === 1 ? 'Adicionar Novo Carro' : 'Detalhes Técnicos'}
            </Text>
            <Text style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              marginTop: 8,
            }}>
              {currentStep === 1 ? 'Preencha as informações básicas' : 'Especificações e imagem'}
            </Text>
            
            {/* Indicador de Passos */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 20,
              gap: 8,
            }}>
              {[1, 2].map((step) => (
                <View key={step} style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: step <= currentStep ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
                  transform: [{ scale: step === currentStep ? 1.2 : 1 }],
                }} />
              ))}
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ padding: 25 }}>
              {currentStep === 1 ? (
                // PASSO 1: Informações Básicas
                <View style={{ gap: 15 }}>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: T.inkMid }]}>NOME DO CARRO *</Text>
                    <TextInput
                      style={[styles.inputStyled, { 
                        backgroundColor: T.placeholder,
                        color: T.ink,
                        borderColor: T.rule,
                      }]}
                      placeholder="Ex: Civic Type R"
                      placeholderTextColor={T.inkLight}
                      value={name}
                      onChangeText={setName}
                    />
                  </View>

                  <View style={{ flexDirection: 'row', gap: 15 }}>
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                      <Text style={[styles.inputLabel, { color: T.inkMid }]}>MARCA *</Text>
                      <TextInput
                        style={[styles.inputStyled, { 
                          backgroundColor: T.placeholder,
                          color: T.ink,
                          borderColor: T.rule,
                        }]}
                        placeholder="Ex: Honda"
                        placeholderTextColor={T.inkLight}
                        value={brand}
                        onChangeText={setBrand}
                      />
                    </View>
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                      <Text style={[styles.inputLabel, { color: T.inkMid }]}>ANO *</Text>
                      <TextInput
                        style={[styles.inputStyled, { 
                          backgroundColor: T.placeholder,
                          color: T.ink,
                          borderColor: T.rule,
                        }]}
                        placeholder="Ex: 2023"
                        placeholderTextColor={T.inkLight}
                        value={year}
                        onChangeText={setYear}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: T.inkMid }]}>PAÍS DE ORIGEM</Text>
                    <TextInput
                      style={[styles.inputStyled, { 
                        backgroundColor: T.placeholder,
                        color: T.ink,
                        borderColor: T.rule,
                      }]}
                      placeholder="Ex: Japão"
                      placeholderTextColor={T.inkLight}
                      value={origin}
                      onChangeText={setOrigin}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: T.inkMid }]}>CATEGORIA</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      {['Sport', 'SUV', 'Sedan', 'Classico', 'Eletrico', 'Personalizado'].map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          onPress={() => setCategory(cat as Category)}
                          style={[
                            styles.categoryButton,
                            {
                              backgroundColor: category === cat ? T.accent : T.placeholder,
                              borderColor: category === cat ? T.accent : T.rule,
                            }
                          ]}
                        >
                          <Text style={{
                            fontSize: 11,
                            fontWeight: '600',
                            color: category === cat ? '#FFFFFF' : T.inkMid,
                          }}>
                            {CATEGORY_LABEL[cat]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: T.inkMid }]}>DESCRIÇÃO</Text>
                    <TextInput
                      style={[styles.inputStyled, styles.textAreaStyled, { 
                        backgroundColor: T.placeholder,
                        color: T.ink,
                        borderColor: T.rule,
                      }]}
                      placeholder="Descreva o carro em poucas palavras..."
                      placeholderTextColor={T.inkLight}
                      value={description}
                      onChangeText={setDescription}
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                </View>
              ) : (
                // PASSO 2: Detalhes Técnicos e Imagem
                <View style={{ gap: 15 }}>
                  {/* Upload de Imagem */}
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: T.inkMid }]}>IMAGEM DO CARRO</Text>
                    <TouchableOpacity
                      onPress={handleImageUpload}
                      style={[styles.imageUploadArea, {
                        backgroundColor: T.placeholder,
                        borderColor: T.rule,
                      }]}
                    >
                      {selectedImage ? (
                        <Image 
                          source={{ uri: selectedImage }} 
                          style={{ width: '100%', height: '100%', borderRadius: 10 }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={{ alignItems: 'center', gap: 10 }}>
                          <Text style={{ fontSize: 40, opacity: 0.3 }}>📷</Text>
                          <Text style={{ fontSize: 14, color: T.inkMid, textAlign: 'center' }}>
                            Clique para adicionar uma imagem
                          </Text>
                          <Text style={{ fontSize: 11, color: T.inkLight, textAlign: 'center' }}>
                            Formatos: JPG, PNG, GIF
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    
                    {/* Input file oculto para web */}
                    {Platform.OS === 'web' && (
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                    )}
                  </View>

                  <View style={{ flexDirection: 'row', gap: 15 }}>
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                      <Text style={[styles.inputLabel, { color: T.inkMid }]}>POTÊNCIA (CV)</Text>
                      <TextInput
                        style={[styles.inputStyled, { 
                          backgroundColor: T.placeholder,
                          color: T.ink,
                          borderColor: T.rule,
                        }]}
                        placeholder="Ex: 320"
                        placeholderTextColor={T.inkLight}
                        value={horsepower}
                        onChangeText={setHorsepower}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                      <Text style={[styles.inputLabel, { color: T.inkMid }]}>TORQUE</Text>
                      <TextInput
                        style={[styles.inputStyled, { 
                          backgroundColor: T.placeholder,
                          color: T.ink,
                          borderColor: T.rule,
                        }]}
                        placeholder="Ex: 400 Nm"
                        placeholderTextColor={T.inkLight}
                        value={torque}
                        onChangeText={setTorque}
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: T.inkMid }]}>MOTOR</Text>
                    <TextInput
                      style={[styles.inputStyled, { 
                        backgroundColor: T.placeholder,
                        color: T.ink,
                        borderColor: T.rule,
                      }]}
                      placeholder="Ex: 2.0 Turbo 4 cilindros"
                      placeholderTextColor={T.inkLight}
                      value={engine}
                      onChangeText={setEngine}
                    />
                  </View>

                  <View style={{ flexDirection: 'row', gap: 15 }}>
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                      <Text style={[styles.inputLabel, { color: T.inkMid }]}>VELOCIDADE MÁX. (KM/H)</Text>
                      <TextInput
                        style={[styles.inputStyled, { 
                          backgroundColor: T.placeholder,
                          color: T.ink,
                          borderColor: T.rule,
                        }]}
                        placeholder="Ex: 250"
                        placeholderTextColor={T.inkLight}
                        value={topSpeed}
                        onChangeText={setTopSpeed}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                      <Text style={[styles.inputLabel, { color: T.inkMid }]}>0-100 KM/H</Text>
                      <TextInput
                        style={[styles.inputStyled, { 
                          backgroundColor: T.placeholder,
                          color: T.ink,
                          borderColor: T.rule,
                        }]}
                        placeholder="Ex: 5.8s"
                        placeholderTextColor={T.inkLight}
                        value={acceleration}
                        onChangeText={setAcceleration}
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: T.inkMid }]}>PREÇO ESTIMADO</Text>
                    <TextInput
                      style={[styles.inputStyled, { 
                        backgroundColor: T.placeholder,
                        color: T.ink,
                        borderColor: T.rule,
                      }]}
                      placeholder="Ex: R$ 250.000"
                      placeholderTextColor={T.inkLight}
                      value={price}
                      onChangeText={setPrice}
                    />
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Botões de Navegação */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: T.rule,
            gap: 15,
          }}>
            {currentStep === 2 ? (
              <TouchableOpacity
                style={[styles.navigationButton, { backgroundColor: T.placeholder, borderColor: T.rule }]}
                onPress={prevStep}
              >
                <Text style={[styles.navigationButtonText, { color: T.inkMid }]}>← Voltar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navigationButton, { backgroundColor: T.danger }]}
                onPress={onClose}
              >
                <Text style={styles.navigationButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
            
            {currentStep === 1 ? (
              <TouchableOpacity
                style={[styles.navigationButton, { backgroundColor: T.accent }]}
                onPress={nextStep}
              >
                <Text style={styles.navigationButtonText}>Próximo →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navigationButton, { backgroundColor: T.success }]}
                onPress={handleAddCar}
              >
                <Text style={styles.navigationButtonText}>✓ Adicionar Carro</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

// BOTAO ADICIONAR
function AddButton({ onPress }: { onPress: () => void }) {
  const { T } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 0.9, useNativeDriver: true, speed: 50 }),
        Animated.timing(rotateAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }),
        Animated.timing(rotateAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]),
    ]).start();
    
    onPress();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <TouchableOpacity
      onPress={animateButton}
      activeOpacity={0.8}
      style={{
        position: 'absolute',
        bottom: 30,
        right: 30,
        zIndex: 200,
        // Remova qualquer fundo ou sombra daqui
        backgroundColor: 'transparent',
      }}
    >
      <Animated.View style={{
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: T.cta,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
        transform: [{ scale: scaleAnim }, { rotate }],
        // Aplique a sombra diretamente no círculo
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
      }}>
        <Text style={{
          color: '#FFFFFF',
          fontSize: 32,
          fontWeight: '200',
          marginTop: -3,
        }}>
          +
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// TELA PRINCIPAL
function MainPageInner() {
  const { T, mode } = useTheme();
  const { width: W, height: H } = useWindowDimensions();

  const hp = (v: number) => clamp((v / 390) * W, v * 0.75, v * 1.25);
  const featW = clamp(W - 64, 260, 520);
  const featImgH = clamp(W * 0.48, 160, 280);
  const thumbW = clamp(W * 0.18, 60, 100);
  const thumbH = Math.round(thumbW * 0.72);
  const mastheadFontSize = clamp(hp(44), 32, 60);
  const padH = clamp(hp(24), 16, 40);

  const [category, setCategory] = useState<'Todos' | Category>('Todos');
  const [selected, setSelected] = useState<Car | null>(null);
  const [addCarModalVisible, setAddCarModalVisible] = useState(false);
  const [carDatabase, setCarDatabase] = useState<CarDatabase>(CARROS_DB);

  // Inicializar banco de dados
  useEffect(() => {
    loadDatabase();
  }, []);

  const loadDatabase = async () => {
    try {
      const storedDB = await AsyncStorage.getItem('carrosdb');
      if (storedDB) {
        setCarDatabase(JSON.parse(storedDB));
      } else {
        // Inicializar com dados padrão
        const initialDB = {
          ...CARROS_DB,
          users: {
            [CURRENT_USER_ID]: {
              username: CURRENT_USERNAME,
              cars: []
            }
          }
        };
        await AsyncStorage.setItem('carrosdb', JSON.stringify(initialDB));
        setCarDatabase(initialDB);
      }
    } catch (error) {
      console.error('Erro ao carregar banco de dados:', error);
      setCarDatabase({
        ...CARROS_DB,
        users: {
          [CURRENT_USER_ID]: {
            username: CURRENT_USERNAME,
            cars: []
          }
        }
      });
    }
  };

  const saveDatabase = async (db: CarDatabase) => {
    try {
      await AsyncStorage.setItem('carrosdb', JSON.stringify(db));
      setCarDatabase(db);
    } catch (error) {
      console.error('Erro ao salvar banco de dados:', error);
    }
  };

  const handleAddCar = (newCar: Car) => {
    const updatedDB = { ...carDatabase };
    
    if (!updatedDB.users[CURRENT_USER_ID]) {
      updatedDB.users[CURRENT_USER_ID] = {
        username: CURRENT_USERNAME,
        cars: []
      };
    }
    
    updatedDB.users[CURRENT_USER_ID].cars.push(newCar);
    saveDatabase(updatedDB);
  };

  const handleDeleteCar = (carId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este carro? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir',
          onPress: () => {
            const updatedDB = { ...carDatabase };
            if (updatedDB.users[CURRENT_USER_ID]) {
              updatedDB.users[CURRENT_USER_ID].cars = 
                updatedDB.users[CURRENT_USER_ID].cars.filter(car => car.id !== carId);
            }
            saveDatabase(updatedDB);
            setSelected(null);
            Alert.alert('Sucesso', 'Carro excluído com sucesso!');
          }
        },
      ]
    );
  };

  // Obter carros do usuário atual
  const userCars = carDatabase.users[CURRENT_USER_ID]?.cars || [];
  
  const otherUsersCars = Object.entries(carDatabase.users)
    .filter(([userId]) => userId !== CURRENT_USER_ID)
    .flatMap(([_, userData]) => userData.cars);

  const allCars = [...carDatabase.defaultCars, ...userCars, ...otherUsersCars];
  const featured = allCars.filter(c => c.featured);
  const list = category === 'Todos' 
    ? allCars 
    : category === 'Personalizado'
      ? userCars
      : allCars.filter(c => c.category === category);

  const renderFeatured = useCallback(({ item }: { item: Car }) => (
    <FeaturedCard
      car={item}
      onPress={() => setSelected(item)}
      featW={featW}
      imgH={featImgH}
    />
  ), [featW, featImgH]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={T.bg}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        <View style={{ paddingHorizontal: padH, paddingTop: 28, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, letterSpacing: 4, color: T.inkLight, fontWeight: '600', marginBottom: 6 }}>
                GARAGEM
              </Text>
              <Text style={{ fontSize: mastheadFontSize, fontWeight: '900', color: T.ink, letterSpacing: -2, lineHeight: mastheadFontSize * 1.05 }}>
                Colecao
              </Text>
              <Text style={{ fontSize: 13, color: T.inkMid, marginTop: 6, fontWeight: '400' }}>
                {allCars.length} {allCars.length === 1 ? 'veiculo' : 'veiculos'}
                {userCars.length > 0 && ` (${userCars.length} seus)`}
              </Text>
            </View>
            <View style={{ paddingTop: 4 }}>
              <ThemeToggle />
            </View>
          </View>
        </View>

        <View style={{ height: 2, backgroundColor: T.ruleHeavy }} />

        {featured.length > 0 && (
          <View style={{ paddingVertical: 20 }}>
            <Text style={{ fontSize: 9, letterSpacing: 3, color: T.inkLight, fontWeight: '700', paddingHorizontal: padH, marginBottom: 16 }}>
              EM DESTAQUE
            </Text>
            <FlatList
              data={featured}
              keyExtractor={c => c.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: padH, paddingRight: padH, gap: 12 }}
              renderItem={renderFeatured}
              snapToInterval={featW + 12}
              decelerationRate="fast"
            />
          </View>
        )}

        <View style={{ height: 2, backgroundColor: T.ruleHeavy }} />

        <View style={{ paddingVertical: 20 }}>
          <Text style={{ fontSize: 9, letterSpacing: 3, color: T.inkLight, fontWeight: '700', paddingHorizontal: padH, marginBottom: 14 }}>
            CATEGORIA
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: padH, gap: 8 }}>
            {CATEGORIES.map(cat => {
              const active = category === cat;
              const isUserCat = cat === 'Personalizado';
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderWidth: 1,
                    borderColor: active ? (isUserCat ? T.cta : T.ink) : T.rule,
                    borderRadius: 2,
                    backgroundColor: active ? (isUserCat ? T.cta : T.ink) : 'transparent',
                  }}
                >
                  <Text style={{ fontSize: 12, color: active ? T.closeBtnText : T.inkMid, fontWeight: '500', letterSpacing: 0.5 }}>
                    {CATEGORY_LABEL[cat]}
                    {isUserCat && userCars.length > 0 ? ` (${userCars.length})` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ height: 1, backgroundColor: T.rule }} />

        <View style={{ paddingTop: 4 }}>
          {list.map((car, i) => (
            <React.Fragment key={car.id}>
              <ListCard 
                car={car} 
                onPress={() => setSelected(car)} 
                onDelete={car.userId === CURRENT_USER_ID ? () => handleDeleteCar(car.id) : undefined}
                thumbW={thumbW} 
                thumbH={thumbH} 
              />
              {i < list.length - 1 && <View style={{ height: 1, backgroundColor: T.rule }} />}
            </React.Fragment>
          ))}

          {list.length === 0 && (
            <Text style={{ paddingHorizontal: padH, paddingVertical: 32, color: T.inkLight, fontSize: 13 }}>
              Nenhum veiculo nesta categoria.
            </Text>
          )}
        </View>

        {userCars.length > 0 && category !== 'Personalizado' && (
          <View style={{ marginTop: 20 }}>
            <View style={{ height: 2, backgroundColor: T.ruleHeavy }} />
            <Text style={{ fontSize: 9, letterSpacing: 3, color: T.inkLight, fontWeight: '700', paddingHorizontal: padH, marginTop: 20, marginBottom: 16 }}>
              SUA BIBLIOTECA
            </Text>
            {userCars.map((car, i) => (
              <React.Fragment key={car.id}>
                <ListCard 
                  car={car} 
                  onPress={() => setSelected(car)} 
                  onDelete={() => handleDeleteCar(car.id)}
                  thumbW={thumbW} 
                  thumbH={thumbH} 
                />
                {i < userCars.length - 1 && <View style={{ height: 1, backgroundColor: T.rule }} />}
              </React.Fragment>
            ))}
          </View>
        )}

        {otherUsersCars.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <View style={{ height: 2, backgroundColor: T.ruleHeavy }} />
            <Text style={{ fontSize: 9, letterSpacing: 3, color: T.accent, fontWeight: '700', paddingHorizontal: padH, marginTop: 20, marginBottom: 16 }}>
              CARROS DA COMUNIDADE
            </Text>
            {otherUsersCars.map((car, i) => (
              <React.Fragment key={car.id}>
                <ListCard 
                  car={car} 
                  onPress={() => setSelected(car)} 
                  thumbW={thumbW} 
                  thumbH={thumbH} 
                />
                {i < otherUsersCars.length - 1 && <View style={{ height: 1, backgroundColor: T.rule }} />}
              </React.Fragment>
            ))}
          </View>
        )}
      </ScrollView>

      <AddButton onPress={() => setAddCarModalVisible(true)} />

      {selected && (
        <DetailSheet
          car={selected}
          onClose={() => setSelected(null)}
          onDelete={selected.userId === CURRENT_USER_ID ? () => handleDeleteCar(selected.id) : undefined}
          screenHeight={H}
        />
      )}

      <AddCarModal
        visible={addCarModalVisible}
        onClose={() => {
          setAddCarModalVisible(false);
        }}
        onAddCar={handleAddCar}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  inputStyled: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    fontWeight: '500',
  },
  textAreaStyled: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  imageUploadArea: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 3,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  navigationButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  navigationButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

// Sistema de temas
export default function MainPage() {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');

  const toggle = useCallback(() => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, T: THEMES[mode], toggle }}>
      <MainPageInner />
    </ThemeContext.Provider>
  );
}