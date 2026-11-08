import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      petName,
      petType,
      breed,
      serviceType,
      durationOrDays,
      addons,
      totalPrice,
      clientName,
      clientPhone,
      clientAddress,
      date,
      timeSlot,
      notes,
      targetChatId, // Передаем ID мастера из настроек сайта
    } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN || '9019434376:AAHmD_NSPY4fomimlsnQBlPauQzgd9iDc0g';
    // Если передан ID конкретного мастера — шлем ему, иначе берем системный по умолчанию
    const chatId = targetChatId || process.env.TELEGRAM_CHAT_ID || '5101407422';

    const petTypeNames: Record<string, string> = {
      dog_puppy: '🐾 Щенок (до 6 мес)',
      dog_small: '🐶 Маленькая собака (до 5 кг)',
      dog_medium: '🐕 Средняя собака (5-15 кг)',
      dog_large: '🦮 Крупная собака (15+ кг)',
      cat: '🐱 Кот / Кошка',
    };

    const serviceNames: Record<string, string> = {
      walk: '🦮 Выгул собаки',
      sitting: '🏠 Передержка / Няня',
      grooming: '✂️ Комплекс груминга',
    };

    const unitText = serviceType === 'walk' ? 'прогулок' : serviceType === 'sitting' ? 'дней' : 'комплекс';

    const message = `🔔 <b>НОВАЯ ЗАЯВКА С САЙТА «ЛАПКИ»!</b>

💰 <b>Сумма заказа: ${Number(totalPrice).toLocaleString('ru-RU')} ₽</b>

🐾 <b>Питомец:</b> ${petName} ${breed ? `(${breed})` : ''}
🏷 <b>Категория:</b> ${petTypeNames[petType] || petType}
🛠 <b>Услуга:</b> ${serviceNames[serviceType] || serviceType} (${durationOrDays} ${unitText})
${addons && addons.length > 0 ? `✨ <b>Доп. опции:</b> ${addons.join(', ')}\n` : ''}
👤 <b>Клиент:</b> ${clientName}
📞 <b>Телефон:</b> <a href="tel:${clientPhone}">${clientPhone}</a>
📍 <b>Адрес:</b> ${clientAddress || 'Не указан'}
📅 <b>Дата и время:</b> ${date} (${timeSlot})
${notes ? `📝 <b>Особенности/комментарий:</b> ${notes}\n` : ''}
───────────────
<i>Свяжитесь с клиентом в течение 10 минут!</i>`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('Telegram API error:', result);
      return NextResponse.json({ ok: false, error: result.description }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('API send-telegram error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
