"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PET_OPTIONS, PetType, ServiceType } from '@/types';
import { 
  Sparkles, 
  Check, 
  Heart, 
  ShieldCheck, 
  Clock, 
  Camera, 
  Scissors, 
  Footprints, 
  Home, 
  Send,
  Plus,
  Minus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Calculator: React.FC = () => {
  const { config, addOrder } = useApp();

  // Выбранные параметры (по умолчанию - щенок)
  const [selectedPet, setSelectedPet] = useState<PetType>('dog_puppy');
  const [selectedService, setSelectedService] = useState<ServiceType>('walk');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['photo_report']);

  // Поля формы заявки
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Утро (08:00 - 11:00)');

  // Статус отправки
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);

  // Расчёт стоимости
  const baseServicePrice = config.basePrices?.[selectedService] || 500;
  const multiplier = config.petMultipliers?.[selectedPet] || 1;
  const singleServiceCost = Math.round((baseServicePrice * multiplier) / 10) * 10;
  const servicesTotal = singleServiceCost * quantity;

  // Стоимость доп. услуг
  const availableAddons = (config.addons || []).filter((addon) =>
    addon.availableFor.includes(selectedService)
  );

  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = (config.addons || []).find((a) => a.id === addonId);
    if (!addon) return sum;
    return sum + (addon.price * (selectedService === 'sitting' ? quantity : 1));
  }, 0);

  const finalPrice = servicesTotal + addonsTotal;

  // Переключение доп. услуги
  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  // Отправка заявки
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert('Пожалуйста, укажите имя и телефон для связи!');
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      petType: selectedPet,
      petName: petName || 'Любимец',
      breed: petBreed,
      serviceType: selectedService,
      durationOrDays: quantity,
      addons: selectedAddons,
      totalPrice: finalPrice,
      notes,
      clientName,
      clientPhone,
      clientAddress,
      date: date || '2026-11-09',
      timeSlot,
    };

    // 1. Сохраняем локально в кабинет
    const order = addOrder(orderData);
    setSubmittedOrderId(order.id);

    // 2. Отправляем в Telegram мастеру
    try {
      await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
    } catch (err) {
      console.error('Ошибка отправки в Telegram:', err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  const currentPetObj = PET_OPTIONS.find((p) => p.id === selectedPet) || PET_OPTIONS[0];

  return (
    <section className="py-4 sm:py-6 px-3 sm:px-4 max-w-4xl mx-auto overflow-hidden">
      {/* Баннер / Преимущества */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/40 dark:from-stone-900 dark:via-stone-900 dark:to-amber-950/30 rounded-3xl p-5 sm:p-8 mb-6 sm:mb-8 border border-amber-200/50 dark:border-amber-900/40 shadow-xs relative overflow-hidden transition-colors">
        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200/60 dark:bg-amber-900/60 rounded-full text-xs font-semibold text-amber-900 dark:text-amber-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            Интерактивный расчёт за 30 секунд
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight leading-tight mb-3">
            Заботливый выгул, передержка и груминг в г. {config.city}
          </h1>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed mb-4">
            Проверенные догситтеры с кинологическим опытом. Фотоотчеты с каждой прогулки, бережное мытье лап и полное спокойствие за хвостика.
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs font-medium text-stone-700 dark:text-stone-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Договор и страховка</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Фото/видео в Telegram</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              <span>Только любовь и забота</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex absolute -right-6 -bottom-6 w-56 h-56 bg-amber-200/30 dark:bg-amber-900/20 rounded-full items-center justify-center text-7xl select-none">
          🐕
        </div>
      </div>

      {/* ШАГ 1: ВЫБОР ПИТОМЦА */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">1</span>
            Кто ваш питомец?
          </h2>
          <span className="text-xs text-stone-700 dark:text-stone-400">Размер влияет на тариф</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
          {PET_OPTIONS.map((pet) => {
            const isSelected = selectedPet === pet.id;
            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => setSelectedPet(pet.id)}
                className={`p-3 sm:p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between h-34 sm:h-36 cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-md shadow-amber-500/10 scale-[1.01]'
                    : 'border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-stone-700 bg-white dark:bg-stone-900'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl sm:text-3xl">{pet.emoji}</span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 leading-tight">{pet.name}</div>
                  <div className="text-[10px] sm:text-[11px] text-stone-700 dark:text-stone-400 mt-1 line-clamp-2 leading-tight">{pet.weight}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ШАГ 2: ВЫБОР УСЛУГИ */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">2</span>
            Какая услуга нужна?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Выгул */}
          <button
            type="button"
            onClick={() => setSelectedService('walk')}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              selectedService === 'walk'
                ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-md shadow-amber-500/10'
                : 'border-stone-200 dark:border-stone-800 hover:border-amber-300 bg-white dark:bg-stone-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Footprints className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-stone-900 dark:text-stone-100 text-base">
                {Math.round(((config.basePrices?.walk || 500) * multiplier) / 10) * 10} ₽
                <span className="text-xs text-stone-700 dark:text-stone-400 font-normal"> / 45 мин</span>
              </span>
            </div>
            <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">Прогулка / Выгул</div>
            <p className="text-xs text-stone-700 dark:text-stone-400 mt-1">
              Активный выгул по любимому маршруту, игры, мытьё лап и свежая вода.
            </p>
          </button>

          {/* Передержка */}
          <button
            type="button"
            onClick={() => setSelectedService('sitting')}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              selectedService === 'sitting'
                ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-md shadow-amber-500/10'
                : 'border-stone-200 dark:border-stone-800 hover:border-amber-300 bg-white dark:bg-stone-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-stone-900 dark:text-stone-100 text-base">
                {Math.round(((config.basePrices?.sitting || 1000) * multiplier) / 10) * 10} ₽
                <span className="text-xs text-stone-700 dark:text-stone-400 font-normal"> / день</span>
              </span>
            </div>
            <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">Передержка / Зооняня</div>
            <p className="text-xs text-stone-700 dark:text-stone-400 mt-1">
              Уютная домашняя обстановка без клеток. Соблюдение вашего режима сна и еды.
            </p>
          </button>

          {/* Груминг */}
          <button
            type="button"
            onClick={() => setSelectedService('grooming')}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              selectedService === 'grooming'
                ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-md shadow-amber-500/10'
                : 'border-stone-200 dark:border-stone-800 hover:border-amber-300 bg-white dark:bg-stone-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-stone-900 dark:text-stone-100 text-base">
                {Math.round(((config.basePrices?.grooming || 1800) * multiplier) / 10) * 10} ₽
                <span className="text-xs text-stone-700 dark:text-stone-400 font-normal"> / комплекс</span>
              </span>
            </div>
            <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">Груминг и SPA</div>
            <p className="text-xs text-stone-700 dark:text-stone-400 mt-1">
              Купание проф. косметикой, гигиена ушек, стрижка когтей, сушка феном.
            </p>
          </button>
        </div>

        {/* Счётчик количества */}
        {selectedService !== 'grooming' && (
          <div className="mt-4 p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                {selectedService === 'walk' ? 'Количество прогулок' : 'Количество дней передержки'}
              </div>
              <div className="text-xs text-stone-700 dark:text-stone-400">
                {selectedService === 'walk' ? 'Можно оформить блоком на несколько дней' : 'Срок пребывания питомца'}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-700 font-bold active:scale-95 cursor-pointer touch-manipulation"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-black text-lg text-stone-900 dark:text-stone-100 min-w-8 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-700 font-bold active:scale-95 cursor-pointer touch-manipulation"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ШАГ 3: ДОПОЛНИТЕЛЬНЫЕ ОПЦИИ */}
      {availableAddons.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">3</span>
              Дополнительные опции и забота
            </h2>
          </div>

          <div className="space-y-2.5">
            {availableAddons.map((addon) => {
              const isChecked = selectedAddons.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 shadow-xs'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-lg mt-0.5 flex items-center justify-center border transition shrink-0 ${
                        isChecked
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-stone-900 dark:text-stone-100 leading-snug">{addon.title}</div>
                      <p className="text-xs text-stone-700 dark:text-stone-400 mt-0.5">{addon.description}</p>
                    </div>
                  </div>

                  <div className="text-right pl-3 shrink-0">
                    <span className={`text-sm font-bold ${addon.price === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-900 dark:text-stone-100'}`}>
                      {addon.price === 0 ? 'Бесплатно' : `+${addon.price} ₽`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ИТОГОВЫЙ БЛОК И ФОРМА ЗАЯВКИ */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-amber-500/30 p-5 sm:p-7 shadow-xl shadow-amber-500/5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 dark:border-stone-800 gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400">Итоговая стоимость</div>
            <div className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50 mt-1">
              {finalPrice.toLocaleString('ru-RU')} ₽
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-400 mt-1">
              Включает: {currentPetObj.name}, {selectedService === 'walk' ? `${quantity} прогулка(и)` : selectedService === 'sitting' ? `${quantity} сут. передержки` : 'комплекс груминга'}
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-3 text-xs text-amber-900 dark:text-amber-200 max-w-xs">
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              Ответим в течение 10 минут
            </div>
            Мы согласуем точное время выезда и пришлем анкету питомца в Telegram.
          </div>
        </div>

        {isSuccess ? (
          <div className="pt-8 pb-4 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
              🎉
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">Заявка принята и отправлена в Telegram!</h3>
            <p className="text-stone-600 dark:text-stone-300 text-sm max-w-md mx-auto mb-6">
              Спасибо, <b>{clientName}</b>! Уведомление уже прилетело мастеру в Telegram. Скоро свяжемся с вами по телефону <b>{clientPhone}</b>.
            </p>
            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className="px-6 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold rounded-xl text-sm transition cursor-pointer"
            >
              Оформить ещё одну заявку
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Ваше имя *</label>
                <input
                  type="text"
                  required
                  placeholder="Например, Екатерина"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Номер телефона *</label>
                <input
                  type="tel"
                  required
                  placeholder="+7 (999) 000-00-00"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Кличка и порода хвостика</label>
                <input
                  type="text"
                  placeholder="Бим, Корги (1 год)"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Адрес выезда в г. {config.city}</label>
                <input
                  type="text"
                  placeholder="Улица, дом, подъезд"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Желаемая дата</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Удобное время</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm"
                >
                  <option>Утро (07:30 – 10:00)</option>
                  <option>День (12:00 – 15:00)</option>
                  <option>Вечер (18:00 – 21:30)</option>
                  <option>Договориться индивидуально</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Пожелания или особенности характера</label>
              <textarea
                rows={2}
                placeholder="Тянет поводок, боится грома, любит мячик, аллергия на курицу..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-extrabold text-base shadow-lg shadow-orange-500/25 hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer touch-manipulation disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Отправка...' : `Забронировать за ${finalPrice.toLocaleString('ru-RU')} ₽`}</span>
            </button>
            <p className="text-[11px] text-center text-stone-700 dark:text-stone-400">
              Оплата после прогулки или знакомства с догситтером. Никаких скрытых платежей.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
