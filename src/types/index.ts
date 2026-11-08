export type PetType = 'dog_puppy' | 'dog_small' | 'dog_medium' | 'dog_large' | 'cat';

export type ServiceType = 'walk' | 'sitting' | 'grooming';

export interface PetOption {
  id: PetType;
  name: string;
  weight: string;
  icon: string;
  emoji: string;
  description: string;
}

export interface ServiceOption {
  id: ServiceType;
  title: string;
  subtitle: string;
  basePrice: number;
  unit: string;
  iconName: string;
}

export interface ExtraAddon {
  id: string;
  title: string;
  description: string;
  price: number;
  availableFor: ServiceType[];
}

export interface BusinessConfig {
  businessName: string;
  city: string;
  phone: string;
  telegram: string;
  telegramChatId: string; // ID для мгновенных уведомлений
  whatsapp: string;
  workingHours: string;
  basePrices: {
    walk: number;       // за 45 мин прогулку
    sitting: number;    // за сутки передержки
    grooming: number;   // базовый комплекс
  };
  petMultipliers: {
    dog_puppy: number;
    dog_small: number;
    dog_medium: number;
    dog_large: number;
    cat: number;
  };
  addons: ExtraAddon[];
}

export interface OrderItem {
  id: string;
  petType: PetType;
  petName: string;
  breed?: string;
  serviceType: ServiceType;
  durationOrDays: number;
  addons: string[];
  totalPrice: number;
  notes?: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  date: string;
  timeSlot: string;
  status: 'new' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export const INITIAL_BUSINESS_CONFIG: BusinessConfig = {
  businessName: 'Лапки',
  city: 'Москва',
  phone: '+7 (999) 123-45-67',
  telegram: 'lapki_care',
  telegramChatId: '5101407422',
  whatsapp: '+79991234567',
  workingHours: '08:00 – 22:00 ежедневно',
  basePrices: {
    walk: 500,
    sitting: 1000,
    grooming: 1800,
  },
  petMultipliers: {
    dog_puppy: 1.1,
    dog_small: 1.0,
    dog_medium: 1.2,
    dog_large: 1.4,
    cat: 0.9,
  },
  addons: [
    {
      id: 'paw_wash',
      title: 'Мытьё лап и сушка',
      description: 'Чистые лапки и животик после активной прогулки специальным щадящим шампунем',
      price: 200,
      availableFor: ['walk'],
    },
    {
      id: 'training',
      title: 'Отработка команд (15 мин)',
      description: 'Повторение «Рядом», «Сидеть», «Ко мне» с лакомствами владельца',
      price: 300,
      availableFor: ['walk'],
    },
    {
      id: 'photo_report',
      title: 'Фото/видео отчёт с прогулки',
      description: 'Селфи с питомцем, маршрут прогулки и отчет о настроении в Telegram',
      price: 0,
      availableFor: ['walk', 'sitting', 'grooming'],
    },
    {
      id: 'own_food_prep',
      title: 'Особое меню / приём лекарств',
      description: 'Приготовление натуралки по рецепту или подача витаминов строго по часам',
      price: 250,
      availableFor: ['sitting'],
    },
    {
      id: 'deshedding',
      title: 'Экспресс-линька / вычес колтунов',
      description: 'Глубокое вычесывание подшерстка, минус 80% шерсти в квартире',
      price: 700,
      availableFor: ['grooming'],
    },
    {
      id: 'claw_trim',
      title: 'Стрижка когтей + подпил',
      description: 'Аккуратная обработка когтерезом и гриндером без боли и стресса',
      price: 300,
      availableFor: ['grooming', 'sitting', 'walk'],
    },
  ],
};

export const PET_OPTIONS: PetOption[] = [
  {
    id: 'dog_puppy',
    name: 'Щенок',
    weight: 'до 6 месяцев',
    icon: 'Dog',
    emoji: '🐾',
    description: 'Бережный присмотр, мягкая социализация и приучение к поводку',
  },
  {
    id: 'dog_small',
    name: 'Маленькая собака',
    weight: 'до 5 кг (шпиц, йорк, чихуахуа)',
    icon: 'Dog',
    emoji: '🐶',
    description: 'Бережный уход для миниатюрных пород',
  },
  {
    id: 'dog_medium',
    name: 'Средняя собака',
    weight: '5–15 кг (корги, бигль, пудель)',
    icon: 'Dog',
    emoji: '🐕',
    description: 'Энергичные прогулки и активные игры',
  },
  {
    id: 'dog_large',
    name: 'Крупная собака',
    weight: 'от 15 кг (ретривер, хаски, овчарка)',
    icon: 'Dog',
    emoji: '🦮',
    description: 'Уверенный контроль, физические нагрузки',
  },
  {
    id: 'cat',
    name: 'Кошка / Кот',
    weight: 'Любая порода и возраст',
    icon: 'Cat',
    emoji: '🐱',
    description: 'Визиты зооняни на дом, игры или груминг без стресса',
  },
];
