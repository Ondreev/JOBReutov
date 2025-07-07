import { useEffect, useRef } from 'react'

const vacancies = [
  {
    id: 1,
    title: 'Повар',
    salary: 4500,
    desc: 'Можно без опыта или с небольшим опытом. Обязательна медкнижка.',
    address: 'Реутов, Калинина 8',
    restaurant: 'Сакура',
    contact: '+79099009271'
  },
  {
    id: 2,
    title: 'Курьер',
    salary: 6000,
    desc: 'На авто. Без опыта. 5–6 ч/день. Доставка еды.',
    address: 'Реутов, Ленина 15',
    restaurant: 'СушиВок',
    contact: '+74951400557'
  }
]

export default function MapApp() {
  const mapRef = useRef(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'script.src = 'https://api-maps.yandex.ru/2.1/?apikey=468777d2-9e2d-4fcb-ae82-c6a647cee84a
&lang=ru_RU'
    script.onload = () => {
      window.ymaps.ready(initMap)
    }
    document.head.appendChild(script)

    async function initMap() {
      const map = new window.ymaps.Map(mapRef.current, {
        center: [55.759, 37.863],
        zoom: 15,
        controls: ['zoomControl']
      })

      for (const { title, salary, desc, address, contact, restaurant } of vacancies) {
        try {
          const res = await window.ymaps.geocode(address)
          const coords = res.geoObjects.get(0).geometry.getCoordinates()

          const balloon = `
            <strong>${title}</strong><br/>
            ${restaurant} (${address})<br/>
            <em>${desc}</em><br/>
            <div style="margin-top: 6px">
              <a href='https://wa.me/${contact.replace('+', '')}' target='_blank'>
                📲 Связаться в WhatsApp
              </a>
            </div>
          `

          const caption = `${salary}₽\n${title}`
          const placemark = new window.ymaps.Placemark(coords, {
            hintContent: `${salary}₽/день`,
            iconCaption: caption,
            balloonContent: balloon
          }, {
            preset: 'islands#yellowCircleIconWithCaption'
          })

          map.geoObjects.add(placemark)
        } catch (err) {
          console.error(`Ошибка геокодирования адреса: ${address}`, err)
        }
      }
    }
  }, [])

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}
