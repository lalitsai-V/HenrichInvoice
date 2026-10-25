export interface VehicleMakeData {
  make: string;
  aliases?: string[];
  models: string[];
}

export const VEHICLE_CATALOGUE: VehicleMakeData[] = [
  {
    make: 'Maruti Suzuki',
    aliases: ['Maruti', 'Suzuki', 'MS'],
    models: [
      'Swift',
      'Baleno',
      'Brezza',
      'Vitara Brezza',
      'Dzire',
      'Swift Dzire',
      'Ertiga',
      'WagonR',
      'Fronx',
      'Grand Vitara',
      'Alto',
      'Alto 800',
      'Alto K10',
      'Jimny',
      'Ciaz',
      'XL6',
      'Ignis',
      'S-Presso',
      'Celerio',
      'Celerio X',
      'Invicto',
      'Eeco',
      'Ritz',
      'SX4',
      'Zen',
      'Zen Estilo',
      'Estilo',
      'Esteem',
      'Maruti 800',
      'Omni',
      'Gypsy',
      'A-Star',
      'Stingray',
      'Kizashi',
      'Versa',
      'Maruti 1000',
      'Tour S',
      'Tour M',
      'Tour H1',
      'Super Carry',
    ],
  },
  {
    make: 'Hyundai',
    aliases: ['HMC'],
    models: [
      'Creta',
      'Creta N Line',
      'Venue',
      'Venue N Line',
      'i20',
      'Elite i20',
      'i20 Active',
      'i20 N Line',
      'Grand i10 Nios',
      'Grand i10',
      'i10',
      'Verna',
      'Verna Transform',
      'Exter',
      'Alcazar',
      'Tucson',
      'Aura',
      'Santro',
      'Santro Xing',
      'Xcent',
      'Eon',
      'Getz',
      'Getz Prime',
      'Elantra',
      'Sonata',
      'Sonata Embera',
      'Sonata Transform',
      'Accent',
      'Santa Fe',
      'Terracan',
      'Kona Electric',
      'Ioniq 5',
    ],
  },
  {
    make: 'Tata Motors',
    aliases: ['Tata'],
    models: [
      'Nexon',
      'Nexon EV',
      'Punch',
      'Punch EV',
      'Harrier',
      'Safari',
      'Safari Storme',
      'Curvv',
      'Curvv EV',
      'Altroz',
      'Altroz Racer',
      'Tiago',
      'Tiago NRG',
      'Tiago EV',
      'Tigor',
      'Tigor EV',
      'Hexa',
      'Aria',
      'Indica',
      'Indica V2',
      'Indica Vista',
      'Indigo',
      'Indigo CS',
      'Indigo Manza',
      'Indigo Marina',
      'Bolt',
      'Zest',
      'Sumo',
      'Sumo Gold',
      'Sumo Grande',
      'Sumo Spacio',
      'Sierra',
      'Estate',
      'Nano',
      'Nano GenX',
      'Movus',
      'Venture',
      'Magic',
      'Winger',
      'Xenon',
    ],
  },
  {
    make: 'Mahindra',
    aliases: ['M&M', 'Mahindra & Mahindra'],
    models: [
      'Thar',
      'Thar Roxx',
      'Thar CRDe',
      'Scorpio',
      'Scorpio-N',
      'Scorpio Classic',
      'Scorpio Getaway',
      'XUV700',
      'XUV 3XO',
      'XUV300',
      'XUV500',
      'XUV400 EV',
      'Bolero',
      'Bolero Neo',
      'Bolero Neo Plus',
      'Bolero Camper',
      'Bolero Maxi Truck',
      'Marazzo',
      'Alturas G4',
      'Xylo',
      'Quanto',
      'NuvoSport',
      'TUV300',
      'TUV300 Plus',
      'KUV100',
      'KUV100 NXT',
      'Verito',
      'Verito Vibe',
      'e-Verito',
      'e2o',
      'e2o Plus',
      'Armada',
      'Commander',
      'Marshal',
      'Major',
      'Classic',
      'CJ340',
      'Voyager',
      'Maxx',
    ],
  },
  {
    make: 'Toyota',
    aliases: ['TKM'],
    models: [
      'Innova',
      'Innova Crysta',
      'Innova Hycross',
      'Fortuner',
      'Fortuner Legender',
      'Urban Cruiser Hyryder',
      'Urban Cruiser Taisor',
      'Urban Cruiser',
      'Glanza',
      'Rumion',
      'Hilux',
      'Camry',
      'Camry Hybrid',
      'Vellfire',
      'Corolla',
      'Corolla Altis',
      'Etios',
      'Etios Liva',
      'Etios Cross',
      'Yaris',
      'Qualis',
      'Land Cruiser',
      'Land Cruiser Prado',
      'Prius',
      'RAV4',
    ],
  },
  {
    make: 'Kia',
    aliases: [],
    models: [
      'Seltos',
      'Sonet',
      'Carens',
      'Carnival',
      'EV6',
      'EV9',
      'Clavis',
    ],
  },
  {
    make: 'Honda',
    aliases: [],
    models: [
      'City',
      'City e:HEV Hybrid',
      'City 4th Gen',
      'City ZX',
      'Amaze',
      'Elevate',
      'WR-V',
      'Jazz',
      'Civic',
      'CR-V',
      'BR-V',
      'Mobilio',
      'Brio',
      'Accord',
      'Accord Hybrid',
    ],
  },
  {
    make: 'Volkswagen',
    aliases: ['VW'],
    models: [
      'Virtus',
      'Taigun',
      'Polo',
      'Polo GT',
      'Polo Cross',
      'Vento',
      'Ameo',
      'Tiguan',
      'Tiguan Allspace',
      'T-Roc',
      'Jetta',
      'Passat',
      'Beetle',
      'Touareg',
    ],
  },
  {
    make: 'Skoda',
    aliases: [],
    models: [
      'Slavia',
      'Kushaq',
      'Kylaq',
      'Kodiaq',
      'Superb',
      'Octavia',
      'Octavia vRS',
      'Rapid',
      'Karoq',
      'Laura',
      'Fabia',
      'Yeti',
    ],
  },
  {
    make: 'MG',
    aliases: ['Morris Garages', 'MG Motor'],
    models: [
      'Hector',
      'Hector Plus',
      'Astor',
      'ZS EV',
      'Windsor EV',
      'Comet EV',
      'Gloster',
      'Cyberster',
    ],
  },
  {
    make: 'Renault',
    aliases: [],
    models: [
      'Kwid',
      'Triber',
      'Kiger',
      'Duster',
      'Lodgy',
      'Pulse',
      'Scala',
      'Captur',
      'Fluence',
      'Koleos',
    ],
  },
  {
    make: 'Nissan',
    aliases: [],
    models: [
      'Magnite',
      'Kicks',
      'Micra',
      'Micra Active',
      'Sunny',
      'Terrano',
      'X-Trail',
      'Evalia',
      'Teana',
      'GT-R',
      '370Z',
    ],
  },
  {
    make: 'Ford',
    aliases: [],
    models: [
      'EcoSport',
      'Endeavour',
      'Figo',
      'Figo Aspire',
      'Aspire',
      'Freestyle',
      'Fiesta',
      'Fiesta Classic',
      'Ikon',
      'Fusion',
      'Mondeo',
      'Mustang',
    ],
  },
  {
    make: 'Chevrolet',
    aliases: ['Chevy', 'GM'],
    models: [
      'Beat',
      'Spark',
      'Cruze',
      'Tavera',
      'Sail',
      'Sail Hatchback',
      'Enjoy',
      'Optra',
      'Optra Magnum',
      'Optra SRV',
      'Aveo',
      'Aveo U-VA',
      'Captiva',
      'Trailblazer',
    ],
  },
  {
    make: 'Fiat',
    aliases: ['FCA', 'Abarth'],
    models: [
      'Punto',
      'Grande Punto',
      'Punto Evo',
      'Punto Abarth',
      'Avventura',
      'Urban Cross',
      'Linea',
      'Linea Classic',
      'Palio',
      'Palio Stile',
      'Palio Weekend',
      'Palio Adventure',
      'Siena',
      'Petra',
      'Uno',
      'Fiat 500',
    ],
  },
  {
    make: 'Jeep',
    aliases: [],
    models: [
      'Compass',
      'Meridian',
      'Wrangler',
      'Grand Cherokee',
      'Cherokee',
    ],
  },
  {
    make: 'Citroen',
    aliases: ['PSA'],
    models: [
      'C3',
      'C3 Aircross',
      'eC3',
      'Basalt',
      'C5 Aircross',
    ],
  },
  {
    make: 'BMW',
    aliases: ['Bimmer'],
    models: [
      '3 Series',
      '3 Series Gran Limousine',
      '3 Series GT',
      '5 Series',
      '6 Series GT',
      '7 Series',
      '2 Series Gran Coupe',
      'M340i',
      'X1',
      'X3',
      'X4',
      'X5',
      'X6',
      'X7',
      'XM',
      'Z4',
      'M2',
      'M3',
      'M4',
      'M5',
      'M8',
      'iX1',
      'i4',
      'i5',
      'i7',
      'iX',
    ],
  },
  {
    make: 'Mercedes-Benz',
    aliases: ['Mercedes', 'Benz', 'MB'],
    models: [
      'C-Class',
      'E-Class',
      'S-Class',
      'A-Class',
      'A-Class Limousine',
      'B-Class',
      'CLA',
      'CLS',
      'GLA',
      'GLB',
      'GLC',
      'GLE',
      'GLS',
      'G-Class',
      'G-Wagon',
      'Maybach S-Class',
      'Maybach GLS',
      'AMG A 45',
      'AMG C 43',
      'AMG C 63',
      'AMG E 53',
      'AMG E 63',
      'AMG G 63',
      'AMG GT',
      'EQA',
      'EQB',
      'EQE',
      'EQS',
      'V-Class',
      'C 200',
      'E 220d',
    ],
  },
  {
    make: 'Audi',
    aliases: [],
    models: [
      'A3',
      'A4',
      'A6',
      'A8L',
      'Q2',
      'Q3',
      'Q3 Sportback',
      'Q5',
      'Q7',
      'Q8',
      'RS5',
      'RS7',
      'RS Q8',
      'TT',
      'R8',
      'e-tron',
      'e-tron GT',
      'Q8 e-tron',
    ],
  },
  {
    make: 'Land Rover',
    aliases: ['Range Rover', 'LR'],
    models: [
      'Defender 90',
      'Defender 110',
      'Defender 130',
      'Discovery',
      'Discovery Sport',
      'Range Rover',
      'Range Rover Sport',
      'Range Rover Velar',
      'Range Rover Evoque',
      'Freelander 2',
    ],
  },
  {
    make: 'Jaguar',
    aliases: ['JLR'],
    models: [
      'XE',
      'XF',
      'XJ',
      'F-Pace',
      'E-Pace',
      'F-Type',
      'I-Pace',
    ],
  },
  {
    make: 'Volvo',
    aliases: [],
    models: [
      'XC40',
      'XC40 Recharge',
      'EX40',
      'XC60',
      'XC90',
      'S60',
      'S60 Cross Country',
      'S90',
      'V40',
      'V40 Cross Country',
      'V90 Cross Country',
      'C40 Recharge',
    ],
  },
  {
    make: 'Porsche',
    aliases: [],
    models: [
      'Macan',
      'Macan EV',
      'Cayenne',
      'Cayenne Coupe',
      'Panamera',
      '718 Boxster',
      '718 Cayman',
      '911 Carrera',
      '911 GT3',
      'Taycan',
    ],
  },
  {
    make: 'Lexus',
    aliases: [],
    models: [
      'ES 300h',
      'NX 350h',
      'RX 350h',
      'RX 500h',
      'LX 500d',
      'LX 600',
      'LM 350h',
      'LS 500h',
      'LC 500h',
    ],
  },
  {
    make: 'Mini',
    aliases: ['Mini Cooper'],
    models: [
      'Cooper 3-Door',
      'Cooper 5-Door',
      'Cooper S',
      'Countryman',
      'Clubman',
      'Cooper SE Electric',
      'Convertible',
      'John Cooper Works',
    ],
  },
  {
    make: 'BYD',
    aliases: ['Build Your Dreams'],
    models: [
      'Atto 3',
      'Seal',
      'eMAX 7',
      'e6',
    ],
  },
  {
    make: 'Force Motors',
    aliases: ['Force', 'Bajaj Tempo'],
    models: [
      'Gurkha',
      'Gurkha 5-Door',
      'Trax Cruiser',
      'Trax Toofan',
      'Cruiser Deluxe',
      'Urbania',
      'Citiline',
      'Tempo Traveller',
    ],
  },
  {
    make: 'Isuzu',
    aliases: [],
    models: [
      'D-Max V-Cross',
      'D-Max Hi-Lander',
      'D-Max S-Cab',
      'D-Max',
      'MU-X',
      'MU-7',
    ],
  },
  {
    make: 'Mitsubishi',
    aliases: ['MMC'],
    models: [
      'Pajero',
      'Pajero Sport',
      'Lancer',
      'Cedia',
      'Outlander',
      'Montero',
    ],
  },
  {
    make: 'Hindustan Motors',
    aliases: ['HM', 'Ambassador'],
    models: [
      'Ambassador',
      'Ambassador Grand',
      'Ambassador Classic',
      'Ambassador Avigo',
      'Contessa',
      'Trekker',
    ],
  },
  {
    make: 'Premier',
    aliases: ['PAL'],
    models: [
      'Padmini',
      '118 NE',
      '138 D',
      'Rio',
    ],
  },
  {
    make: 'Daewoo',
    aliases: [],
    models: [
      'Matiz',
      'Cielo',
      'Nexia',
    ],
  },
  {
    make: 'Opel',
    aliases: [],
    models: [
      'Astra',
      'Corsa',
      'Corsa Sail',
      'Corsa Swing',
      'Vectra',
    ],
  },
  {
    make: 'Maserati',
    aliases: [],
    models: [
      'Ghibli',
      'Levante',
      'Quattroporte',
      'Grecale',
      'MC20',
    ],
  },
  {
    make: 'Ferrari',
    aliases: [],
    models: [
      'Roma',
      '296 GTB',
      'F8 Tributo',
      'Portofino',
      '488 GTB',
      'SF90 Stradale',
      'Purosangue',
      '812 Superfast',
    ],
  },
  {
    make: 'Lamborghini',
    aliases: ['Lambo'],
    models: [
      'Urus',
      'Urus S',
      'Urus Performante',
      'Huracan',
      'Huracan Evo',
      'Revuelto',
      'Aventador',
    ],
  },
  {
    make: 'Bentley',
    aliases: [],
    models: [
      'Continental GT',
      'Flying Spur',
      'Bentayga',
    ],
  },
  {
    make: 'Rolls-Royce',
    aliases: ['Rolls Royce', 'RR'],
    models: [
      'Ghost',
      'Phantom',
      'Cullinan',
      'Spectre',
      'Wraith',
      'Dawn',
    ],
  },
  {
    make: 'Aston Martin',
    aliases: [],
    models: [
      'DBX',
      'Vantage',
      'DB12',
      'DB11',
    ],
  },
  {
    make: 'McLaren',
    aliases: [],
    models: [
      'GT',
      'Artura',
      '720S',
      '750S',
    ],
  },
  {
    make: 'Tesla',
    aliases: [],
    models: [
      'Model 3',
      'Model Y',
      'Model S',
      'Model X',
    ],
  },
  {
    make: 'Reva',
    aliases: ['Mahindra Reva'],
    models: [
      'Reva',
      'Reva i',
    ],
  },
  {
    make: 'San Motors',
    aliases: [],
    models: [
      'San Storm',
    ],
  },
];

export const ALL_MAKES = VEHICLE_CATALOGUE.map((c) => c.make);

export interface FlatModelItem {
  model: string;
  make: string;
}

export const ALL_FLAT_MODELS: FlatModelItem[] = VEHICLE_CATALOGUE.flatMap((company) =>
  company.models.map((modelName) => ({
    model: modelName,
    make: company.make,
  }))
);

/**
 * Finds exact or matching make entry in catalogue
 */
export function findVehicleMake(makeName: string): VehicleMakeData | undefined {
  const clean = (makeName || '').trim().toLowerCase();
  if (!clean) return undefined;

  return VEHICLE_CATALOGUE.find((c) => {
    if (c.make.toLowerCase() === clean) return true;
    if (c.aliases?.some((a) => a.toLowerCase() === clean)) return true;
    if (c.make.toLowerCase().includes(clean)) return true;
    return false;
  });
}

/**
 * Search/rank models according to current make and search query
 */
export function searchModels(
  modelQuery: string,
  selectedMake?: string,
  maxResults = 15
): FlatModelItem[] {
  const q = (modelQuery || '').trim().toLowerCase();
  const currentMakeObj = selectedMake ? findVehicleMake(selectedMake) : undefined;
  const currentMakeName = currentMakeObj?.make.toLowerCase();

  // If a make is selected and no query typed yet, return all models for that make
  if (!q && currentMakeObj) {
    return currentMakeObj.models.map((m) => ({
      model: m,
      make: currentMakeObj.make,
    }));
  }

  // If both query and make are empty, return empty
  if (!q && !selectedMake) {
    return [];
  }

  const primaryMakeMatches: FlatModelItem[] = [];
  const otherMakeMatches: FlatModelItem[] = [];
  const seenModelsForCurrentMake = new Set<string>();

  for (const item of ALL_FLAT_MODELS) {
    const isCurrentMake = currentMakeName && item.make.toLowerCase() === currentMakeName;
    const modelLower = item.model.toLowerCase();

    // If query is present, check match
    if (q) {
      if (modelLower === q) {
        if (isCurrentMake) {
          primaryMakeMatches.unshift(item);
          seenModelsForCurrentMake.add(modelLower);
        } else {
          otherMakeMatches.unshift(item);
        }
      } else if (modelLower.startsWith(q)) {
        if (isCurrentMake) {
          primaryMakeMatches.push(item);
          seenModelsForCurrentMake.add(modelLower);
        } else {
          otherMakeMatches.push(item);
        }
      } else {
        const words = modelLower.split(/[\s/-]+/);
        if (words.some((w) => w.startsWith(q)) || modelLower.includes(q)) {
          if (isCurrentMake) {
            primaryMakeMatches.push(item);
            seenModelsForCurrentMake.add(modelLower);
          } else {
            otherMakeMatches.push(item);
          }
        }
      }
    } else if (isCurrentMake) {
      primaryMakeMatches.push(item);
    }
  }

  // If a make was chosen, prioritize its models; if none or few match, include others
  const results = [...primaryMakeMatches, ...otherMakeMatches];
  return results.slice(0, maxResults);
}
