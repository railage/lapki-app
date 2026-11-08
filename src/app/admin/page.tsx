"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Calendar,
  Send,
  MessageSquare
} from 'lucide-react';

export default function AdminPage() {
  const { config, updateConfig, orders, updateOrderStatus, deleteOrder, resetToDefaults } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'prices' | 'contacts'>('orders');
  const [saveNotification, setSaveNotification] = useState(false);

  // Настройки
  const [businessName, setBusinessName] = useState(config.businessName);
  const [city, setCity] = useState(config.city);
  const [phone, setPhone] = useState(config.phone);
  const [telegram, setTelegram] = useState(config.telegram);
  const [telegramChatId, setTelegramChatId] = useState(config.telegramChatId || '5101407422');

  // Цены
  const [walkPrice, setWalkPrice] = useState(config.basePrices?.walk || 500);
  const [sittingPrice, setSittingPrice] = useState(config.basePrices?.sitting || 1000);
  const [groomingPrice, setGroomingPrice] = useState(config.basePrices?.grooming || 1800);

  const handleSaveSettings = () => {
    updateConfig({
      businessName,
      city,
      phone,
      telegram,
      telegramChatId,
      basePrices: {
        walk: Number(walkPrice),
        sitting: Number(sittingPrice),
        grooming: Number(groomingPrice),
      },
    });

    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-16">
      {/* Шапка админки */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
              title="На главную"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                <span>Кабинет владельца</span>
                <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-mono">
                  {config.businessName}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveNotification && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Сохранено
              </span>
            )}
            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить</span>
            </button>
          </div>
        </div>

        {/* Вкладки */}
        <div className="max-w-5xl mx-auto px-4 flex gap-6 text-sm font-semibold border-t border-stone-100">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Заявки клиентов
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            className={`py-3 border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'prices'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Прайс-лист и услуги
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-3 border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'contacts'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Контакты и Telegram
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        {/* ВКЛАДКА 1: ЗАЯВКИ */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
                <div className="text-4xl mb-2">🐾</div>
                <h3 className="font-bold text-stone-800">Пока нет новых заявок</h3>
                <p className="text-xs text-stone-700 mt-1">Они появятся здесь и в вашем Telegram.</p>
              </div>
            ) : (
              orders.map((order) => {
                const serviceTitles = {
                  walk: '🦮 Прогулка / Выгул',
                  sitting: '🏠 Передержка / Няня',
                  grooming: '✂️ Груминг и SPA',
                };

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-amber-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-500">#{order.id}</span>
                        <span className="font-bold text-stone-900 text-base">{serviceTitles[order.serviceType]}</span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            order.status === 'new'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {order.status === 'new' ? 'Новая' : order.status === 'confirmed' ? 'Подтверждена' : 'Выполнена'}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-black text-stone-900">{order.totalPrice.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 text-xs">
                      <div>
                        <div className="text-stone-700 font-semibold mb-1">Клиент:</div>
                        <div className="font-bold text-stone-900 text-sm">{order.clientName}</div>
                        <a
                          href={`tel:${order.clientPhone}`}
                          className="text-amber-600 font-semibold flex items-center gap-1 mt-0.5 hover:underline"
                        >
                          <Phone className="w-3 h-3" /> {order.clientPhone}
                        </a>
                      </div>

                      <div>
                        <div className="text-stone-700 font-semibold mb-1">Питомец:</div>
                        <div className="font-bold text-stone-900">
                          {order.petName} {order.breed ? `(${order.breed})` : ''}
                        </div>
                        <div className="text-stone-700 mt-0.5">
                          {order.durationOrDays} {order.serviceType === 'walk' ? 'прогулка(и)' : 'дней'}
                        </div>
                      </div>

                      <div>
                        <div className="text-stone-700 font-semibold mb-1">Дата и адрес:</div>
                        <div className="font-bold text-stone-900 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {order.date} ({order.timeSlot})
                        </div>
                        <div className="text-stone-700 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          {order.clientAddress || 'Адрес не указан'}
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="bg-amber-50/60 rounded-xl p-3 text-xs text-amber-900 mb-4 border border-amber-100">
                        <b>Особенности:</b> {order.notes}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      <div className="flex gap-2">
                        {order.status !== 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition cursor-pointer"
                          >
                            Подтвердить
                          </button>
                        )}
                        {order.status !== 'completed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg transition cursor-pointer"
                          >
                            В архив
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg transition cursor-pointer"
                        title="Удалить заявку"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ВКЛАДКА 2: ЦЕНЫ */}
        {activeTab === 'prices' && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 max-w-2xl">
            <h3 className="font-bold text-base text-stone-900 mb-4">Базовые тарифы мастера</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Выгул собаки (45 мин, базовая цена в ₽)
                </label>
                <input
                  type="number"
                  value={walkPrice}
                  onChange={(e) => setWalkPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Передержка / Няня (за 1 сутки, в ₽)
                </label>
                <input
                  type="number"
                  value={sittingPrice}
                  onChange={(e) => setSittingPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Груминг / Полный гигиенический комплекс (в ₽)
                </label>
                <input
                  type="number"
                  value={groomingPrice}
                  onChange={(e) => setGroomingPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm font-bold"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition cursor-pointer"
              >
                Применить изменения
              </button>
            </div>
          </div>
        )}

        {/* ВКЛАДКА 3: КОНТАКТЫ И TELEGRAM */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 max-w-2xl">
            <h3 className="font-bold text-base text-stone-900 mb-4">Данные бизнеса и привязка Telegram</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Название сервиса / Имя мастера</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Город мастера</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Телефон для звонков клиентов</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm"
                />
              </div>

              {/* Блок настройки Telegram Chat ID */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <label className="block text-xs font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-700" />
                  Telegram Chat ID для заявок
                </label>
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="Например: 5101407422"
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono font-bold"
                />
                <p className="text-[11px] text-amber-900 mt-2 leading-relaxed">
                  Куда отправлять уведомления о новых заказах. Чтобы узнать свой Chat ID или ID заказчика, откройте бота <b>@userinfobot</b> и нажмите «Старт».
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={resetToDefaults}
                className="text-stone-700 hover:text-stone-900 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Сбросить до демо-данных
              </button>

              <button
                onClick={handleSaveSettings}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition cursor-pointer"
              >
                Сохранить контакты
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
